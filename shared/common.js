// Code the hub (index.html) and the game page (play.html) both use. Classic script: defines TEAM, Sound, mulberry32, drawBlob, LocalChannel.
// Load it after shared/cosmetics/load.js. Each page adds its own sounds with Object.assign(Sound, {...}) and sets Sound.isMuted.
'use strict';

const TEAM = { 1: '#00d2ff', 2: '#ff3838' };   // Blue, Red

// =====================================================================
//  SOUND (WebAudio synth, no assets)
// =====================================================================
const Sound = {
    ac: null, master: null, nbuf: null,
    isMuted: () => false,
    init() {
        try {
            if (!this.ac) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                this.ac = new AC();
                this.master = this.ac.createGain();
                this.master.gain.value = 0.6;
                this.master.connect(this.ac.destination);
            }
            if (this.ac.state === 'suspended') this.ac.resume();
        } catch (e) { this.ac = null; }
    },
    ok() { return this.ac && !this.isMuted(); },
    tone(f, dur, type = 'sine', vol = 0.15, f2 = null, delay = 0) {
        if (!this.ok()) return;
        const t = this.ac.currentTime + delay;
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f, t);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.master);
        o.start(t); o.stop(t + dur + 0.03);
    },
    noise(dur, vol = 0.2, freq = 1000, q = 1, delay = 0) {
        if (!this.ok()) return;
        if (!this.nbuf) {
            const len = this.ac.sampleRate * 2;
            this.nbuf = this.ac.createBuffer(1, len, this.ac.sampleRate);
            const d = this.nbuf.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        }
        const t = this.ac.currentTime + delay;
        const s = this.ac.createBufferSource();
        s.buffer = this.nbuf;
        const fl = this.ac.createBiquadFilter();
        fl.type = 'bandpass'; fl.frequency.value = freq; fl.Q.value = q;
        const g = this.ac.createGain();
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(fl); fl.connect(g); g.connect(this.master);
        s.start(t); s.stop(t + dur + 0.03);
    },
    jump(c)   { this.tone(200 + c * 120, 0.2 + c * 0.15, 'triangle', 0.08 + c * 0.06, 500 + c * 700); if (c > 0.95) this.noise(0.3, 0.12, 700, 0.7); },
    charged() { this.tone(1320, 0.12, 'sine', 0.07); this.tone(1760, 0.16, 'sine', 0.06, null, 0.06); },
    click()   { this.tone(660, 0.05, 'square', 0.035); }
};

function mulberry32(a) {
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// =====================================================================
//  PLAYER DRAWING (every cosmetic layer comes from the registry, shared/cosmetics/registry.js, which caches static items as sprites)
//  o: { x, y, r, angle, charge (0..1 of a full charge), sx, sy (extra squash, e.g. the game's action), face (1 right, -1 left),
//       team (1 or 2), cos: [skin, hat, boots, acc], lookAt ({x, y} the pupils follow, or null), t, ring (0..1 white ring when not charging) }
//  Returns the hat's lift, for name tags.
// =====================================================================
const blobCtx = { r: 32, t: 0, look: 1, team: '', teamNum: 1, hat: null, zoom: 1 };
function drawBlob(g, o) {
    const r = o.r, k = o.charge, face = o.face;
    const skin = Cosmetics.get('skin', o.cos[0]);
    const hat = Cosmetics.get('hat', o.cos[1]);
    const c = blobCtx;
    g.save();
    g.translate(o.x, o.y);
    c.r = r; c.t = o.t; c.look = face; c.team = TEAM[o.team]; c.teamNum = o.team; c.hat = hat;
    c.zoom = Cosmetics.zoomOf(g);
    g.rotate(o.angle);
    g.scale(1 + k * 0.15 + (o.sx || 0), 1 - k * 0.35 - (o.sy || 0));   // squash & stretch with charge
    if (k >= 1 && Math.floor(Date.now() / 50) % 2 === 0) { g.shadowBlur = 20; g.shadowColor = '#f1c40f'; }
    Cosmetics.draw('skin', 'body', g, skin, c);
    g.shadowBlur = 0;
    Cosmetics.draw('skin', 'extras', g, skin, c);
    Cosmetics.draw('boots', 'main', g, Cosmetics.get('boots', o.cos[2]), c);
    Cosmetics.draw('hat', 'main', g, hat, c);
    // Eyes (pupils follow lookAt)
    const ex = r * 0.4 * face, ey = -r * 0.4;
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(ex, ey, 8, 0, Math.PI * 2); g.fill();
    let px = r * 0.45 * face, py = ey;
    if (o.lookAt) {
        const a = Math.atan2(o.lookAt.y - o.y, o.lookAt.x - o.x) - o.angle;
        px = ex + Math.cos(a) * 3.5; py = ey + Math.sin(a) * 3.5;
    }
    g.fillStyle = '#000000';
    g.beginPath(); g.arc(px, py, 4, 0, Math.PI * 2); g.fill();
    Cosmetics.draw('acc', 'main', g, Cosmetics.get('acc', o.cos[3]), c);
    // Charge meter (gold) or the hub's hold-to-join ring (white) above the head, lifted above hats
    const lift = Cosmetics.hatLift(hat, r);
    const ring = (frac, col) => {
        g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 6;
        g.beginPath(); g.arc(0, -r * 1.5 - lift, 15, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = col; g.lineWidth = 4;
        g.beginPath(); g.arc(0, -r * 1.5 - lift, 15, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); g.stroke();
    };
    if (k > 5 / 60) ring(k, '#f1c40f');
    else if (o.ring > 0) ring(o.ring, '#ffffff');
    g.restore();
    return lift;
}

// =====================================================================
//  ?nettest stand-in for a Supabase Realtime channel: one BroadcastChannel per topic, between tabs of one browser.
//  getId: this tab's presence key. prefix keeps the hub's topics apart from the game's.
// =====================================================================
class LocalChannel {
    constructor(topic, getId, prefix = '') {
        this.bc = new BroadcastChannel(prefix + topic);
        this.getId = getId;
        this.h = { broadcast: {}, presence: {} };
        this.state = {};
        this.me = null;
        this.bc.onmessage = (e) => this.recv(e.data);
    }
    on(type, filter, cb) { (this.h[type][filter.event] = this.h[type][filter.event] || []).push(cb); return this; }
    fire(type, ev, arg) { (this.h[type][ev] || []).forEach(f => f(arg)); }
    subscribe(cb) { setTimeout(() => cb && cb('SUBSCRIBED'), 30); return this; }
    async track(meta) {
        this.me = meta; this.state[this.getId()] = [meta];
        this.bc.postMessage({ k: 'join', id: this.getId(), meta, hello: true });
        this.fire('presence', 'sync');
        return 'ok';
    }
    presenceState() { return this.state; }
    async send(m) { this.bc.postMessage({ k: 'b', event: m.event, payload: m.payload }); return 'ok'; }
    async unsubscribe() { try { if (this.me) this.bc.postMessage({ k: 'leave', id: this.getId() }); this.bc.close(); } catch (e) { /* closed */ } return 'ok'; }
    recv(d) {
        if (d.k === 'b') this.fire('broadcast', d.event, { event: d.event, payload: d.payload });
        else if (d.k === 'join') {
            const fresh = !this.state[d.id];
            this.state[d.id] = [d.meta];
            if (d.hello && this.me) this.bc.postMessage({ k: 'join', id: this.getId(), meta: this.me });
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
