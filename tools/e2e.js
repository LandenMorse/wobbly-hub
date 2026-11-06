// End-to-end check of the pages and the ?nettest ranked flow: `node tools/e2e.js` (needs Playwright; no Supabase, no network).
// Starts its own static server, drives the hub in several tabs of one browser, prints PASS/FAIL per case, exits 1 on any failure.
const http = require('http'), fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
const server = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let BASE, browser;
const gameFrame = (p) => p.frames().find(f => /play\.html/.test(f.url()));

// A fresh browser context. Shims: the 30 s no-show / 15 s absence timers run shortly; the hub exposes `me` so tests can walk.
async function context(errs) {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 640 } });
    await ctx.route(/index\.html/, async (route) => {
        const r = await route.fetch();
        await route.fulfill({ response: r, body: (await r.text()).replace('const me = makeBlob(', 'const me = window.__me = makeBlob(') });
    });
    ctx.on('page', (p) => p.on('pageerror', (e) => errs.push(e.message)));
    return ctx;
}
async function hub(ctx, name) {
    const p = await ctx.newPage();
    await p.goto(BASE + 'index.html?nettest');
    await p.fill('#name-input', name);
    await p.press('#name-input', 'Enter');
    await p.waitForFunction(() => document.getElementById('entry-screen').classList.contains('hidden'));
    return p;
}
// Walk to a ranked pad (world x) and hold S on it
async function queueAt(p, x) {
    await p.bringToFront();
    const left = x < 1200, key = left ? 'KeyA' : 'KeyD';
    await p.keyboard.down(key);
    await p.waitForFunction(([x, left]) => left ? window.__me.x <= x + 60 : window.__me.x >= x - 60, [x, left]);
    await p.keyboard.up(key);
    await p.waitForFunction(() => Math.abs(window.__me.vx) < 0.2);
    await p.keyboard.down('KeyS'); await sleep(1700); await p.keyboard.up('KeyS');
}
const results = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('wobbly.test.results') || '{}'));
const matches = (p) => p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('wobbly.test.matches') || '{}')));
async function untilGames(pages) { for (let i = 0; i < 100; i++) { const fs_ = pages.map(gameFrame); if (fs_.every(f => f)) { try { if ((await Promise.all(fs_.map(f => f.evaluate(() => net.inMatch)))).every(Boolean)) return fs_; } catch (e) { /* loading */ } } await sleep(200); } throw new Error('the match never started'); }
const ok = (c, msg) => { if (!c) throw new Error(msg); };

// A ranked match with `n` tabs: queue, check seats against match.players, finish it on the host, expect exactly one result
async function ranked(n, pad) {
    const errs = [], ctx = await context(errs), pages = [];
    try {
        for (let i = 0; i < n; i++) pages.push(await hub(ctx, 'Tester' + i));
        for (const p of pages) await queueAt(p, pad);
        const fr = await untilGames(pages);
        const ms = await matches(pages[0]);
        ok(ms.length === 1, `expected one match, got ${ms.length}`);
        const m = ms[0], codes = new Set(await Promise.all(fr.map(f => f.evaluate(() => net.code))));
        ok(codes.size === 1 && [...codes][0] === m.room_code, 'not all tabs are in the match room');
        const seen = await Promise.all(fr.map(f => f.evaluate(() => ({ id: net.id, seats: net.seats, host: net.isHost }))));
        for (const s of seen) for (const [seat, id] of Object.entries(s.seats)) ok(m.players.find(p => p.id === id).team === (seat % 2 ? 1 : 2), 'a seat is on the wrong team');
        ok(Object.keys(seen[0].seats).length === n, 'not everyone has a seat');
        ok(seen.filter(s => s.host).length === 1 && seen.find(s => s.host).id === m.host_id, 'the host is not the match host');
        const host = fr[seen.findIndex(s => s.host)];
        await host.evaluate(() => { scores = { 1: 5, 2: 1 }; endMatch(); endMatch(); });
        await sleep(800);
        const r = await results(pages[0]);
        ok(Object.keys(r).length === 1 && r[m.id] === 1, 'expected exactly one result for team 1: ' + JSON.stringify(r));
        const states = await Promise.all(fr.map(f => f.evaluate(() => state)));
        ok(states.every(s => s === 'GAMEOVER'), 'not everyone reached GAMEOVER: ' + states);
        ok(!errs.length, 'page errors: ' + errs.join('; '));
    } finally { await ctx.close(); }
}

// Two tabs in a ranked 1v1 soccer match; the guest's presence drops and comes back (no report), then drops for good (one report)
async function flicker() {
    const errs = [], ctx = await context(errs), pages = [];
    try {
        for (let i = 0; i < 2; i++) pages.push(await hub(ctx, 'Tester' + i));
        for (const p of pages) await queueAt(p, 350);
        const fr = await untilGames(pages), host = fr[0];
        const gid = await fr[1].evaluate(() => net.id);
        const leave = () => host.evaluate((id) => net.channel.recv({ k: 'leave', id }), gid);
        const join = () => host.evaluate((id) => net.channel.recv({ k: 'join', id, meta: { host: false, t: 1 } }), gid);
        const jump = () => host.evaluate(() => { const n = Date.now; Date.now = () => n() + 20000; });   // 15 s of absence pass
        await leave(); await sleep(300); await join(); await jump(); await sleep(1000);
        ok(Object.keys(await results(pages[0])).length === 0 && await host.evaluate(() => net.inMatch), 'a brief drop was reported or ended the match');
        await leave(); await sleep(300); await jump();   // the check runs again 15 s after the drop; wait for it
        for (let i = 0; i < 40 && !Object.keys(await results(pages[0])).length; i++) await sleep(500);
        ok(Object.keys(await results(pages[0])).length === 1, 'a real leave was not reported once');
        ok(!errs.length, 'page errors: ' + errs.join('; '));
    } finally { await ctx.close(); }
}

async function load() {
    const errs = [], ctx = await context(errs), p = await ctx.newPage();
    try {
        for (const u of ['index.html?nettest', 'play.html?game=soccer&nettest', 'play.html?game=volleyball&nettest']) { await p.goto(BASE + u); await sleep(600); }
        ok(!errs.length, 'page errors: ' + errs.join('; '));
    } finally { await ctx.close(); }
}

(async () => {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    BASE = `http://127.0.0.1:${server.address().port}/`;
    browser = await chromium.launch();
    const cases = [['hub and game pages load', load], ['1v1 soccer: queue, room, one result', () => ranked(2, 350)], ['2v2 volleyball: one match, seats from match.players, one result', () => ranked(4, 2050)], ['presence flicker: no report; real leave: one report', flicker]];
    let failed = 0;
    for (const [name, fn] of cases) {
        try { await fn(); console.log('PASS', name); } catch (e) { failed++; console.log('FAIL', name, '-', e.message); }
    }
    await browser.close(); server.close();
    process.exit(failed ? 1 : 0);
})();
