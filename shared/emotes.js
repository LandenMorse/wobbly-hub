// Emotes: the pictures a player sends in a match and in the hub lobby (items are the 'emote' cosmetics, shared/cosmetics/packs/emote-*.js).
// Classic script; load after common.js. Each page wires it up:
//   Emotes.hooks = { self: () => key of our own player (or null), send: (id) => tell the others, enabled: () => keys and the button work now }
//   Emotes.receive(key, id)        a remote player's emote came in (key names who, ids come off the wire so they are checked here)
//   Emotes.draw(g, key, x, y)      draw that player's bubble with its tail tip at (x, y); call it in the page's draw loop
//   Emotes.mount(container)        adds the button and the picker panel (keys 1-8 send the slots, Q opens the panel)
// Network cost: one tiny message per emote, and no more than one per player per COOLDOWN, whatever the page does with it.
'use strict';
const Emotes = (() => {
    const STORE = 'wobbly.emotes.v1', SLOTS = 8;
    const COOLDOWN = 1500;   // ms between two emotes from us
    const RX_GAP = 700;      // a remote player's emote within this of their last one is dropped (a modified client cannot flood the screen)
    const SHOW_MS = 2600;
    const DEFAULT_SLOTS = ['wave', 'salute', 'middle_finger', 'gg', 'thumbs_up', 'laugh', 'heart', 'angry'];
    const hooks = { self: () => null, send: () => {}, enabled: () => true };

    // ---------- Our loadout: which emote sits on which number key, and whether we want to see other players' ----------
    const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } };
    const saved = load();
    const state = {
        slots: Array.from({ length: SLOTS }, (_, i) => Cosmetics.has('emote', saved.slots && saved.slots[i]) ? saved.slots[i] : DEFAULT_SLOTS[i]),
        hide: !!saved.hide
    };
    const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode */ } };

    // ---------- Bubbles ----------
    const bubbles = new Map();   // key -> { id, at }
    const rxAt = new Map();
    let lastSent = -1e9;
    const now = () => performance.now();
    function show(key, id) { if (key) bubbles.set(key, { id, at: now() }); }
    function receive(key, id) {
        if (state.hide || typeof key !== 'string' || typeof id !== 'string' || !Cosmetics.has('emote', id)) return;
        const t = now();
        if (t - (rxAt.get(key) || -1e9) < RX_GAP) return;
        rxAt.set(key, t);
        show(key, id);
    }
    function send(id) {
        const t = now();
        if (t - lastSent < COOLDOWN || !Cosmetics.has('emote', id)) return false;
        const key = hooks.self();
        if (!key) return false;
        lastSent = t;
        show(key, id);
        hooks.send(id);
        return true;
    }
    function clear(key) { if (key === undefined) { bubbles.clear(); rxAt.clear(); } else { bubbles.delete(key); rxAt.delete(key); } }

    const ictx = { r: 15, t: 0, look: 1, team: '', teamNum: 0, hat: null, zoom: 1 };
    const SIZE = 46;
    function draw(g, key, x, y) {
        const b = bubbles.get(key);
        if (!b) return;
        const age = now() - b.at;
        if (age > SHOW_MS) { bubbles.delete(key); return; }
        const p = Math.min(1, age / 220), pop = 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2);   // ease out with a little overshoot
        const fade = age > SHOW_MS - 500 ? (SHOW_MS - age) / 500 : 1;
        const rise = p * 6;
        ictx.t = age; ictx.zoom = Cosmetics.zoomOf(g);
        g.save();
        g.globalAlpha *= Math.max(0, fade);
        g.translate(x, y - rise); g.scale(Math.max(0.05, pop), Math.max(0.05, pop));
        const h = SIZE, w = SIZE, tail = 9;
        g.beginPath();
        g.moveTo(-w / 2 + 10, -tail - h); g.lineTo(w / 2 - 10, -tail - h); g.arcTo(w / 2, -tail - h, w / 2, -tail - h + 10, 10);
        g.lineTo(w / 2, -tail - 10); g.arcTo(w / 2, -tail, w / 2 - 10, -tail, 10);
        g.lineTo(7, -tail); g.lineTo(0, 0); g.lineTo(-7, -tail); g.lineTo(-w / 2 + 10, -tail);
        g.arcTo(-w / 2, -tail, -w / 2, -tail - 10, 10); g.lineTo(-w / 2, -tail - h + 10); g.arcTo(-w / 2, -tail - h, -w / 2 + 10, -tail - h, 10);
        g.closePath();
        g.fillStyle = 'rgba(255,255,255,0.96)'; g.fill();
        g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2; g.stroke();
        g.translate(0, -tail - h / 2);
        Cosmetics.draw('emote', 'main', g, Cosmetics.get('emote', b.id), ictx);
        g.restore();
    }

    // ---------- Picker UI ----------
    let panel = null, btn = null, slotBtns = [], grid = null, editing = false, editSlot = 0, hideBox = null;
    function thumb(id, px) {
        const cv = document.createElement('canvas');
        cv.width = cv.height = px * 2;
        const g = cv.getContext('2d');
        g.setTransform(2, 0, 0, 2, px, px);
        g.translate(0, 0);
        Cosmetics.draw('emote', 'main', g, Cosmetics.get('emote', id), { r: px * 0.36, t: 0, look: 1, team: '', teamNum: 0, hat: null, zoom: 2 });
        cv.style.width = cv.style.height = px + 'px';
        return cv;
    }
    function refreshPanel() {
        slotBtns.forEach((b, i) => {
            b.querySelector('canvas')?.remove();
            b.prepend(thumb(state.slots[i], 44));
            b.classList.toggle('sel', editing && i === editSlot);
            b.title = `${Cosmetics.get('emote', state.slots[i]).name} (${i + 1})`;
        });
        grid.classList.toggle('hidden', !editing);
        panel.querySelector('.em-edit').textContent = editing ? 'Done' : 'Change';
        hideBox.checked = !state.hide;
    }
    function buildGrid() {
        grid.innerHTML = '';
        for (const it of Cosmetics.list('emote')) {
            const b = document.createElement('button');
            b.className = `em-cell r-${it.rarity}`;
            b.title = it.name;
            b.append(thumb(it.id, 40));
            b.addEventListener('click', () => { state.slots[editSlot] = it.id; editSlot = (editSlot + 1) % SLOTS; save(); refreshPanel(); });
            grid.appendChild(b);
        }
    }
    const isOpen = () => panel && !panel.classList.contains('hidden');
    function toggle(open) {
        if (!panel) return;
        const o = open === undefined ? !isOpen() : open;
        panel.classList.toggle('hidden', !o);
        if (o) { editing = false; refreshPanel(); }
    }
    function mount(container) {
        btn = document.createElement('button');
        btn.id = 'emote-btn'; btn.className = 'icon-btn'; btn.title = 'Emotes (Q, then 1-8)'; btn.setAttribute('aria-label', 'Emotes'); btn.textContent = '😀';
        btn.addEventListener('click', (e) => { toggle(); e.currentTarget.blur(); });
        panel = document.createElement('div');
        panel.id = 'emote-panel'; panel.className = 'hidden';
        panel.innerHTML = '<div class="em-row"></div><div class="em-grid hidden"></div><div class="em-foot"><button class="em-edit"></button><label><input type="checkbox" class="em-show"> Show others\' emotes</label><span>Keys 1-8 · Q</span></div>';
        const row = panel.querySelector('.em-row');
        grid = panel.querySelector('.em-grid'); hideBox = panel.querySelector('.em-show');
        for (let i = 0; i < SLOTS; i++) {
            const b = document.createElement('button');
            b.className = 'em-slot';
            const n = document.createElement('span'); n.textContent = i + 1; b.appendChild(n);
            b.addEventListener('click', () => { if (editing) { editSlot = i; refreshPanel(); } else { send(state.slots[i]); toggle(false); } });
            row.appendChild(b); slotBtns.push(b);
        }
        panel.querySelector('.em-edit').addEventListener('click', () => { editing = !editing; refreshPanel(); });
        hideBox.addEventListener('change', () => { state.hide = !hideBox.checked; if (state.hide) bubbles.clear(); save(); });
        buildGrid();
        container.append(btn, panel);
    }
    window.addEventListener('keydown', (e) => {
        if (e.target && e.target.tagName === 'INPUT') return;
        if (!panel || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.code === 'Escape' && isOpen()) { toggle(false); return; }
        if (!hooks.enabled()) return;
        if (e.code === 'KeyQ') { toggle(); return; }
        const m = /^(?:Digit|Numpad)([1-8])$/.exec(e.code);
        if (m) { send(state.slots[+m[1] - 1]); toggle(false); }
    });

    const shown = (key) => (bubbles.get(key) || {}).id || null;   // the emote now above a player (tests)
    return { hooks, state, shown, send, receive, draw, clear, mount, toggle, COOLDOWN };
})();
