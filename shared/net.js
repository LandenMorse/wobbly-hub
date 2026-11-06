// Shared engine, part 3: online rooms (Supabase Realtime, or ?nettest between tabs). The host runs the match, guests draw snapshots.
'use strict';

// =====================================================================
//  ONLINE MULTIPLAYER (Supabase Realtime: broadcast + presence)
//  The room's host runs the real simulation. Guests send their inputs
//  and draw interpolated snapshots of the host's world. No database
//  tables are needed: a room lives entirely in one Realtime channel.
//  Add ?nettest to the URL to test rooms between tabs without Supabase.
// =====================================================================
const SUPABASE_URL = 'https://arqtzivzpmouvkbavzzr.supabase.co';       // e.g. 'https://abcd1234.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_qRc5U079YTHeIEmd7ZbchQ_1QKpbki5';  // Supabase → Project Settings → API → anon public key
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
const SUPABASE_JS_SRI = 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o';  // pinned: a tampered CDN file will not run
const NET_STORE = G.netStorageKey;
const SNAP_EVERY = 3;    // host sends a snapshot every 3 ticks (20 per second)
const INTERP_TICKS = 6;  // guests draw ~100 ms behind the host to hide network jitter
const NET_PREDICT = !/[?&]nopredict\b/.test(location.search);  // guest draws their own player ahead of the snapshots (visual only)
const NET_LEAD_TICKS = 3;  // how far ahead of the newest snapshot we draw our own player (~50 ms)
const MAX_GUEST_LINES = 12;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOCAL_TEST = /[?&]nettest\b/.test(location.search);
const NET_STATES = ['COUNTDOWN', 'PLAYING', 'GOAL', 'GAMEOVER', ...(G.states || [])];
const NET_SETTING_KEYS = ['mode', 'target', 'time', 'field', 'teams', 'ball', 'arena'];
const FX_SOUNDS = ['kick', 'bounce', 'bump', 'jump', 'charged', 'beep', 'whistle', 'goal', 'fanfare', 'tone', 'noise', ...Object.keys(G.sounds || {})];
const onlineScreen = $('online-screen');
const seatActor = (s) => ({ 1: p1, 2: p2, 3: p3, 4: p4 })[s] || null;
const seatOf = (p) => p === p1 ? 1 : p === p2 ? 2 : p === p3 ? 3 : p === p4 ? 4 : 0;
const myActor = () => net.mySeat ? seatActor(net.mySeat) : null;
const isGuest = () => net.active && !net.isHost;
function r2(v) { return Math.round(v * 100) / 100; }

const netStore = (() => { try { return JSON.parse(localStorage.getItem(NET_STORE) || '{}') || {}; } catch (e) { return {}; } })();
function saveNetStore() { if (HubLink.params) return; try { localStorage.setItem(NET_STORE, JSON.stringify(netStore)); } catch (e) { /* ignore */ } }
const netUrl = () => SUPABASE_URL || netStore.url || '';
const netKey = () => SUPABASE_ANON_KEY || netStore.key || '';
const needsConfig = () => !LOCAL_TEST && !(SUPABASE_URL && SUPABASE_ANON_KEY);

// Record the host's sounds so guests hear the same match
for (const name of FX_SOUNDS) {
    const orig = Sound[name];
    Sound[name] = function (...a) {
        if (net.rec && !simulating && net.sndDepth === 0) net.fx.push(['s', name, a.map(v => typeof v === 'number' ? r2(v) : v)]);
        net.sndDepth++;
        try { return orig.apply(this, a); } finally { net.sndDepth--; }
    };
}
function netUpdateRec() { net.rec = net.active && net.isHost && net.inMatch; }

// ---------- Transport ----------
function loadSupabase() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = SUPABASE_JS;
        s.integrity = SUPABASE_JS_SRI;
        s.crossOrigin = 'anonymous';
        s.onload = res;
        s.onerror = () => rej(new Error('Could not load the Supabase library. Check your internet connection.'));
        document.head.appendChild(s);
    });
}

// Same-browser stand-in for a Supabase channel (used with ?nettest)
class LocalChannel {
    constructor(topic) {
        this.bc = new BroadcastChannel(topic);
        this.h = { broadcast: {}, presence: {} };
        this.state = {};
        this.me = null;
        this.bc.onmessage = (e) => this.recv(e.data);
    }
    on(type, filter, cb) { (this.h[type][filter.event] = this.h[type][filter.event] || []).push(cb); return this; }
    fire(type, ev, arg) { (this.h[type][ev] || []).forEach(f => f(arg)); }
    subscribe(cb) { setTimeout(() => cb('SUBSCRIBED'), 30); return this; }
    async track(meta) {
        this.me = meta; this.state[net.id] = [meta];
        this.bc.postMessage({ k: 'join', id: net.id, meta, hello: true });
        this.fire('presence', 'sync');
        return 'ok';
    }
    presenceState() { return this.state; }
    async send(m) { this.bc.postMessage({ k: 'b', event: m.event, payload: m.payload }); return 'ok'; }
    async unsubscribe() { try { this.bc.postMessage({ k: 'leave', id: net.id }); this.bc.close(); } catch (e) { /* closed */ } return 'ok'; }
    recv(d) {
        if (d.k === 'b') this.fire('broadcast', d.event, { event: d.event, payload: d.payload });
        else if (d.k === 'join') {
            const fresh = !this.state[d.id];
            this.state[d.id] = [d.meta];
            if (d.hello && this.me) this.bc.postMessage({ k: 'join', id: net.id, meta: this.me });
            if (fresh) this.fire('presence', 'join', { key: d.id, newPresences: [d.meta] });
            this.fire('presence', 'sync');
        } else if (d.k === 'leave') {
            const m = this.state[d.id];
            delete this.state[d.id];
            if (m) this.fire('presence', 'leave', { key: d.id, leftPresences: m });
            this.fire('presence', 'sync');
        }
    }
}

// Signs in (anonymously) so every message carries a verified user id, and creates the client.
// Needs supabase/migrations applied and Anonymous sign-ins switched on (see supabase/README.md).
async function netAuth() {
    if (LOCAL_TEST) return;
    await loadSupabase();
    const cfg = netUrl() + '|' + netKey();
    if (!net.client || net.clientCfg !== cfg) {
        net.client = window.supabase.createClient(netUrl(), netKey(), { realtime: { params: { eventsPerSecond: 60 } } });
        net.clientCfg = cfg;
    }
    let { data: { session } } = await net.client.auth.getSession();
    if (!session) {
        const r = await net.client.auth.signInAnonymously();
        if (r.error && (r.error.status === 429 || r.error.code === 'over_request_rate_limit')) throw new Error('Too many sign-in attempts right now. Wait a minute and try again.');
        if (r.error || !r.data || !r.data.session) throw new Error('Could not sign in. In Supabase, turn on Authentication → Sign In / Providers → Allow anonymous sign-ins.');
        session = r.data.session;
    }
    net.id = session.user.id;
    try { net.client.realtime.setAuth(session.access_token); } catch (e) { /* the client keeps the token fresh itself */ }
}
// ws:<CODE>:host = the room (only the host may broadcast), ws:<CODE>:g:<uid> = one guest's line to the host
function netChan(topic) {
    if (LOCAL_TEST) return new LocalChannel(topic);
    return net.client.channel(topic, { config: { private: true, broadcast: { self: false, ack: false }, presence: { key: net.id } } });
}
async function netRoomCreate(code) {
    if (LOCAL_TEST) return true;
    await net.client.from('rooms').delete().eq('host_id', net.id);   // one live room per player
    const { error } = await net.client.from('rooms').insert({ code });
    if (!error) return true;
    if (error.code === '23505') return false;                      // code taken: caller picks another
    throw new Error('Could not create the room. Has supabase/migrations been applied?');
}
async function netRoomHost(code) {
    const { data, error } = await net.client.from('rooms').select('host_id').eq('code', code).maybeSingle();
    if (error) throw new Error('Could not look up the room. Has supabase/migrations been applied?');
    return data ? data.host_id : '';
}
function netRoomClose() {
    if (LOCAL_TEST || !net.client || !net.isHost) return;
    try { net.client.from('rooms').delete().eq('host_id', net.id).then(() => {}, () => {}); } catch (e) { /* ignore */ }
}

function netSend(event, payload) {
    const ch = (event === 'in' || event === 'hello') ? net.gch : net.channel;   // guest -> host goes on the guest's own line
    if (!ch) return;
    try {
        const r = ch.send({ type: 'broadcast', event, payload });
        if (r && r.catch) r.catch(() => {});
    } catch (e) { /* dropped */ }
}

// ---------- Rooms ----------
function olStatus(msg, err) {
    const el = $('ol-status');
    el.textContent = msg || '';
    el.classList.toggle('err', !!err);
}
function setOlBusy(b) { $('ol-create').disabled = b; $('ol-join').disabled = b; }
function randomCode() {
    const r = new Uint32Array(4);
    try { crypto.getRandomValues(r); } catch (e) { for (let i = 0; i < 4; i++) r[i] = Math.random() * 4294967296; }
    let s = '';
    for (let i = 0; i < 4; i++) s += CODE_CHARS[r[i] % CODE_CHARS.length];
    return s;
}

function readOnlineForm() {
    if (needsConfig()) {
        netStore.url = $('ol-url').value.trim().replace(/\/+$/, '');
        netStore.key = $('ol-key').value.trim();
    }
    netStore.name = ($('ol-name').value.trim() || 'Player').slice(0, 12);
    saveNetStore();
    if (needsConfig() && (!/^https:\/\/\S+$/.test(netUrl()) || !netKey())) {
        olStatus('Add your Supabase project URL (https://…) and anon key first.', true);
        return false;
    }
    return true;
}

async function netOpen(code, asHost) {
    if (net.active || !readOnlineForm()) return;
    const name = netStore.name;
    olStatus(asHost ? 'Creating room…' : `Joining room ${code}…`);
    setOlBusy(true);
    let ch, hostId = '';
    try {
        await netAuth();
        if (asHost) {
            let ok = false;
            for (let i = 0; i < 5 && !ok; i++) { ok = await netRoomCreate(code); if (!ok) code = randomCode(); }
            if (!ok) throw new Error('Could not find a free room code. Try again.');
            hostId = net.id;
        } else if (!LOCAL_TEST) {
            hostId = await netRoomHost(code);
            if (!hostId) throw new Error(`No room found with code ${code}. Check the code and try again.`);
        } else hostId = '';
        ch = netChan(`ws:${code}:host`);
    } catch (err) { setOlBusy(false); olStatus(err.message || 'Could not connect.', true); return; }
    net.saved = { ...settings };
    Object.assign(net, {
        active: true, isHost: asHost, inMatch: false, code, channel: ch,
        hostId: asHost ? net.id : hostId, roster: {}, seats: asHost ? { 1: net.id } : {},
        inputs: {}, snaps: [], mySeat: asHost ? 1 : 0, fx: [], gch: null, gchs: {}, helloInfo: {}, pred: null
    });
    if (asHost) { settings.opponent = 'human'; settings.mates = 'human'; }
    netUpdateRec();
    showOlView();
    renderLobby();
    // The host channel only carries host broadcasts (RLS enforces it), so anything on it comes from the host
    ch.on('broadcast', { event: 'lobby' }, ({ payload }) => netOnLobby(payload))
      .on('broadcast', { event: 'start' }, ({ payload }) => netOnStart(payload))
      .on('broadcast', { event: 'snap' }, ({ payload }) => netOnSnap(payload))
      .on('broadcast', { event: 'tolobby' }, ({ payload }) => { if (!net.isHost && payload && payload.host === net.hostId) netBackToLobby(); })
      .on('presence', { event: 'sync' }, () => { if (net.isHost) netHostSync(); })
      .on('presence', { event: 'leave' }, ({ key }) => {
          if (!net.isHost && net.hostId && key === net.hostId) netLeave('The host left the room.', true);
      });
    let joined = false;
    ch.subscribe(async (status) => {
        if (ch !== net.channel) return;
        if (status === 'SUBSCRIBED' && !joined) {
            joined = true;
            setOlBusy(false);
            const t0 = Date.now();
            try { await ch.track({ host: asHost, t: t0 }); } catch (e) { /* retried by Supabase */ }
            if (asHost) {
                olStatus('Share the room code with your friends.'); netHostSync();
                // ?nettest has no rooms table, so detect a duplicate host from presence instead
                if (LOCAL_TEST) net.joinTimer = setTimeout(() => {
                    if (!net.active || !net.isHost || net.channel !== ch || net.inMatch) return;
                    const ps = ch.presenceState() || {};
                    for (const id in ps) if (id !== net.id && ps[id] && ps[id][0] && ps[id][0].host === true && (+ps[id][0].t || 0) <= (+t0 || 0)) {
                        netLeave('That room code is already in use. Try again.', true); return;
                    }
                }, 1200);
            } else {
                olStatus('Looking for the host…');
                netOpenGuestLine(code, name);
                net.joinTimer = setTimeout(() => {
                    if (net.active && !net.isHost) netLeave(`The host of room ${code} is not answering. Check the code and try again.`, true);
                }, 8000);
            }
        } else if (!joined && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
            netLeave('Could not connect to the room. Check the project URL and key, and that the database migrations are applied.', true);
        }
    });
}

// Guest: open our own line to the host and say hello until the host lists us in the lobby
function netOpenGuestLine(code, name) {
    const gch = netChan(`ws:${code}:g:${net.id}`);
    net.gch = gch;
    gch.subscribe((status) => {
        if (gch !== net.gch) return;
        if (status === 'SUBSCRIBED') {
            const hello = () => {
                if (!net.active || net.isHost || net.gch !== gch || net.roster[net.id]) { clearInterval(net.helloTimer); return; }
                netSend('hello', { game: G.id, name, skin: settings.p1Skin, hat: settings.p1Hat, boots: settings.p1Boots, acc: settings.p1Acc });
            };
            clearInterval(net.helloTimer);
            net.helloTimer = setInterval(hello, 1000);
            hello();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            netLeave('Could not open a line to the host. Check that the database migrations are applied.', true);
        }
    });
}

// Host: listen on one guest's line. The topic carries the guest's verified id, so payloads are never trusted for identity.
function netListenGuest(uid) {
    if (!net.isHost || net.gchs[uid] || uid === net.id || !/^[\w-]{6,40}$/.test(uid) || Object.keys(net.gchs).length >= MAX_GUEST_LINES) return;
    const ch = netChan(`ws:${net.code}:g:${uid}`);
    net.gchs[uid] = ch;
    ch.on('broadcast', { event: 'hello' }, ({ payload }) => netOnHello(uid, payload))
      .on('broadcast', { event: 'in' }, ({ payload }) => netOnInput(uid, payload));
    ch.subscribe(() => {});
}
function netDropGuest(uid) {
    const ch = net.gchs[uid];
    delete net.gchs[uid]; delete net.helloInfo[uid];
    if (ch) try { if (net.client && !LOCAL_TEST) net.client.removeChannel(ch); else ch.unsubscribe(); } catch (e) { /* ignore */ }
}
function netOnHello(uid, m) {
    if (!net.isHost || !m || typeof m !== 'object') return;
    if ((m.game || 'soccer') !== G.id) return;   // someone opened this code in a different Wobbly game
    const prev = net.helloInfo[uid];
    net.helloInfo[uid] = { name: String(m.name || 'Player').slice(0, 12), skin: Cosmetics.resolve('skin', m.skin), hat: Cosmetics.resolve('hat', m.hat), boots: Cosmetics.resolve('boots', m.boots), acc: Cosmetics.resolve('acc', m.acc), t: prev ? prev.t : Date.now() };
    netHostSync();
}

function netLeave(msg, err) {
    const ch = net.channel, gch = net.gch;
    netRoomClose();
    net.channel = null; net.gch = null;
    clearTimeout(net.joinTimer); clearInterval(net.helloTimer);
    for (const uid of Object.keys(net.gchs)) netDropGuest(uid);
    for (const c of [ch, gch]) {
        if (c) try { if (net.client && !LOCAL_TEST) net.client.removeChannel(c); else c.unsubscribe(); } catch (e) { /* ignore */ }
    }
    const wasPlaying = state !== 'MENU';
    Object.assign(net, { active: false, isHost: false, inMatch: false, code: '', hostId: '', roster: {}, seats: {}, inputs: {}, snaps: [], mySeat: 0, fx: [], gchs: {}, helloInfo: {}, pred: null });
    netUpdateRec();
    if (net.saved) { Object.assign(settings, net.saved); net.saved = null; }
    for (const p of [p1, p2, p3, p4]) p.cos = null;
    state = 'MENU';
    CONFIG.gravity = BASE_GRAVITY;
    CONFIG.fieldW = fieldDef().w;
    if (wasPlaying) buildBackground();
    clearAllInput();
    pauseScreen.classList.add('hidden');
    celebrationScreen.classList.add('hidden');
    $('touch-controls').classList.add('off');
    menuScreen.classList.add('hidden');
    onlineScreen.classList.remove('hidden');
    setOlBusy(false);
    showOlView();
    olStatus(msg || '', err);
    HubLink.left(msg);
}

function pickSettings() { const o = {}; for (const k of NET_SETTING_KEYS) o[k] = settings[k]; return o; }
function applyHostSettings(s) {
    if (!s || typeof s !== 'object') return;
    if (MODES[s.mode]) settings.mode = s.mode;
    if (TARGETS.includes(s.target)) settings.target = s.target;
    if (TIMES.includes(s.time)) settings.time = s.time;
    if (FIELDS.some(f => f.id === s.field)) settings.field = s.field;
    if (s.teams === 1 || s.teams === 2) settings.teams = s.teams;
    settings.ball = Cosmetics.resolve('ball', s.ball);
    settings.arena = Cosmetics.resolve('arena', s.arena);
    settings.opponent = 'human';
    settings.mates = 'human';
}
function netLobbyPayload() { return { game: G.id, host: net.id, seats: net.seats, roster: net.roster, inMatch: net.inMatch, s: pickSettings() }; }

// Host: rebuild the roster from presence and hand out seats.
// Seats 1 and 3 are Blue, 2 and 4 are Red. Extra people watch.
function netHostSync() {
    if (!net.isHost || !net.channel) return;
    const ps = net.channel.presenceState() || {};
    const roster = {};
    // Presence only says who is connected. A guest joins the roster once their own line has said hello.
    for (const id in ps) {
        if (id === net.id) continue;
        netListenGuest(id);
        const h = net.helloInfo[id];
        if (h) roster[id] = { ...h };
    }
    for (const id of Object.keys(net.gchs)) if (!ps[id]) netDropGuest(id);
    if (!roster[net.id]) roster[net.id] = { name: netStore.name || 'Player', skin: settings.p1Skin, hat: settings.p1Hat, boots: settings.p1Boots, acc: settings.p1Acc, t: 0 };
    net.roster = roster;
    const max = settings.teams === 2 ? 4 : 2;
    for (const s of [2, 3, 4]) {
        const id = net.seats[s];
        if (!id) continue;
        if (!roster[id] || (!net.inMatch && s > max)) {
            delete net.seats[s];
            if (net.inMatch) netSeatToBot(s);
        }
    }
    if (!net.inMatch) {
        const seated = new Set(Object.values(net.seats));
        const waiting = Object.keys(roster).filter(id => !seated.has(id)).sort((a, b) => roster[a].t - roster[b].t);
        for (let s = 2; s <= max && waiting.length; s++) if (!net.seats[s]) net.seats[s] = waiting.shift();
    }
    netSend('lobby', netLobbyPayload());
    if (net.inMatch) netSetTags(); else renderLobby();
}

function netSeatToBot(s) {
    const p = seatActor(s);
    delete net.inputs[s];
    if (!p || p.isBot || !players.includes(p)) return;
    p.input.left = p.input.right = false;
    p.isCharging = false; p.chargeAmount = 0; ACT.cancel?.(p);
    bots.push(new Bot(p, 'normal'));
    p.isBot = true;
    showBanner('PLAYER LEFT', 'A bot takes over', '#ffffff', 90, true);
}

function netHostStart(fromLobby) {
    if (!net.isHost) return;
    if (fromLobby && Object.keys(net.seats).length < 2) { olStatus('Waiting for at least one more player.', true); return; }
    settings.opponent = 'human'; settings.mates = 'human';
    net.inMatch = true; net.inputs = {}; net.fx = [];
    onlineScreen.classList.add('hidden');
    startMatch();
    netUpdateRec();
    netSend('start', netLobbyPayload());
}

function netEnterLobbyUI() {
    state = 'MENU';
    CONFIG.gravity = BASE_GRAVITY;
    clearAllInput();
    pauseScreen.classList.add('hidden');
    celebrationScreen.classList.add('hidden');
    $('touch-controls').classList.add('off');
    onlineScreen.classList.remove('hidden');
    showOlView();
    renderLobby();
}
function netHostToLobby() {
    net.inMatch = false; netUpdateRec();
    netSend('tolobby', { host: net.id });
    netEnterLobbyUI();
    olStatus('Back in the lobby. Kick off when everyone is ready.');
    netHostSync();
}
function netBackToLobby() {
    net.inMatch = false;
    netEnterLobbyUI();
    olStatus(net.mySeat ? 'Waiting for the host to kick off…' : 'You are watching this room.');
}

function netSeatName(s, fallback) {
    const id = net.seats[s];
    return (id && net.roster[id] && net.roster[id].name) || fallback;
}
function netSetTags() {
    const nm = (s) => {
        const id = net.seats[s];
        if (!id || !net.roster[id]) return 'BOT';
        return id === net.id ? 'YOU' : net.roster[id].name.toUpperCase();
    };
    $('p1-tag').textContent = settings.teams === 2 ? `${nm(1)} + ${nm(3)}` : nm(1);
    p2TagEl.textContent = settings.teams === 2 ? `${nm(2)} + ${nm(4)}` : nm(2);
}

// Guest: the host told us who is where
function netFromHost(m) {
    if (!m || typeof m !== 'object' || typeof m.host !== 'string') return false;
    if (net.hostId && m.host !== net.hostId) return false;
    const game = m.game || 'soccer';
    if (game !== G.id) {
        // Only trust this from the room's real host (known from the rooms table, or announced as host in presence)
        const pm = !net.hostId && net.channel && net.channel.presenceState ? (net.channel.presenceState() || {})[m.host] : null;
        if (net.hostId || (pm && pm[0] && pm[0].host === true)) netLeave(`Room ${net.code} is a Wobbly ${String(game)[0].toUpperCase() + String(game).slice(1)} room. Open that game to join it.`, true);
        return false;
    }
    if (!net.hostId) {
        // Only believe a host that is announced as one in presence, so a stray peer cannot claim the room first
        const pm = net.channel && net.channel.presenceState ? (net.channel.presenceState() || {})[m.host] : null;
        if (!pm || !pm[0] || pm[0].host !== true) return false;
    }
    net.hostId = m.host;
    clearTimeout(net.joinTimer);
    net.roster = (m.roster && typeof m.roster === 'object') ? m.roster : {};
    net.seats = (m.seats && typeof m.seats === 'object') ? m.seats : {};
    net.mySeat = 0;
    for (const s in net.seats) if (net.seats[s] === net.id) net.mySeat = +s;
    return true;
}
function netOnLobby(m) {
    if (net.isHost || !netFromHost(m)) return;
    if (net.inMatch) { netSetTags(); return; }
    applyHostSettings(m.s);
    if (m.inMatch) { netOnStart(m); return; }   // joined mid-match: watch it
    olStatus(net.mySeat ? 'Waiting for the host to kick off…' : 'The room is full, so you are watching.');
    renderLobby();
}
function netOnStart(m) {
    if (net.isHost || !netFromHost(m)) return;
    applyHostSettings(m.s);
    net.inMatch = true;
    net.snaps = []; net.renderT = -1; net.appliedT = -1; net.latestT = -1;
    onlineScreen.classList.add('hidden');
    startMatch();
}

// ---------- Inputs ----------
function netLocalChanged() {
    if (!isGuest()) return;
    const l = !!(keys.KeyA || keys.ArrowLeft || touchState[1].left);
    const r = !!(keys.KeyD || keys.ArrowRight || touchState[1].right);
    const j = !!(keys.KeyW || keys.ArrowUp || net.touch.j);
    const d = !!(keys.KeyS || keys.ArrowDown || net.touch.d);
    const L = net.local;
    if (L.l === l && L.r === r && L.j === j && L.d === d) return;
    net.local = { l, r, j, d };
    if (net.inMatch && net.mySeat) netSend('in', { s: net.mySeat, l, r, j, d });
}
function netOnInput(uid, m) {
    if (!net.isHost || !net.inMatch || !m) return;
    const s = m.s | 0;
    if (net.seats[s] !== uid) return;   // uid comes from the guest's own topic, so it cannot be forged in the payload
    const p = seatActor(s);
    if (!p || p.isBot || !players.includes(p)) return;
    const prev = net.inputs[s] || {};
    const cur = { l: !!m.l, r: !!m.r, j: !!m.j, d: !!m.d };
    net.inputs[s] = cur;
    p.input.left = cur.l; p.input.right = cur.r;
    if (cur.j && !prev.j) { if (!G.onJumpPress?.(p, false)) pressJump(p); }
    else if (!cur.j && prev.j) releaseFor(p);
    if (cur.d && !prev.d) ACT.down?.(p);
    else if (!cur.d && prev.d) ACT.up?.(p);
}
function netBlur() {
    for (const k in keys) keys[k] = false;
    for (const n of [1, 2]) { touchState[n].left = false; touchState[n].right = false; }
    net.touch.j = net.touch.d = false;
    document.querySelectorAll('.tc-btn.on').forEach(b => b.classList.remove('on'));
    if (isGuest()) { netLocalChanged(); return; }
    const me = myActor();
    if (me) { me.isCharging = false; me.chargeAmount = 0; ACT.cancel?.(me); }
}

// ---------- Snapshots ----------
function netSendSnap() {
    netSend('snap', {
        t: tickCount, st: state, sc: [scores[1], scores[2]],
        mf: matchFrames, ot: overtime ? 1 : 0, el: elapsed,
        sh: r2(shake), fl: r2(flash), ...G.snap?.(),
        a: players.map(p => [r2(p.x), r2(p.y), r2(p.angle), r2(p.vx), r2(p.vy), p.chargeAmount, p.isCharging ? 1 : 0, ...(ACT.snap?.(p) || [])]),
        b: balls.map(b => [r2(b.x), r2(b.y), r2(b.vx), r2(b.vy), r2(b.spin)]),
        fx: net.fx.splice(0)
    });
}
function netOnSnap(m) {
    if (!isGuest() || !net.inMatch || !m || typeof m.t !== 'number' || !Array.isArray(m.a) || !Array.isArray(m.b)) return;
    if (m.t <= net.latestT) return;
    net.snaps.push(m);
    if (net.snaps.length > 40) net.snaps.shift();
    net.latestT = m.t;
    net.latestAt = performance.now();
}
// Sound arguments come off the wire: keep them finite and quiet so a rogue peer cannot blast or crash audio
function netSafeSoundArgs(name, args) {
    if (!Array.isArray(args)) return [];
    const out = args.slice(0, 6).map(v => typeof v === 'number' && isFinite(v) ? Math.max(-5000, Math.min(5000, v)) : (['sine', 'square', 'triangle', 'sawtooth'].includes(v) ? v : 0));
    if (name === 'tone') { if (typeof out[1] === 'number') out[1] = Math.max(0, Math.min(2, out[1])); if (typeof out[3] === 'number') out[3] = Math.max(0, Math.min(0.4, out[3])); if (typeof out[5] === 'number') out[5] = Math.max(0, Math.min(2, out[5])); if (typeof out[2] === 'number') out[2] = 'sine'; }
    if (name === 'noise') { if (typeof out[0] === 'number') out[0] = Math.max(0, Math.min(2, out[0])); if (typeof out[1] === 'number') out[1] = Math.max(0, Math.min(0.4, out[1])); if (typeof out[4] === 'number') out[4] = Math.max(0, Math.min(2, out[4])); }
    return out;
}
function netPlayFx(f) {
    if (!Array.isArray(f)) return;
    try {
        if (f[0] === 'e') emit(+f[1] || 0, +f[2] || 0, Math.min(80, f[3] | 0), (f[4] && typeof f[4] === 'object') ? f[4] : {});
        else if (f[0] === 's' && FX_SOUNDS.includes(f[1])) Sound[f[1]](...netSafeSoundArgs(f[1], f[2]));
        else if (f[0] === 'b') showBanner(String(f[1]), String(f[2] || ''), String(f[3] || '#ffffff'), +f[4] || 60, !!f[5]);
    } catch (e) { /* bad effect from the wire */ }
}
function netApplyDiscrete(s) {
    if (Array.isArray(s.sc) && (s.sc[0] !== scores[1] || s.sc[1] !== scores[2])) {
        const pop = s.sc[0] > scores[1] ? 1 : s.sc[1] > scores[2] ? 2 : 0;
        scores = { 1: s.sc[0] | 0, 2: s.sc[1] | 0 };
        setScoreUI(pop);
    }
    matchFrames = s.mf | 0; overtime = !!s.ot; elapsed = s.el | 0;
    G.applySnap?.(s);
    if (s.sh > shake) shake = +s.sh;
    if (s.fl > flash) flash = +s.fl;
    if (NET_STATES.includes(s.st) && s.st !== state) {
        const was = state;
        state = s.st;
        if (state === 'GAMEOVER') showGameOver();
        else if (was === 'GAMEOVER') celebrationScreen.classList.add('hidden');
    }
    if (Array.isArray(s.fx)) for (const f of s.fx) netPlayFx(f);
}
function netInterpolate(T) {
    const S = net.snaps;
    if (!S.length) return;
    let a = S[0], b = S[0];
    for (let i = 0; i < S.length; i++) {
        if (S[i].t <= T) a = S[i];
        b = S[i];
        if (S[i].t >= T) break;
    }
    const k = b.t > a.t ? Math.max(0, Math.min(1, (T - a.t) / (b.t - a.t))) : 0;
    const L = (x, y) => x + (y - x) * k;
    players.forEach((p, i) => {
        const A = a.a[i], B = b.a[i] || A;
        if (!Array.isArray(A)) return;
        p.x = L(A[0], B[0]); p.y = L(A[1], B[1]); p.angle = L(A[2], B[2]);
        p.vx = A[3]; p.vy = A[4];
        const D = k < 0.5 ? A : B;
        p.chargeAmount = D[5] | 0; p.isCharging = !!D[6]; ACT.apply?.(p, D, 7);
    });
    balls.forEach((bl, i) => {
        const A = a.b[i], B = b.b[i] || A;
        if (!Array.isArray(A)) return;
        bl.x = L(A[0], B[0]); bl.y = L(A[1], B[1]);
        bl.vx = A[2]; bl.vy = A[3]; bl.spin = L(A[4], B[4]);
    });
}
// Visual-only prediction for the guest's own player. The host stays authoritative; we just stop
// drawing our player ~100 ms in the past: use the newest snapshot, extrapolate by its velocity, and lean right away.
function netPredictSelf() {
    const p = myActor(), S = net.snaps;
    if (!p || !S.length || state === 'MENU') return;
    const idx = players.indexOf(p), last = S[S.length - 1], A = last.a && last.a[idx];
    if (idx < 0 || !Array.isArray(A) || (G.states || []).includes(state)) { net.pred = null; return; }
    const lead = Math.min(6, (performance.now() - net.latestAt) / STEP + NET_LEAD_TICKS);
    const lean = (net.local.r ? 1 : 0) - (net.local.l ? 1 : 0);
    const grounded = A[1] + p.radius >= CONFIG.groundY - 2;
    let tx = A[0] + A[3] * lead + (grounded ? lean * CONFIG.walkAccel * lead * lead / 4 : 0);
    let ty = A[1] + A[4] * lead;
    if (ty + p.radius > CONFIG.groundY) ty = CONFIG.groundY - p.radius;
    const a = net.pred;
    if (!a || Math.abs(a.x - tx) > 120 || Math.abs(a.y - ty) > 120) net.pred = { x: tx, y: ty };   // teleport (goal reset, respawn)
    else { a.x += (tx - a.x) * 0.5; a.y += (ty - a.y) * 0.5; }
    p.x = net.pred.x; p.y = net.pred.y;
    p.vx = A[3]; p.vy = A[4];
    if (lean) p.angle += (lean * 0.6 - p.angle) * 0.3;
}
// Guest frame: no physics, just follow the host's snapshots
function guestTick() {
    tickCount++;
    if (state === 'MENU') return;
    if (net.latestT >= 0) {
        const target = net.latestT + (performance.now() - net.latestAt) / STEP - INTERP_TICKS;
        if (net.renderT < 0 || Math.abs(target - net.renderT) > 30) net.renderT = target;
        else net.renderT += 1 + (target - net.renderT) * 0.05;
        for (const s of net.snaps) {
            if (s.t > net.appliedT && s.t <= net.renderT) { netApplyDiscrete(s); net.appliedT = s.t; }
        }
        netInterpolate(net.renderT);
        if (NET_PREDICT) netPredictSelf();
    }
    updateParticles();
    updateCamera(false);
    if (shake > 0) { shake *= 0.88; if (shake < 0.3) shake = 0; }
    if (flash > 0) { flash -= 0.03; if (flash < 0) flash = 0; }
    if (banner && ++banner.t >= banner.dur) banner = null;
    if (state === 'PLAYING' || state === 'GOAL') {
        for (const b of balls) { b.trail.push({ x: b.x, y: b.y }); if (b.trail.length > 9) b.trail.shift(); }
    }
    updateInfo();
}

// ---------- Online screen ----------
function showOlView() {
    $('ol-setup').classList.toggle('hide', net.active || !needsConfig());
    $('ol-home').classList.toggle('hide', net.active);
    $('ol-lobby').classList.toggle('hide', !net.active);
    $('ol-start').classList.toggle('hide', !(net.active && net.isHost));
    $('ol-back').textContent = net.active ? 'Leave' : 'Back';
}
function renderLobby() {
    if (!net.active) return;
    $('ol-room-code').textContent = net.code;
    const two = settings.teams === 2, max = two ? 4 : 2;
    const box = $('ol-players');
    box.innerHTML = '';
    for (let s = 1; s <= max; s++) {
        const id = net.seats[s], who = id && net.roster[id];
        const d = document.createElement('div');
        d.className = `ol-seat t${s % 2 ? 1 : 2}` + (who ? '' : ' empty');
        d.textContent = who
            ? who.name + (id === net.id ? ' (you)' : '') + (id === net.hostId ? ' ★' : '')
            : (two ? 'Open · a bot plays here' : 'Waiting for a player…');
        box.appendChild(d);
    }
    const host = net.isHost;
    $('ol-host-settings').classList.toggle('hide', !host);
    if (host) {
        const m = mode();
        const resync = () => netHostSync();
        buildChips($('ol-mode-chips'), MODE_ORDER.map(id => ({ id, name: MODES[id].name })), it => it.id === settings.mode, it => { settings.mode = it.id; resync(); });
        const lengthless = m.kind === 'none' || m.kind === 'endless';
        $('ol-length-setting').style.visibility = lengthless ? 'hidden' : 'visible';
        if (m.kind === 'time') {
            $('ol-length-label').textContent = 'Match time';
            buildChips($('ol-length-chips'), TIMES.map(s => ({ id: s, name: fmtClock(s) })), it => it.id === settings.time, it => { settings.time = it.id; resync(); });
        } else {
            $('ol-length-label').textContent = 'First to';
            buildChips($('ol-length-chips'), TARGETS.map(n => ({ id: n, name: `${n} ${G.point}s` })), it => it.id === settings.target, it => { settings.target = it.id; resync(); });
        }
        if (FIELDS.length > 1) buildChips($('ol-field-chips'), FIELDS, it => it.id === settings.field, it => { settings.field = it.id; resync(); });
        buildChips($('ol-teams-chips'), [{ id: 1, name: '1v1' }, { id: 2, name: '2v2' }], it => it.id === settings.teams, it => { settings.teams = it.id; resync(); });
    }
    const m = mode();
    const len = m.kind === 'time' ? fmtClock(settings.time) : (m.kind === 'goals' ? `first to ${settings.target}` : '');
    const seated = new Set(Object.values(net.seats));
    const watchers = Object.keys(net.roster).filter(id => !seated.has(id)).length;
    $('ol-summary').textContent = [m.name + (len ? ` · ${len}` : ''), FIELDS.length > 1 && `${fieldDef().name} field`, two ? '2v2' : '1v1',
        watchers ? `${watchers} watching` : ''].filter(Boolean).join(' · ');
    $('ol-start').disabled = Object.keys(net.seats).length < 2;
}

function openOnline() {
    menuScreen.classList.add('hidden');
    onlineScreen.classList.remove('hidden');
    $('ol-name').value = netStore.name || '';
    $('ol-url').value = netStore.url || '';
    $('ol-key').value = netStore.key || '';
    olStatus(LOCAL_TEST ? 'Test mode: rooms only connect tabs in this browser.' : '');
    showOlView();
}
$('online-btn').addEventListener('click', () => { Sound.init(); Sound.click(); openOnline(); });
$('ol-back').addEventListener('click', () => {
    Sound.click();
    if (net.active) { netLeave(net.isHost ? 'Room closed.' : 'You left the room.'); return; }
    onlineScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    refreshMenu();
});
$('ol-create').addEventListener('click', () => { Sound.init(); Sound.click(); netOpen(randomCode(), true); });
const joinFromForm = () => {
    Sound.init(); Sound.click();
    const code = $('ol-code').value.toUpperCase().replace(/[^A-Z]/g, '');
    if (code.length !== 4) { olStatus('Room codes are 4 letters.', true); return; }
    netOpen(code, false);
};
$('ol-join').addEventListener('click', joinFromForm);
$('ol-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') joinFromForm(); });
$('ol-start').addEventListener('click', (e) => { Sound.init(); netHostStart(true); e.currentTarget.blur(); });
window.addEventListener('pagehide', () => { if (net.channel) try { net.channel.unsubscribe(); } catch (e) { /* ignore */ } });

