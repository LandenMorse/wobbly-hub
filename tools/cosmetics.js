#!/usr/bin/env node
/*
 * Cosmetics tool for Wobbly Hub. Node 18+, no npm install needed
 * (the browser checks use Playwright if it is available).
 *
 *   node tools/cosmetics.js new <category> <name>   scaffold shared/cosmetics/packs/<category>-<name>.js and add it to shared/cosmetics/load.js
 *   node tools/cosmetics.js check [--pack P] [--json] [--static]
 *                                                   validate every item (schema in Node, then a render audit in headless Chromium)
 *   node tools/cosmetics.js sheet <category> [--pack P] [--out file.png]
 *                                                   render a contact sheet of items for visual review
 *   node tools/cosmetics.js list                    counts per category and pack
 *
 * See docs/COSMETICS.md.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'shared', 'cosmetics');
const HTML = path.join(ROOT, 'games', 'soccer.html');
const LOADER = path.join(DIR, 'load.js');
const REGISTRY = path.join(DIR, 'registry.js');
const PACKS = path.join(DIR, 'packs');
const CATS = ['skin', 'hat', 'boots', 'acc', 'ball', 'arena'];
const FILE_RE = /^(skin|hat|boots|acc|ball|arena)-([a-z0-9][a-z0-9-]*)\.js$/;

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => args.includes('--' + name);
const opt = (name, d) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const die = (msg) => { console.error(msg); process.exit(1); };

// The pack list lives only in load.js: base packs first (in category order) so the originals keep the
// front of every picker, then the rest alphabetically. Every pack file must be listed there, and vice versa.
const LIST_RE = /(var packs = \[\n)([\s\S]*?)(\n    \];)/;
const orderPacks = (names) => {
    const base = CATS.map(c => `${c}-base`).filter(n => names.includes(n));
    return [...base, ...names.filter(n => !base.includes(n)).sort()];
};

function packFiles() {
    const listed = [...fs.readFileSync(LOADER, 'utf8').match(LIST_RE)[2].matchAll(/'([^']+)'/g)].map(m => m[1] + '.js');
    const onDisk = fs.readdirSync(PACKS).filter(f => f.endsWith('.js'));
    const bad = onDisk.filter(f => !FILE_RE.test(f) || !listed.includes(f));
    const missing = listed.filter(f => !onDisk.includes(f));
    if (missing.length) die(`load.js lists pack files that do not exist: ${missing.join(', ')}`);
    return { files: listed.filter(f => FILE_RE.test(f)), bad };
}

// Load the registry and packs in a sandbox with no DOM: schema validation only.
function loadStatic(files) {
    const sandbox = { console, Math, JSON, Object, Array, Map, Set, WeakMap, WeakSet, Number, String, Boolean, Error, Symbol };
    sandbox.globalThis = sandbox; sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(REGISTRY, 'utf8'), sandbox, { filename: 'shared/cosmetics/registry.js' });
    const extra = [];
    for (const f of files) {
        const before = sandbox.Cosmetics.summary().packs.length;
        try { vm.runInContext(fs.readFileSync(path.join(PACKS, f), 'utf8'), sandbox, { filename: 'shared/cosmetics/packs/' + f }); }
        catch (e) { extra.push({ level: 'error', pack: f, category: '', id: '', msg: `file failed to run: ${e.message}` }); continue; }
        const added = sandbox.Cosmetics.summary().packs.slice(before);
        const [, cat, name] = f.match(FILE_RE);
        if (!added.length) extra.push({ level: 'error', pack: f, category: cat, id: '', msg: 'file did not call Cosmetics.define' });
        for (const p of added) {
            if (p.pack !== `${cat}-${name}`) extra.push({ level: 'error', pack: p.pack, category: p.category, id: '', msg: `pack name must match the file name: use pack: '${cat}-${name}'` });
            if (p.category !== cat) extra.push({ level: 'error', pack: p.pack, category: p.category, id: '', msg: `file ${f} is for "${cat}" items but defines category "${p.category}"` });
        }
    }
    return { C: sandbox.Cosmetics, problems: [...extra, ...sandbox.Cosmetics.problems] };
}

async function withPage(fn) {
    let chromium;
    try { ({ chromium } = require('playwright')); }
    catch (e) { return { skipped: 'Playwright is not installed, so the render audit was skipped (schema checks still ran)' }; }
    let browser;
    try { browser = await chromium.launch(); }
    catch (e) {
        try { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); }
        catch (e2) { return { skipped: `could not start Chromium (${e.message.split('\n')[0]})` }; }
    }
    try {
        const page = await browser.newPage();
        const consoleErrors = [];
        page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
        page.on('pageerror', e => consoleErrors.push(String(e && e.message || e)));
        await page.goto(pathToFileURL(HTML).href + '?nettest');
        await page.waitForFunction(() => typeof Cosmetics !== 'undefined');
        await page.waitForTimeout(300);
        const out = await fn(page);
        return { out, consoleErrors };
    } finally { await browser.close(); }
}

const fmt = (p) => `${p.level === 'error' ? 'ERROR' : 'warn '} ${p.category || '?'}:${p.id || '-'} [${p.pack}] ${p.msg}`;

async function check() {
    const { files, bad } = packFiles();
    const only = opt('pack');
    const st = loadStatic(files);
    let problems = [...bad.map(f => ({ level: 'error', pack: f, category: '', id: '', msg: 'not listed in shared/cosmetics/load.js or not named <category>-<name>.js' })), ...st.problems];
    let browserNote = '';
    if (!flag('static')) {
        const res = await withPage(page => page.evaluate(() => Cosmetics.audit()));
        if (res.skipped) browserNote = res.skipped;
        else {
            // The audit includes registration problems too; keep the browser's copy (it has real CSS colour parsing).
            problems = [...st.problems.filter(p => !p.id && p.msg.includes('file')), ...res.out];
            for (const e of res.consoleErrors) problems.push({ level: 'error', pack: 'page', category: '', id: '', msg: `console error: ${e}` });
        }
    }
    const seen = new Set();
    problems = problems.filter(p => { const k = fmt(p); if (seen.has(k)) return false; seen.add(k); return true; });
    if (only) problems = problems.filter(p => p.pack === only || p.pack === only + '.js' || p.pack === 'page');
    const errors = problems.filter(p => p.level === 'error'), warns = problems.filter(p => p.level === 'warn');
    const sum = st.C.summary();
    if (flag('json')) console.log(JSON.stringify({ ok: !errors.length, total: sum.total, byCategory: sum.byCategory, errors, warnings: warns, note: browserNote || undefined }, null, 2));
    else {
        for (const p of [...errors, ...warns]) console.log(fmt(p));
        console.log(`\n${sum.total} cosmetics (${CATS.map(c => `${c} ${sum.byCategory[c]}`).join(', ')})`);
        if (browserNote) console.log('note: ' + browserNote);
        console.log(errors.length ? `FAILED: ${errors.length} error(s), ${warns.length} warning(s)` : `OK: 0 errors, ${warns.length} warning(s)`);
    }
    process.exit(errors.length ? 1 : 0);
}

async function sheet() {
    const cat = args[1];
    if (!CATS.includes(cat) || cat === 'arena') die(`usage: sheet <${CATS.filter(c => c !== 'arena').join('|')}> [--pack P] [--out file.png]`);
    const pack = opt('pack', '');
    const out = path.resolve(opt('out', path.join(ROOT, 'dist', `sheet-${cat}${pack ? '-' + pack : ''}.png`)));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const res = await withPage(page => page.evaluate(({ cat, pack }) => {
        const items = Cosmetics.list(cat, { all: true }).filter(it => !pack || it.pack === pack);
        const cell = 150, cols = 8, rows = Math.max(1, Math.ceil(items.length / cols)), z = 2;
        const cv = document.createElement('canvas');
        cv.width = cols * cell * z; cv.height = rows * cell * z;
        const g = cv.getContext('2d');
        g.scale(z, z);
        g.fillStyle = '#1e272e'; g.fillRect(0, 0, cols * cell, rows * cell);
        const get = (c, id) => Cosmetics.get(c, id);
        items.forEach((it, i) => {
            const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
            g.fillStyle = i % 2 ? '#263238' : '#22303a'; g.fillRect(x, y, cell, cell);
            g.save(); g.translate(x + cell / 2, y + (cat === 'ball' ? 62 : 64));
            const c = { r: cat === 'ball' ? 34 : 24, t: 0, look: 1, team: '#00d2ff', teamNum: 1, hat: cat === 'hat' ? it : get('hat', 'none') };
            if (cat === 'ball') Cosmetics.draw('ball', 'main', g, it, c);
            else {
                const skin = cat === 'skin' ? it : get('skin', 'classic');
                Cosmetics.draw('skin', 'body', g, skin, c);
                Cosmetics.draw('skin', 'extras', g, skin, c);
                if (cat === 'boots') Cosmetics.draw('boots', 'main', g, it, c);
                if (cat === 'hat') Cosmetics.draw('hat', 'main', g, it, c);
                const ex = c.r * 0.4, ey = -c.r * 0.4;
                g.fillStyle = '#fff'; g.beginPath(); g.arc(ex, ey, 6, 0, 7); g.fill();
                g.fillStyle = '#000'; g.beginPath(); g.arc(ex + 1.2, ey, 3, 0, 7); g.fill();
                if (cat === 'acc') Cosmetics.draw('acc', 'main', g, it, c);
            }
            g.restore();
            g.fillStyle = '#fff'; g.font = '700 12px sans-serif'; g.textAlign = 'center';
            g.fillText(it.name, x + cell / 2, y + cell - 22);
            g.fillStyle = '#8a98a5'; g.font = '10px monospace';
            g.fillText(it.id + (it.anim ? ' (anim)' : ''), x + cell / 2, y + cell - 8);
        });
        return { url: cv.toDataURL('image/png'), n: items.length };
    }, { cat, pack }));
    if (res.skipped) die(res.skipped);
    fs.writeFileSync(out, Buffer.from(res.out.url.split(',')[1], 'base64'));
    console.log(`sheet: ${res.out.n} ${cat} item(s) -> ${path.relative(process.cwd(), out)}`);
}

function list() {
    const { files, bad } = packFiles();
    if (bad.length) console.warn(`ignored files that are not listed in load.js or do not match <category>-<name>.js: ${bad.join(', ')}`);
    const { C } = loadStatic(files);
    const s = C.summary();
    console.log(`${s.total} cosmetics`);
    for (const c of CATS) console.log(`  ${c.padEnd(6)} ${String(s.byCategory[c]).padStart(4)}`);
    console.log('packs:');
    for (const p of s.packs) console.log(`  ${p.pack.padEnd(28)} ${p.category.padEnd(6)} ${String(p.count).padStart(4)}${p.author ? '  by ' + p.author : ''}`);
}

function scaffold() {
    const cat = args[1], name = args[2];
    if (!CATS.includes(cat) || !/^[a-z0-9][a-z0-9-]*$/.test(name || '')) die(`usage: new <${CATS.join('|')}> <name>   (name: lowercase letters, digits, dashes)`);
    const file = path.join(PACKS, `${cat}-${name}.js`);
    if (fs.existsSync(file)) die(`${path.relative(ROOT, file)} already exists`);
    const examples = {
        skin: `    { id: '${name.replace(/-/g, '_')}_example', name: 'Example', fill: '#2ecc71', pattern: ['hoops', '#ffffff'] }`,
        hat: `    {\n        id: '${name.replace(/-/g, '_')}_example', name: 'Example',\n        draw(g, c) {\n            const r = c.r;\n            u.rect(g, -0.5 * r, -1.9 * r, r, 0.8 * r, '#8e44ad');\n            u.ellipse(g, 0, -1.1 * r, 0.9 * r, 0.18 * r, 0, '#6c3483');\n        }\n    }`,
        boots: `    { id: '${name.replace(/-/g, '_')}_example', name: 'Example', colors: ['#8e44ad', '#2d3436'] }`,
        acc: `    {\n        id: '${name.replace(/-/g, '_')}_example', name: 'Example',\n        draw(g, c) {\n            u.circle(g, 0, 0.9 * c.r, 0.15 * c.r, '#f1c40f');\n        }\n    }`,
        ball: `    { id: '${name.replace(/-/g, '_')}_example', name: 'Example', fill: '#ffffff', pattern: ['hoops', '#e74c3c', 0.5, 0.2], trail: '231,76,60' }`,
        arena: `    { id: '${name.replace(/-/g, '_')}_example', name: 'Example', sky: ['#0b132b', '#1c2541'], ground: 'grass', grass: ['#2d6a4f', '#40916c'], line: 'rgba(255,255,255,0.3)', net: 'rgba(255,255,255,0.18)', post: '#ffffff' }`
    };
    fs.writeFileSync(file, `// ${cat} pack "${name}". Guide: docs/COSMETICS.md\nCosmetics.define({ pack: '${cat}-${name}', category: '${cat}', author: '' }, (u) => [\n${examples[cat]}\n]);\n`);
    const src = fs.readFileSync(LOADER, 'utf8');
    const names = [...src.match(LIST_RE)[2].matchAll(/'([^']+)'/g)].map(m => m[1]);
    const lines = orderPacks([...names, `${cat}-${name}`]).map(n => `        '${n}',`).join('\n');
    fs.writeFileSync(LOADER, src.replace(LIST_RE, (_, a, __, c) => a + lines + c));
    console.log(`new: wrote ${path.relative(ROOT, file)} and listed it in ${path.relative(ROOT, LOADER)}`);
}

(async () => {
    switch (cmd) {
        case 'check': await check(); break;
        case 'sheet': await sheet(); break;
        case 'list': list(); break;
        case 'new': scaffold(); break;
        default:
            console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n\/\*\n?/, '').replace(/^ \* ?/gm, ''));
            process.exit(cmd ? 1 : 0);
    }
})().catch(e => { console.error(e); process.exit(1); });
