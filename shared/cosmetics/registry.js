/*
 * Wobbly Soccer cosmetics registry
 * ---------------------------------
 * One data-driven home for every cosmetic: skins, hats, boots, accessories,
 * balls and arenas. Items are declared in pack files under cosmetics/packs/
 * with Cosmetics.define(...), validated when they register, looked up by a
 * stable string id, and drawn through one renderer per category.
 *
 * Static items (no `anim: true`) are drawn once into a trimmed offscreen
 * sprite per (item, team, facing, size, zoom) and blitted after that, so the
 * per-frame cost of a cosmetic does not grow with how detailed it is.
 *
 * Authoring guide: docs/COSMETICS.md
 * This file has no game dependencies, so tools/cosmetics.js can load it in Node.
 */
(function (root) {
    'use strict';

    // ---------------------------------------------------------------------
    //  Categories
    //  bounds: the box (in multiples of the radius r, origin at the actor's
    //  centre, y down) a layer may draw inside. PAD px are added on every side
    //  for glows. Anything outside is cut off by the sprite cache, and the
    //  audit reports it as an error.
    // ---------------------------------------------------------------------
    const PAD = 24;
    const CATEGORIES = {
        skin:  { label: 'Skin',      def: 'classic', layers: { body: [-1.15, -1.4, 1.15, 1.8], extras: [-2.4, -2.6, 2.4, 2.1] } },
        hat:   { label: 'Hat',       def: 'none',    layers: { main: [-1.8, -3.2, 1.8, 0.6] } },
        boots: { label: 'Boots',     def: 'none',    layers: { main: [-1.2, 1.2, 1.2, 2.7] } },
        acc:   { label: 'Accessory', def: 'none',    layers: { main: [-1.7, -1.5, 1.7, 2.0] } },
        ball:  { label: 'Ball',      def: 'classic', layers: { main: [-1.25, -1.25, 1.25, 1.25] } },
        arena: { label: 'Arena',     def: 'night',   layers: {} },
        emote: { label: 'Emote',     def: 'wave',    layers: { main: [-1.25, -1.25, 1.25, 1.25] } }   // a picture a player sends; shown in a bubble above them
    };
    const COMMON_KEYS = ['id', 'name', 'rarity', 'tags', 'anim', 'cache', 'bounds', 'hidden', 'desc'];
    const CATEGORY_KEYS = {
        skin:  ['fill', 'pattern', 'draw', 'extras'],
        hat:   ['draw', 'lift', 'clearTop'],
        boots: ['colors', 'under', 'over', 'draw'],
        acc:   ['draw'],
        ball:  ['fill', 'pattern', 'draw', 'outline', 'trail', 'goal', 'fx'],
        arena: ['sky', 'ground', 'grass', 'line', 'net', 'post'],
        emote: ['draw']
    };
    const RARITIES = ['common', 'rare', 'epic', 'legendary'];
    const FX_PRESETS = ['fire', 'sparkle', 'smoke'];
    const FX_KEYS = ['color', 'speed', 'life', 'size', 'gravity', 'drag', 'every', 'minSpeed', 'spread', 'angle'];
    const GROUNDS = ['grass', 'neon', 'sand'];
    const ID_RE = /^[a-z][a-z0-9_]{1,31}$/;
    const TRAIL_RE = /^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/;

    const store = {};
    for (const cat in CATEGORIES) store[cat] = { list: [], byId: new Map(), visible: null, legacy: null };
    const problems = [];
    const packs = [];
    const hasDOM = typeof document !== 'undefined' && typeof document.createElement === 'function';
    let cacheOn = !(typeof location !== 'undefined' && /[?&]nocache\b/.test(location.search || ''));

    // ---------------------------------------------------------------------
    //  Validation helpers
    // ---------------------------------------------------------------------
    const COLOR_RE = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([^)]*\)|[a-z]+)$/i;
    function isColor(v) {
        if (typeof v !== 'string' || !v) return false;
        if (typeof CSS !== 'undefined' && CSS.supports) return CSS.supports('color', v);
        return COLOR_RE.test(v.trim());
    }
    const isFn = (v) => typeof v === 'function';
    const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

    function report(level, pack, cat, id, msg) {
        problems.push({ level, pack, category: cat, id, msg });
    }

    function validate(cat, it, pack) {
        const errs = [], warns = [];
        const known = new Set([...COMMON_KEYS, ...CATEGORY_KEYS[cat]]);
        for (const k of Object.keys(it)) if (!known.has(k)) warns.push(`unknown field "${k}" (typo?)`);
        if (!ID_RE.test(String(it.id))) errs.push(`id must be lowercase snake_case, 2-32 chars, starting with a letter (got ${JSON.stringify(it.id)})`);
        if (typeof it.name !== 'string' || !it.name.trim()) errs.push('name is required');
        else if (it.name.length > 18) errs.push(`name "${it.name}" is longer than 18 characters (it must fit the picker)`);
        if (it.rarity !== undefined && !RARITIES.includes(it.rarity)) errs.push(`rarity must be one of ${RARITIES.join(', ')}`);
        if (it.tags !== undefined && !(Array.isArray(it.tags) && it.tags.every(s => typeof s === 'string'))) errs.push('tags must be an array of strings');
        if (it.anim !== undefined && typeof it.anim !== 'boolean') errs.push('anim must be true or false');
        if (it.bounds !== undefined && !(Array.isArray(it.bounds) && it.bounds.length === 4 && it.bounds.every(isNum) && it.bounds[0] < it.bounds[2] && it.bounds[1] < it.bounds[3])) errs.push('bounds must be [x0, y0, x1, y1] in multiples of r');
        for (const k of ['draw', 'extras', 'under', 'over']) if (it[k] !== undefined && !isFn(it[k])) errs.push(`${k} must be a function (g, c)`);
        if (it.pattern !== undefined) {
            const list = normPatterns(it.pattern);
            if (!list) errs.push('pattern must be [name, ...args] or a list of those');
            else for (const p of list) if (!PATTERNS[p[0]]) errs.push(`unknown pattern "${p[0]}" (have: ${Object.keys(PATTERNS).join(', ')})`);
        }
        switch (cat) {
            case 'skin':
                if (it.fill !== undefined && !isFn(it.fill) && !isColor(it.fill)) errs.push('fill must be a colour or a function (g, c) returning a fill style');
                break;
            case 'hat':
                if (it.lift !== undefined && !(isNum(it.lift) && it.lift >= 0 && it.lift <= 120)) errs.push('lift must be a number from 0 to 120 (or leave it out to measure it)');
                if (it.clearTop !== undefined && typeof it.clearTop !== 'boolean') errs.push('clearTop must be true or false');
                break;
            case 'boots':
                if (it.colors !== undefined && !(Array.isArray(it.colors) && it.colors.length === 2 && it.colors.every(isColor))) errs.push('colors must be [bodyColour, soleColour]');
                if (it.draw && it.colors) warns.push('draw replaces the default boot, so colors is ignored');
                break;
            case 'ball':
                if (it.fill !== undefined && !isFn(it.fill) && !isColor(it.fill)) errs.push('fill must be a colour or a function (g, c) returning a fill style');
                if (it.outline !== undefined && it.outline !== false && !isColor(it.outline)) errs.push('outline must be a colour or false');
                if (it.trail !== undefined && !(typeof it.trail === 'string' && TRAIL_RE.test(it.trail))) errs.push('trail must be an "r,g,b" string like "255,120,40"');
                if (it.goal !== undefined && !(Array.isArray(it.goal) && it.goal.length && it.goal.every(isColor))) errs.push('goal must be a non-empty array of colours');
                if (it.fx !== undefined) {
                    if (typeof it.fx === 'string') { if (!FX_PRESETS.includes(it.fx)) errs.push(`fx preset must be one of ${FX_PRESETS.join(', ')}`); }
                    else if (it.fx && typeof it.fx === 'object') {
                        for (const k of Object.keys(it.fx)) if (!FX_KEYS.includes(k)) errs.push(`fx has unknown key "${k}"`);
                        const col = it.fx.color;
                        if (!(isColor(col) || (Array.isArray(col) && col.length && col.every(isColor)))) errs.push('fx.color must be a colour or an array of colours');
                        for (const k of FX_KEYS) if (k !== 'color' && it.fx[k] !== undefined && !isNum(it.fx[k])) errs.push(`fx.${k} must be a number`);
                    } else errs.push('fx must be a preset name or an emitter object');
                }
                break;
            case 'arena':
                if (!(Array.isArray(it.sky) && it.sky.length && it.sky.every(isColor))) errs.push('sky must be an array of colours (top to bottom)');
                if (!GROUNDS.includes(it.ground)) errs.push(`ground must be one of ${GROUNDS.join(', ')}`);
                if (it.ground === 'grass' && !(Array.isArray(it.grass) && it.grass.length === 2 && it.grass.every(isColor))) errs.push('grass arenas need grass: [stripeA, stripeB]');
                for (const k of ['line', 'net', 'post']) if (!isColor(it[k])) errs.push(`${k} must be a colour`);
                break;
        }
        return { errs, warns };
    }

    // ---------------------------------------------------------------------
    //  Registration
    // ---------------------------------------------------------------------
    /**
     * Cosmetics.define({ pack, category, author? }, items | (util) => items)
     * Each item is a plain object; see docs/COSMETICS.md for the fields.
     */
    function define(meta, items) {
        if (!meta || typeof meta !== 'object') throw new Error('Cosmetics.define: first argument must be { pack, category }');
        const cat = meta.category, pack = String(meta.pack || 'unnamed');
        if (!CATEGORIES[cat]) { report('error', pack, cat, '', `unknown category "${cat}" (have: ${Object.keys(CATEGORIES).join(', ')})`); return; }
        let list;
        try { list = isFn(items) ? items(util) : items; }
        catch (e) { report('error', pack, cat, '', `pack threw while building its items: ${e && e.message}`); return; }
        if (!Array.isArray(list)) { report('error', pack, cat, '', 'items must be an array'); return; }
        const s = store[cat];
        let added = 0;
        for (const raw of list) {
            if (!raw || typeof raw !== 'object') { report('error', pack, cat, '', 'item is not an object'); continue; }
            const { errs, warns } = validate(cat, raw, pack);
            for (const w of warns) report('warn', pack, cat, raw.id, w);
            if (s.byId.has(raw.id)) errs.push(`duplicate id "${raw.id}" (already defined by pack "${s.byId.get(raw.id).pack}")`);
            if (errs.length) { for (const e of errs) report('error', pack, cat, raw.id, e); continue; }
            const it = Object.freeze({
                ...raw,
                category: cat,
                pack,
                author: meta.author || '',
                rarity: raw.rarity || 'common',
                tags: Object.freeze((raw.tags || []).slice()),
                anim: !!raw.anim,
                patterns: normPatterns(raw.pattern) || null,
                index: s.list.length
            });
            s.list.push(it);
            s.byId.set(it.id, it);
            added++;
        }
        s.visible = null;
        packs.push({ pack, category: cat, author: meta.author || '', count: added });
    }

    /** Freeze the order of the cosmetics that saves and old clients referenced by number. */
    function legacy(cat, ids) { store[cat].legacy = ids.slice(); }

    // ---------------------------------------------------------------------
    //  Lookup
    // ---------------------------------------------------------------------
    function list(cat, opts) {
        const s = store[cat];
        if (opts && opts.all) return s.list;
        if (!s.visible) s.visible = s.list.filter(it => !it.hidden);
        return s.visible;
    }
    const has = (cat, id) => store[cat].byId.has(id);
    function defaultItem(cat) { const s = store[cat]; return s.byId.get(CATEGORIES[cat].def) || s.list[0] || null; }
    /** The item for an id, or the category default when the id is unknown. Never null once packs loaded. */
    function get(cat, id) { return store[cat].byId.get(id) || defaultItem(cat); }
    /** Turn anything a save file or the network might hold (id string, legacy index) into a valid id. */
    function resolve(cat, v) {
        const s = store[cat];
        if (typeof v === 'string' && s.byId.has(v)) return v;
        if (Number.isInteger(v) && s.legacy && v >= 0 && v < s.legacy.length && s.byId.has(s.legacy[v])) return s.legacy[v];
        const d = defaultItem(cat);
        return d ? d.id : '';
    }
    /** Next/previous visible id, wrapping around. */
    function step(cat, id, dir) {
        const l = list(cat);
        if (!l.length) return id;
        const it = store[cat].byId.get(id);
        let i = it ? l.indexOf(it) : -1;
        if (i < 0) i = 0; else i = (i + dir + l.length) % l.length;
        return l[i].id;
    }
    function count(cat) { return cat ? store[cat].list.length : Object.keys(store).reduce((n, c) => n + store[c].list.length, 0); }
    function search(cat, q) {
        q = String(q || '').trim().toLowerCase();
        const l = list(cat);
        if (!q) return l;
        return l.filter(it => it.name.toLowerCase().includes(q) || it.id.includes(q) || it.rarity === q || it.tags.some(t => t.toLowerCase().includes(q)));
    }

    // ---------------------------------------------------------------------
    //  Drawing helpers handed to every pack (Cosmetics.util, or the `u`
    //  argument of a define callback). All coordinates are in px around the
    //  actor's centre; multiply by c.r to stay resolution independent.
    // ---------------------------------------------------------------------
    const TAU = Math.PI * 2;
    function paint(g, fill, stroke, lw) {
        if (fill) { g.fillStyle = fill; g.fill(); }
        if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1.5; g.stroke(); }
    }
    function stops(gr, cols) {
        cols.forEach((c, i) => Array.isArray(c) ? gr.addColorStop(c[0], c[1]) : gr.addColorStop(cols.length === 1 ? 0 : i / (cols.length - 1), c));
        return gr;
    }
    function bodyPath(g, r) {
        g.beginPath();
        g.arc(0, -r * 0.3, r, Math.PI, 0, false);
        g.lineTo(r, r * 0.8);
        g.arc(0, r * 0.8, r * 0.9, 0, Math.PI, false);
        g.closePath();
    }
    function mulberry32(a) {
        return function () {
            a |= 0; a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    // Patterns fill the whole body (or ball) area and are clipped to it.
    // Used declaratively: pattern: ['hoops', '#e74c3c'] or a list of them.
    const PATTERNS = {
        hoops(g, c, color, gap = 0.6, thick = 0.28) {
            const r = c.r; g.fillStyle = color;
            for (let y = -1.2; y < 1.6; y += gap) g.fillRect(-r * 1.3, y * r, r * 2.6, r * thick);
        },
        stripes(g, c, color, gap = 0.36, thick = 0.07) {
            const r = c.r; g.fillStyle = color;
            for (let x = -1.1; x < 1.2; x += gap) g.fillRect(x * r, -r * 1.5, r * thick, r * 3.4);
        },
        band(g, c, color, y = 0.35, thick = 0.4) { const r = c.r; g.fillStyle = color; g.fillRect(-r * 1.3, y * r, r * 2.6, r * thick); },
        collar(g, c, color, thick = 0.2) { const r = c.r; g.fillStyle = color; g.fillRect(-r * 1.3, -r * 1.02, r * 2.6, r * thick); },
        sash(g, c, color, width = 0.35, dir = 1) {
            const r = c.r; g.strokeStyle = color; g.lineWidth = r * width; g.lineCap = 'butt';
            g.beginPath(); g.moveTo(-r * 1.1 * dir, -r * 1.1); g.lineTo(r * 1.1 * dir, r * 1.1); g.stroke();
        },
        checker(g, c, color, size = 0.4) {
            const r = c.r, s = r * size; g.fillStyle = color;
            const n = Math.ceil(1.2 / size);
            for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) if (!((i + j) & 1)) g.fillRect(i * s, j * s, s, s);
        },
        dots(g, c, color, size = 0.12, gap = 0.5) {
            const r = c.r; g.fillStyle = color;
            let row = 0;
            for (let y = -1.4; y < 1.9; y += gap, row++) for (let x = -1.2 + (row & 1) * gap / 2; x < 1.3; x += gap) {
                g.beginPath(); g.arc(x * r, y * r, size * r, 0, TAU); g.fill();
            }
        },
        bands(g, c, colors) {
            const r = c.r, bw = (r * 2.4) / colors.length;
            colors.forEach((col, i) => { g.fillStyle = col; g.fillRect(-r * 1.2 + i * bw, -r * 1.5, bw + 1, r * 3.4); });
        },
        rows(g, c, colors) {
            const r = c.r, bh = (r * 3.3) / colors.length;
            colors.forEach((col, i) => { g.fillStyle = col; g.fillRect(-r * 1.3, -r * 1.5 + i * bh, r * 2.6, bh + 1); });
        },
        blobs(g, c, colors, n = 6, seed = 1) {
            const r = c.r, rnd = mulberry32(seed);
            for (let i = 0; i < n; i++) {
                g.fillStyle = colors[i % colors.length];
                g.beginPath(); g.ellipse((rnd() * 2.2 - 1.1) * r, (rnd() * 2.8 - 1.2) * r, (0.25 + rnd() * 0.2) * r, (0.18 + rnd() * 0.15) * r, rnd() * 3, 0, TAU); g.fill();
            }
        },
        belly(g, c, color, w = 0.55, h = 0.7, y = 0.95) { const r = c.r; g.fillStyle = color; g.beginPath(); g.ellipse(0, y * r, w * r, h * r, 0, 0, TAU); g.fill(); },
        gradient(g, c, colors, dir = 'down') {
            const r = c.r;
            const gr = dir === 'across' ? g.createLinearGradient(-r, 0, r, 0) : g.createLinearGradient(0, -r * 1.4, 0, r * 1.8);
            g.fillStyle = stops(gr, colors); g.fillRect(-r * 1.3, -r * 1.5, r * 2.6, r * 3.4);
        }
    };
    function normPatterns(p) {
        if (p === undefined || p === null) return null;
        if (!Array.isArray(p) || !p.length) return null;
        const listp = typeof p[0] === 'string' ? [p] : p;
        return listp.every(x => Array.isArray(x) && typeof x[0] === 'string') ? listp : null;
    }

    const util = Object.freeze({
        TAU,
        rng: mulberry32,
        bodyPath,
        circle(g, x, y, rad, fill, stroke, lw) { g.beginPath(); g.arc(x, y, Math.max(0, rad), 0, TAU); paint(g, fill, stroke, lw); },
        ellipse(g, x, y, rx, ry, rot, fill, stroke, lw) { g.beginPath(); g.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot || 0, 0, TAU); paint(g, fill, stroke, lw); },
        rect(g, x, y, w, h, fill, stroke, lw) { g.beginPath(); g.rect(x, y, w, h); paint(g, fill, stroke, lw); },
        poly(g, pts, fill, stroke, lw) {
            g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); paint(g, fill, stroke, lw);
        },
        line(g, pts, stroke, lw, cap) {
            g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
            g.strokeStyle = stroke; g.lineWidth = lw || 2; g.lineCap = cap || 'round'; g.stroke();
        },
        star(g, x, y, outer, inner, points, fill, stroke, lw, rot) {
            g.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const a = (rot || -Math.PI / 2) + (i * Math.PI) / points, rr = i & 1 ? inner : outer;
                i ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
            }
            g.closePath(); paint(g, fill, stroke, lw);
        },
        /** Linear gradient. cols: ['#a', '#b'] spread evenly, or [[0, '#a'], [0.4, '#b'], ...]. */
        linear(g, x0, y0, x1, y1, cols) { return stops(g.createLinearGradient(x0, y0, x1, y1), cols); },
        radial(g, x0, y0, r0, x1, y1, r1, cols) { return stops(g.createRadialGradient(x0, y0, Math.max(0, r0), x1, y1, Math.max(0, r1)), cols); },
        /** The ball's disc, filled, with an optional outline. */
        disc(g, c, fill, outline, lw) { util.circle(g, 0, 0, c.r, fill, outline, lw); },
        /** Run fn with drawing clipped to the ball's disc. */
        clipDisc(g, c, fn) { g.save(); g.beginPath(); g.arc(0, 0, c.r, 0, TAU); g.clip(); fn(); g.restore(); },
        /** One default boot at foot x. */
        boot(g, c, x, body, sole) {
            const r = c.r;
            g.fillStyle = body; g.beginPath(); g.ellipse(x, 1.72 * r, 0.36 * r, 0.22 * r, 0, 0, TAU); g.fill();
            g.fillStyle = sole; g.fillRect(x - 0.36 * r, 1.84 * r, 0.72 * r, 0.09 * r);
        },
        /** Where the eyes are (accessories that sit on the face). */
        eyes(c) { const ex = c.r * 0.4 * c.look; return { x: ex, y: -c.r * 0.4, other: -ex }; },
        patterns: PATTERNS
    });

    // ---------------------------------------------------------------------
    //  Renderers: one per category layer. They draw an item in local space
    //  (origin at the centre, already rotated) and never leak canvas state.
    // ---------------------------------------------------------------------
    function applyPatterns(g, it, c) { if (it.patterns) for (const [name, ...args] of it.patterns) PATTERNS[name](g, c, ...args); }
    const RENDER = {
        skin: {
            body(g, it, c) {
                const r = c.r;
                g.fillStyle = isFn(it.fill) ? it.fill(g, c) : (it.fill || c.team);
                bodyPath(g, r); g.fill();
                g.shadowBlur = 0;
                g.save();
                bodyPath(g, r); g.clip();
                applyPatterns(g, it, c);
                if (it.draw) it.draw(g, c);
                g.fillStyle = util.linear(g, -r, 0, r, 0, ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.18)']);
                g.fillRect(-r * 1.2, -r * 1.5, r * 2.4, r * 3.3);
                g.restore();
                g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,0.25)';
                bodyPath(g, r); g.stroke();
            },
            extras(g, it, c) { if (it.extras) it.extras(g, c); }
        },
        hat: { main(g, it, c) { if (it.draw) it.draw(g, c); } },
        boots: {
            main(g, it, c) {
                if (it.draw) { it.draw(g, c); return; }
                if (!it.colors && !it.under && !it.over) return;
                for (const x of [-0.45 * c.r, 0.45 * c.r]) {
                    if (it.under) { g.save(); it.under(g, c, x); g.restore(); }
                    if (it.colors) util.boot(g, c, x, it.colors[0], it.colors[1]);
                    if (it.over) { g.save(); it.over(g, c, x); g.restore(); }
                }
            }
        },
        acc: { main(g, it, c) { if (it.draw) it.draw(g, c); } },
        emote: { main(g, it, c) { if (it.draw) it.draw(g, c); } },
        ball: {
            main(g, it, c) {
                if (it.draw) { it.draw(g, c); return; }
                const r = c.r;
                util.circle(g, 0, 0, r, isFn(it.fill) ? it.fill(g, c) : (it.fill || '#ffffff'));
                if (it.patterns) util.clipDisc(g, c, () => applyPatterns(g, it, c));
                if (it.outline !== false) util.circle(g, 0, 0, r, null, it.outline || 'rgba(0,0,0,0.25)', 1.5);
            }
        }
    };
    /** Whether a layer of an item draws anything at all (cheap, no pixels). */
    function layerUsed(cat, layer, it) {
        switch (cat) {
            case 'skin': return layer === 'body' || !!it.extras;
            case 'boots': return !!(it.draw || it.colors || it.under || it.over);
            case 'ball': return true;
            default: return !!it.draw;
        }
    }

    // ---------------------------------------------------------------------
    //  Sprite cache (LRU of trimmed offscreen canvases)
    // ---------------------------------------------------------------------
    const CACHE_MAX = 192;
    const sprites = new Map();
    const stats = { hits: 0, misses: 0, uncached: 0 };
    const warned = new WeakSet();
    function layerBounds(cat, layer, it) { return it.bounds || CATEGORIES[cat].layers[layer]; }
    function makeCanvas(w, h) {
        if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv;
    }
    // Draw a layer into a fresh canvas at `scale` device px per local px. Returns the canvas and the local origin offset.
    function rasterize(cat, layer, it, c, scale, bounds) {
        const r = c.r, b = bounds;
        const ox = -b[0] * r + PAD, oy = -b[1] * r + PAD;
        const w = Math.max(1, Math.ceil(((b[2] - b[0]) * r + PAD * 2) * scale));
        const h = Math.max(1, Math.ceil(((b[3] - b[1]) * r + PAD * 2) * scale));
        const cv = makeCanvas(w, h);
        const g = cv.getContext('2d', { willReadFrequently: true });
        g.setTransform(scale, 0, 0, scale, ox * scale, oy * scale);
        g.save(); RENDER[cat][layer](g, it, c); g.restore();
        return { cv, g, w, h, ox, oy };
    }
    function alphaBox(g, w, h) {
        const d = g.getImageData(0, 0, w, h).data;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) {
            const row = y * w * 4;
            for (let x = 0; x < w; x++) if (d[row + x * 4 + 3] > 2) {
                if (x < x0) x0 = x; if (x > x1) x1 = x;
                if (y < y0) y0 = y; if (y > y1) y1 = y;
            }
        }
        return x1 < 0 ? null : { x0, y0, x1, y1, data: d };
    }
    function sprite(cat, layer, it, c, scale) {
        const key = `${cat}|${layer}|${it.id}|${c.team}|${c.look}|${c.r}|${scale}|${c.hat && c.hat.clearTop ? 1 : 0}`;
        let s = sprites.get(key);
        if (s !== undefined) { sprites.delete(key); sprites.set(key, s); stats.hits++; return s; }
        stats.misses++;
        const ras = rasterize(cat, layer, it, c, scale, layerBounds(cat, layer, it));
        const box = alphaBox(ras.g, ras.w, ras.h);
        if (!box) s = null;
        else {
            const tw = box.x1 - box.x0 + 1, th = box.y1 - box.y0 + 1;
            const cv = makeCanvas(tw, th);
            cv.getContext('2d').drawImage(ras.cv, box.x0, box.y0, tw, th, 0, 0, tw, th);
            s = { cv, x: box.x0 / scale - ras.ox, y: box.y0 / scale - ras.oy, w: tw / scale, h: th / scale };
        }
        sprites.set(key, s);
        if (sprites.size > CACHE_MAX) sprites.delete(sprites.keys().next().value);
        return s;
    }
    /** The zoom of a context's current transform, rounded up to a 0.25 step so the sprite is never blurry. */
    function zoomOf(g) {
        if (!g.getTransform) return 1;
        const m = g.getTransform();
        return Math.min(4, Math.max(0.5, Math.ceil(Math.hypot(m.a, m.b) * 4 - 0.01) / 4));
    }

    /**
     * Draw one layer of an item at the context's current origin.
     * c: { r, t, look (1 right / -1 left), team (colour), teamNum, hat (hat item, for skin extras), zoom? }
     */
    function draw(cat, layer, g, it, c) {
        if (!it || !layerUsed(cat, layer, it)) return;
        if (cacheOn && hasDOM && !it.anim && it.cache !== false) {
            const s = sprite(cat, layer, it, c, c.zoom || zoomOf(g));
            if (s) g.drawImage(s.cv, s.x, s.y, s.w, s.h);
            return;
        }
        stats.uncached++;
        g.save();
        try { RENDER[cat][layer](g, it, c); }
        catch (e) { if (!warned.has(it)) { warned.add(it); console.warn(`[cosmetics] ${cat} "${it.id}" threw while drawing:`, e); } }
        g.restore();
    }

    // Hat lift: how far the charge meter and name tag rise above the head.
    const lifts = new Map();
    function hatLift(it, r) {
        if (!it) return 0;
        if (isNum(it.lift)) return it.lift;
        const key = it.id + '|' + r;
        if (lifts.has(key)) return lifts.get(key);
        let lift = 0;
        if (hasDOM && it.draw) {
            try {
                const ras = rasterize('hat', 'main', it, { r, t: 0, look: 1, team: '#00d2ff', teamNum: 1 }, 1, layerBounds('hat', 'main', it));
                const box = alphaBox(ras.g, ras.w, ras.h);
                if (box) lift = Math.max(0, Math.round(-(box.y0 - ras.oy) - 1.5 * r + 18));
            } catch (e) { /* measured as 0 */ }
        }
        lifts.set(key, lift);
        return lift;
    }

    // ---------------------------------------------------------------------
    //  Audit (browser): renders every item and checks it the way the game
    //  will use it. tools/cosmetics.js check runs this in headless Chromium.
    // ---------------------------------------------------------------------
    function audit(opts) {
        opts = opts || {};
        const out = problems.slice();
        if (!hasDOM) return out;
        const R = { skin: 32, hat: 32, boots: 32, acc: 32, ball: 18, emote: 18 };
        const add = (level, it, msg) => out.push({ level, pack: it.pack, category: it.category, id: it.id, msg });
        const variants = [{ look: 1, team: '#00d2ff', teamNum: 1 }, { look: -1, team: '#ff3838', teamNum: 2 }];
        const bare = { id: 'none', clearTop: true };
        const same = (a, b) => { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i + 3] - b[i + 3]) > 8 || Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i + 1] - b[i + 1]) > 8 || Math.abs(a[i + 2] - b[i + 2]) > 8) return false; return true; };
        const names = {};
        for (const cat of Object.keys(RENDER)) {
            names[cat] = new Map();
            for (const it of store[cat].list) {
                const lname = it.name.toLowerCase();
                if (names[cat].has(lname)) add('warn', it, `same name as "${names[cat].get(lname)}"`);
                else names[cat].set(lname, it.id);
                const r = R[cat];
                let drewSomething = false, usesTime = false, threw = false;
                for (const layer of Object.keys(CATEGORIES[cat].layers)) {
                    if (!layerUsed(cat, layer, it)) continue;
                    const big = CATEGORIES[cat].layers[layer].map(v => v * 2); // look for strays well outside the box
                    const allowed = layerBounds(cat, layer, it);
                    for (const v of variants) {
                        const c = { r, t: 0, ...v, hat: bare, zoom: 1 };
                        let a, b2, t1, t2;
                        try {
                            a = rasterize(cat, layer, it, c, 1, big);
                            b2 = rasterize(cat, layer, it, c, 1, big);
                            t1 = rasterize(cat, layer, it, { ...c, t: 1337 }, 1, big);
                            t2 = rasterize(cat, layer, it, { ...c, t: 523 }, 1, big);
                        } catch (e) { add('error', it, `${layer} threw: ${e && e.message}`); threw = true; break; }
                        const box = alphaBox(a.g, a.w, a.h);
                        if (!box) continue;
                        drewSomething = true;
                        const lx0 = box.x0 - a.ox, ly0 = box.y0 - a.oy, lx1 = box.x1 - a.ox, ly1 = box.y1 - a.oy;
                        const ax0 = allowed[0] * r - PAD, ay0 = allowed[1] * r - PAD, ax1 = allowed[2] * r + PAD, ay1 = allowed[3] * r + PAD;
                        if (lx0 < ax0 || ly0 < ay0 || lx1 > ax1 || ly1 > ay1) {
                            const f = (n) => (n / r).toFixed(2);
                            add('error', it, `${layer} draws outside its box: drew x ${f(lx0)}..${f(lx1)}, y ${f(ly0)}..${f(ly1)} (in r) but the box is [${allowed.join(', ')}] (+${PAD}px). Shrink it or set bounds.`);
                        }
                        if (!same(box.data, alphaBox(b2.g, b2.w, b2.h)?.data || [])) add('error', it, `${layer} draws differently each time at the same t (uses Math.random? use u.rng(seed) instead)`);
                        for (const tr of [t1, t2]) { const tb = alphaBox(tr.g, tr.w, tr.h); if (!tb || !same(box.data, tb.data)) usesTime = true; }
                    }
                    if (opts.timing !== false) {
                        const g = makeCanvas(8 * r, 8 * r).getContext('2d');
                        g.translate(4 * r, 4 * r);
                        const c = { r, t: 0, ...variants[0], hat: bare };
                        const N = 40, t0 = performance.now();
                        try { for (let i = 0; i < N; i++) { c.t = i * 16; g.save(); RENDER[cat][layer](g, it, c); g.restore(); } } catch (e) { /* reported above */ }
                        const ms = (performance.now() - t0) / N;
                        // Animated items are drawn every frame for up to 4 players; cached ones are drawn once.
                        if (it.anim && ms > (opts.slowAnimMs || 0.6)) add('error', it, `${layer} is animated and takes ${ms.toFixed(2)} ms per frame (budget 0.6 ms). Draw less, or drop anim so it is cached`);
                        else if (!it.anim && ms > (opts.slowMs || 4)) add('warn', it, `${layer} takes ${ms.toFixed(2)} ms to draw. It is cached, but keep it under 4 ms`);
                    }
                }
                const meantEmpty = it.id === 'none';
                if (!drewSomething && !meantEmpty && !threw) add('error', it, 'draws nothing');
                if (usesTime && !it.anim) add('error', it, 'changes over time but is missing anim: true (the cache would freeze it)');
                if (!usesTime && it.anim) add('warn', it, 'has anim: true but never changes over time; remove it so the item is cached');
            }
        }
        return out;
    }

    function summary() {
        const by = {};
        for (const cat in store) by[cat] = store[cat].list.length;
        return { total: count(), byCategory: by, packs: packs.slice(), errors: problems.filter(p => p.level === 'error').length, warnings: problems.filter(p => p.level === 'warn').length };
    }

    root.Cosmetics = Object.freeze({
        CATEGORIES, PAD, RARITIES, FX_PRESETS,
        define, legacy,
        get, has, list, resolve, step, count, search, defaultItem,
        draw, hatLift, zoomOf, util, patterns: PATTERNS,
        audit, summary, problems,
        cache: { stats, clear() { sprites.clear(); lifts.clear(); }, get enabled() { return cacheOn; }, set enabled(v) { cacheOn = !!v; sprites.clear(); } }
    });
})(typeof window !== 'undefined' ? window : globalThis);
