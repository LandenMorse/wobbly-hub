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
async function ranked(n, pad, bots) {
    const errs = [], ctx = await context(errs), pages = [];
    try {
        for (let i = 0; i < n; i++) pages.push(await hub(ctx, 'Tester' + i));
        for (const p of pages) await queueAt(p, pad);
        const fr = await untilGames(pages);
        const ms = await matches(pages[0]);
        ok(ms.length === 1 && !!ms[0].bots === !!bots, `expected one ${bots ? 'vs bots ' : ''}match, got ${JSON.stringify(ms)}`);
        const m = ms[0], codes = new Set(await Promise.all(fr.map(f => f.evaluate(() => net.code))));
        ok(codes.size === 1 && [...codes][0] === m.room_code, 'not all tabs are in the match room');
        const seen = await Promise.all(fr.map(f => f.evaluate(() => ({ id: net.id, seats: net.seats, host: net.isHost }))));
        for (const s of seen) for (const [seat, id] of Object.entries(s.seats)) ok(m.players.find(p => p.id === id).team === (seat % 2 ? 1 : 2), 'a seat is on the wrong team');
        ok(Object.keys(seen[0].seats).length === n, 'not everyone has a seat');
        ok(seen.filter(s => s.host).length === 1 && seen.find(s => s.host).id === m.host_id, 'the host is not the match host');
        if (bots) ok(await fr[0].evaluate(() => players.length === 4 && players.filter(p => p.isBot).map(seatOf).sort().join() === '2,4'), 'bots should play seats 2 and 4');
        const host = fr[seen.findIndex(s => s.host)];
        for (let i = 0; i < 40 && !(await Promise.all(fr.map(f => f.evaluate(() => netLink())))).every(l => l === 'host' || l === 'direct'); i++) await sleep(250);
        ok((await Promise.all(fr.map(f => f.evaluate(() => netLink())))).every(l => l === 'host' || l === 'direct'), 'not every guest has a data channel to the host');
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
        for (const p of pages) await queueAt(p, 290);
        const fr = await untilGames(pages), host = fr[0];
        const gid = await fr[1].evaluate(() => net.id);
        const leave = () => host.evaluate((id) => net.channel.recv({ k: 'leave', id }), gid);
        const join = () => host.evaluate((id) => net.channel.recv({ k: 'join', id, meta: { host: false, t: 1 } }), gid);
        const jump = () => host.evaluate(() => { const n = Date.now; Date.now = () => n() + 20000; });   // 15 s of absence pass
        await leave(); await sleep(300);
        ok(await host.evaluate(() => !seatActor(2).isBot), 'a player who just dropped out lost their seat to a bot');
        await join(); await jump(); await sleep(1000);
        ok(Object.keys(await results(pages[0])).length === 0 && await host.evaluate(() => net.inMatch), 'a brief drop was reported or ended the match');
        await leave(); await sleep(300); await jump();   // the check runs again 15 s after the drop; wait for it
        for (let i = 0; i < 40 && !Object.keys(await results(pages[0])).length; i++) await sleep(500);
        ok(Object.keys(await results(pages[0])).length === 1, 'a real leave was not reported once');
        ok(!errs.length, 'page errors: ' + errs.join('; '));
    } finally { await ctx.close(); }
}

// The CPU / LOCAL pad in the volleyball area: the game opens on its menu without a room; a CPU match starts from it
async function offline() {
    const errs = [], ctx = await context(errs);
    try {
        const p = await hub(ctx, 'Solo');
        await queueAt(p, 2110);
        let f;
        for (let i = 0; i < 50 && !(f = gameFrame(p)); i++) await sleep(200);
        ok(f && !/[?&](join|create)=/.test(f.url()), 'expected the game without a room: ' + (f && f.url()));
        await f.waitForFunction(() => typeof state !== 'undefined' && state === 'MENU' && !net.active);
        await f.evaluate(() => { settings.opponent = 'hard'; startMatch(); });
        await sleep(500);
        ok(await f.evaluate(() => !net.active && state !== 'MENU' && bots.some(b => b.p === players[1])), 'a CPU match did not start');
        ok(!errs.length, 'page errors: ' + errs.join('; '));
    } finally { await ctx.close(); }
}

// A ranked 1v1: the guest's data channel opens, snapshots and inputs skip the room channel; when it closes, the room channel takes over
async function direct() {
    const errs = [], ctx = await context(errs), pages = [];
    try {
        for (let i = 0; i < 2; i++) pages.push(await hub(ctx, 'Tester' + i));
        for (const p of pages) await queueAt(p, 290);
        const fr = await untilGames(pages);
        const roles = await Promise.all(fr.map(f => f.evaluate(() => net.isHost)));
        const host = fr[roles.indexOf(true)], guest = fr[roles.indexOf(false)];
        for (let i = 0; i < 40 && await guest.evaluate(() => netLink()) !== 'direct'; i++) await sleep(250);
        ok(await guest.evaluate(() => netLink()) === 'direct', 'the data channel did not open');
        // Count what the host puts on the room channel, and what the guest receives
        await host.evaluate(() => { window.__relayed = 0; const ch = net.channel, send = ch.send.bind(ch); ch.send = (m) => { if (m.event === 'snap') window.__relayed++; return send(m); }; });
        const t0 = await guest.evaluate(() => net.latestT);
        await sleep(1000);
        ok(await host.evaluate(() => window.__relayed) === 0, 'snapshots still went over the room channel');
        ok(await guest.evaluate(() => net.latestT) > t0 + 30, 'the guest did not get snapshots over the data channel');
        // An input over the data channel reaches the host's player for the guest's seat
        await pages[roles.indexOf(false)].bringToFront();
        await guest.evaluate(() => { keys.KeyD = true; netLocalChanged(); });
        await sleep(300);
        ok(await host.evaluate((s) => seatActor(s).input.right, await guest.evaluate(() => net.mySeat)), 'the input did not reach the host');
        await guest.evaluate(() => { keys.KeyD = false; netLocalChanged(); });
        await sleep(300);
        ok(!await host.evaluate((s) => seatActor(s).input.right, await guest.evaluate(() => net.mySeat)), 'the input release did not reach the host');
        // An effect is sent on several snapshots (packets get lost) and plays once
        await guest.evaluate(() => { window.__banners = 0; const play = netPlayFx; netPlayFx = (f) => { if (f[0] === 'b' && f[1] === 'E2E') window.__banners++; play(f); }; });
        await host.evaluate(() => showBanner('E2E', '', '#ffffff', 30));
        await sleep(600);
        ok(await guest.evaluate(() => window.__banners) === 1, 'an effect did not play exactly once');
        // The host's side of the channel goes silent while it still looks open: the guest says so and the room channel takes over
        await host.evaluate(() => { for (const r of Object.values(net.rtcs)) r.dc.send = () => {}; window.__relayed = 0; });
        for (let i = 0; i < 20 && await host.evaluate(() => window.__relayed) === 0; i++) await sleep(250);
        ok(await guest.evaluate(() => netLink()) === 'relay' && await host.evaluate(() => window.__relayed) > 0, 'a silent data channel was not detected');
        // The data channel closes for good: the room channel carries the match again
        await guest.evaluate(() => { net.rtcTries = 99; net.rtc.dc.close(); });
        for (let i = 0; i < 20 && await host.evaluate(() => Object.keys(net.rtcs).length); i++) await sleep(250);
        ok(await guest.evaluate(() => netLink()) === 'relay', 'the guest did not fall back to the room channel');
        const t1 = await guest.evaluate(() => net.latestT);
        await sleep(1000);
        ok(await host.evaluate(() => window.__relayed) > 0 && await guest.evaluate(() => net.latestT) > t1 + 30, 'snapshots did not come over the room channel after the fallback');
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
    const cases = [['hub and game pages load', load], ['1v1 soccer: queue, room, one result', () => ranked(2, 290)], ['2v2 volleyball: one match, seats from match.players, one result', () => ranked(4, 1795)], ['2v2 vs bots soccer: two players on Blue, bots on Red, one result', () => ranked(2, 605, true)], ['CPU / local pad: the game menu, no room, a CPU match runs', offline], ['presence flicker: no report; real leave: one report', flicker], ['peer to peer: snapshots and inputs on the data channel, fallback to the room channel', direct]];
    let failed = 0;
    for (const [name, fn] of cases) {
        try { await fn(); console.log('PASS', name); } catch (e) { failed++; console.log('FAIL', name, '-', e.message); }
    }
    await browser.close(); server.close();
    process.exit(failed ? 1 : 0);
})();
