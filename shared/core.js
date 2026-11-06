// Shared engine, part 1: state, settings, sound, physics, input, bots, effects, match flow and the fixed step.
// Everything a game definition (games/<id>.js, see docs/GAMES.md) plugs into is reached through G.
'use strict';

const G = Games.current;   // the game's definition (games/<id>.js)
const ACT = G.action || {};   // the game's second button (hooks down, up, ...)
const ACTION = (ACT.name || '').toUpperCase();   // its label

// =====================================================================
//  DOM
// =====================================================================
const $ = (id) => document.getElementById(id);
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
const container = $('game-container');

const menuScreen = $('menu-screen');
const pauseScreen = $('pause-screen');
const celebrationScreen = $('celebration-screen');
const winnerText = $('winner-text');
const finalScoreEl = $('final-score');
const matchSummaryEl = $('match-summary');
const p1ScoreEl = $('p1-score');
const p2ScoreEl = $('p2-score');
const p2TagEl = $('p2-tag');
const matchInfoEl = $('match-info');
const muteBtn = $('mute-btn');

const W = 1024, H = 576;

// =====================================================================
//  CORE CONFIG (unchanged physics values); a game overrides or adds fields with Games.define({ config })
// =====================================================================
const BASE_GRAVITY = 0.45;
const CONFIG = {
    gravity: BASE_GRAVITY,
    airResistance: 0.99,
    groundY: 480,
    p1SpawnX: 250,
    p2SpawnX: 774,
    fieldW: 1024,            // world width, set from the chosen field
    ballR: 18,
    ballGravity: 1,          // the ball falls at this share of gravity
    ballMaxSpeed: Infinity,  // px per frame
    walkAccel: 0.15,         // x the lean (0.6) per frame on the ground
    walkMax: Infinity,       // top walking speed
    airAccel: 0,             // x the lean per frame while airborne
    airMax: 0,               // top steering speed in the air
    airGravity: 1,           // players fall at this share of gravity while airborne...
    apexBand: 0,             // ...and hang near the top of the jump (|vy| below this)...
    apexHang: 1,             // ...at this share of that
    jumpScale: 1,            // x the jump force
    ...G.config
};
const TEAM = { 1: '#00d2ff', 2: '#ff3838' };

const OPPONENTS = [
    { id: 'human',  name: '2 Players' },
    { id: 'easy',   name: 'CPU Easy' },
    { id: 'normal', name: 'CPU Normal' },
    { id: 'hard',   name: 'CPU Hard' }
];
const TARGETS = G.targets;
const TIMES = [60, 90, 120];

// Cosmetics (skins, hats, boots, accessories, balls, arenas) live in shared/cosmetics/:
// registry.js plus one file per pack under shared/cosmetics/packs/ (listed in load.js). They are keyed by
// stable string ids. Old saves and old clients referred to them by list
// position, so these tables freeze that original order for migration.
// See docs/COSMETICS.md before adding items.
if (typeof Cosmetics === 'undefined') throw new Error('cosmetics did not load (run `node tools/cosmetics.js sync` to inline them)');
const COS_LEGACY = {
    skin: ['classic', 'gold', 'galaxy', 'tiger', 'ninja', 'robot', 'slime', 'magma', 'jersey_hoops', 'jersey_brazil', 'jersey_pinstripe', 'jersey_sash', 'jersey_checker', 'jersey_retro', 'jersey_tuxedo', 'jersey_hawaiian', 'jersey_rainbow', 'jersey_camo'],
    hat: ['none', 'crown', 'cap', 'party', 'viking', 'tophat', 'halo', 'hat_beanie', 'hat_fedora', 'hat_bunny', 'hat_headband', 'hat_wizard', 'hat_pirate', 'hat_propeller', 'hat_flower', 'hat_santa', 'hat_horns'],
    boots: ['none', 'cleats', 'sneaks', 'rain', 'rocket', 'gold'],
    acc: ['none', 'shades', 'mustache', 'bowtie', 'scarf', 'medal'],
    ball: ['classic', 'beach', 'fire', 'neon', 'eight', 'ball_ice', 'ball_galaxy', 'ball_candy', 'ball_melon', 'ball_retro', 'ball_disco', 'ball_bubble', 'ball_gold', 'ball_rainbow', 'ball_pixel'],
    arena: ['night', 'sunset', 'neon', 'beach']
};
for (const cat in COS_LEGACY) Cosmetics.legacy(cat, COS_LEGACY[cat]);
// settings key -> cosmetic category
const COS_KEYS = { p1Skin: 'skin', p2Skin: 'skin', p1Hat: 'hat', p2Hat: 'hat', p1Boots: 'boots', p2Boots: 'boots', p1Acc: 'acc', p2Acc: 'acc', ball: 'ball', arena: 'arena' };
const cosDef = (cat) => Cosmetics.resolve(cat, undefined);
const curBall = () => Cosmetics.get('ball', settings.ball);
const curArena = () => Cosmetics.get('arena', settings.arena);
// Ball trail particles: a preset name or an emitter object from the ball's definition, resolved once per ball.
const BALL_FX = {
    fire:    { color: ['#ffb703', '#fb5607', '#ffd166'], speed: 0.8, life: 20, size: 5, gravity: -0.05, every: 1, minSpeed: 3 },
    sparkle: { color: null, speed: 0.6, life: 18, size: 2.5, gravity: 0, drag: 0.9, every: 3, minSpeed: 4 },
    smoke:   { color: ['rgba(200,200,200,0.6)', 'rgba(120,120,120,0.5)'], speed: 0.4, life: 26, size: 4, gravity: -0.03, drag: 0.95, every: 3, minSpeed: 4 }
};
const ballFxCache = new WeakMap();
function ballFx(def) {
    if (!def || !def.fx) return null;
    let fx = ballFxCache.get(def);
    if (!fx) {
        const { every = 3, minSpeed = 4, ...opts } = typeof def.fx === 'string' ? BALL_FX[def.fx] : def.fx;
        if (!opts.color) opts.color = ['#ffffff', `rgb(${def.trail || '255,255,255'})`];
        fx = { every: Math.max(1, Math.round(every)), minSpeed, opts };
        ballFxCache.set(def, fx);
    }
    return fx;
}

// =====================================================================
//  SETTINGS (persisted)
// =====================================================================
const STORAGE_KEY = G.storageKey;
const DEFAULTS = { mode: 'classic', time: 90, opponent: 'human', field: 'standard', teams: 1, p1Skin: 'classic', p1Hat: 'none', p2Skin: 'classic', p2Hat: 'none', p1Boots: 'none', p2Boots: 'none', p1Acc: 'none', p2Acc: 'none', muted: false, ...G.defaults };
const FIELDS = G.fields || [{ id: 'standard', name: 'Standard', w: 1024, spawn: 262 }];   // w: world width, spawn: how far 1v1 players start from the middle
const fieldDef = () => FIELDS.find(f => f.id === settings.field);
const settings = { ...DEFAULTS };
try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved && typeof saved === 'object') Object.assign(settings, saved);
} catch (e) { /* storage unavailable */ }
// validate
if (!MODES[settings.mode]) settings.mode = DEFAULTS.mode;
if (!TARGETS.includes(settings.target)) settings.target = DEFAULTS.target;
if (!TIMES.includes(settings.time)) settings.time = DEFAULTS.time;
if (!OPPONENTS.some(o => o.id === settings.opponent)) settings.opponent = DEFAULTS.opponent;
// Ids pass through; numbers from saves made before the registry map through COS_LEGACY; anything else falls back to the default.
for (const k in COS_KEYS) settings[k] = Cosmetics.resolve(COS_KEYS[k], settings[k]);
settings.muted = !!settings.muted;
if (!fieldDef()) settings.field = FIELDS[0].id;
if (settings.teams !== 1 && settings.teams !== 2) settings.teams = 1;
if (settings.mates !== 'bot' && settings.mates !== 'human') settings.mates = 'bot';
const TEAM_SIZES = [
    { id: '1', name: '1v1', teams: 1, mates: 'bot' },
    { id: '2b', name: '2v2 Bots', teams: 2, mates: 'bot' },
    { id: '2h', name: '2v2 Humans', teams: 2, mates: 'human' }
];
const teamSizeId = () => settings.teams === 1 ? '1' : (settings.mates === 'human' ? '2h' : '2b');
// 2v2 with human teammates: P3 joins Blue; P4 joins Red when there's no CPU
const humanMates = () => settings.teams === 2 && settings.mates === 'human';
const p3Human = () => humanMates();
const p4Human = () => humanMates() && !isCPU();
function saveSettings() {
    if (net.active || HubLink.params) return; // the host's room settings are temporary
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ }
}
const isCPU = () => settings.opponent !== 'human';
// Online room state (see ONLINE MULTIPLAYER below)
const net = {
    active: false, isHost: false, inMatch: false, rec: false,
    id: (() => { try { const a = new Uint32Array(3); crypto.getRandomValues(a); return Array.from(a, v => v.toString(36)).join('').slice(0, 14); } catch (e) { return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8); } })(), code: '', hostId: '',
    client: null, clientCfg: '', channel: null, joinTimer: 0, gch: null, gchs: {}, helloInfo: {}, helloTimer: 0, pred: null,
    roster: {}, seats: {}, mySeat: 0, saved: null,
    inputs: {}, local: { l: false, r: false, j: false, d: false }, touch: { j: false, d: false },
    snaps: [], renderT: -1, appliedT: -1, latestT: -1, latestAt: 0,
    fx: [], sndDepth: 0
};

// =====================================================================
//  SOUND (WebAudio synth, no assets)
// =====================================================================
const Sound = {
    ac: null, master: null, nbuf: null,
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
    ok() { return this.ac && !settings.muted; },
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
    kick(v)   { const p = Math.min(1, v / 12); this.tone(160, 0.12, 'sine', 0.15 + p * 0.35, 45); this.noise(0.05, 0.08 + p * 0.2, 2500, 0.8); },
    bounce(v) { const p = Math.min(1, v / 12); this.tone(110, 0.09, 'sine', 0.04 + p * 0.18, 55); },
    bump()    { this.tone(85, 0.12, 'sine', 0.18, 40); },
    jump(c)   { this.tone(200 + c * 120, 0.2 + c * 0.15, 'triangle', 0.08 + c * 0.06, 500 + c * 700); if (c > 0.95) this.noise(0.3, 0.12, 700, 0.7); },
    charged() { this.tone(1320, 0.12, 'sine', 0.07); this.tone(1760, 0.16, 'sine', 0.06, null, 0.06); },
    beep(hi)  { this.tone(hi ? 1046 : 523, 0.14, 'square', 0.05); },
    whistle() { this.tone(2350, 0.14, 'sine', 0.12); this.tone(2350, 0.4, 'sine', 0.12, 2200, 0.17); },
    click()   { this.tone(660, 0.05, 'square', 0.035); },
    goal()    { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.25, 'square', 0.06, null, i * 0.09)); this.noise(1.6, 0.22, 1200, 0.5, 0.05); },
    fanfare() { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => this.tone(f, 0.32, 'triangle', 0.12, null, i * 0.13)); this.noise(2.2, 0.18, 1000, 0.5); }
};
Object.assign(Sound, G.sounds);   // the game's own sounds

// =====================================================================
//  ACTOR — core physics preserved exactly from the original
// =====================================================================
class Actor {
    constructor(x, y, radius, color, isPlayer, playerNum = 1) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.color = color;
        this.isPlayer = isPlayer;
        this.playerNum = playerNum;

        this.mass = isPlayer ? 10 : 2;
        this.restitution = isPlayer ? 0.2 : 0.75;

        this.angle = 0;
        this.angularVelocity = 0;
        this.targetAngle = 0;

        // Charge parameters
        this.chargeAmount = 0;
        this.maxCharge = 60; // 60 frames (1 second)
        this.isCharging = false;

        // Input source (keyboard, touch or CPU) — replaces direct key lookups
        this.input = { left: false, right: false };

        // Visual-only state
        this.spin = 0;
        this.trail = [];
        this.wasFull = false;
        this.lastKickSound = 0;
        this.gScale = 1;        // gravity multiplier
        this.isBot = false;
        ACT.reset?.(this);
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.angularVelocity = 0;
        this.targetAngle = 0;
        this.chargeAmount = 0;
        this.isCharging = false;
        this.spin = 0;
        this.trail.length = 0;
        this.wasFull = false;
        ACT.reset?.(this);
    }

    update() {
        if (!this.isPlayer) {
            const sp = Math.hypot(this.vx, this.vy);
            if (sp > CONFIG.ballMaxSpeed) { this.vx *= CONFIG.ballMaxSpeed / sp; this.vy *= CONFIG.ballMaxSpeed / sp; }
        }
        let gs = this.gScale;
        if (this.isPlayer && this.y + this.radius < CONFIG.groundY - 2) {
            gs = CONFIG.airGravity * (Math.abs(this.vy) < CONFIG.apexBand ? CONFIG.apexHang : 1);
        }
        this.vy += CONFIG.gravity * gs;
        this.vx *= CONFIG.airResistance;
        this.vy *= CONFIG.airResistance;

        this.x += this.vx;
        this.y += this.vy;

        const onGround = (this.y + this.radius >= CONFIG.groundY - 2);
        this.handleCollisions();

        if (this.isPlayer) {
            if (this.isCharging && onGround) {
                if (this.chargeAmount < this.maxCharge) {
                    this.chargeAmount++;
                }
            } else {
                this.chargeAmount = 0;
            }

            let controlLean = 0;
            if (this.input.left) controlLean -= 0.6;
            if (this.input.right) controlLean += 0.6;

            if (controlLean !== 0) {
                this.targetAngle = controlLean;
                const dir = Math.sign(controlLean);
                if (onGround && !this.isCharging) { if (this.vx * dir < CONFIG.walkMax) this.vx += controlLean * CONFIG.walkAccel; }
                else if (!onGround && this.vx * dir < CONFIG.airMax) this.vx += controlLean * CONFIG.airAccel;
            } else {
                if (!onGround) {
                    this.targetAngle = this.vx * 0.05;
                } else {
                    this.targetAngle = Math.sin(Date.now() * 0.007) * 0.08;
                }
            }

            let angleDiff = this.targetAngle - this.angle;
            this.angularVelocity += angleDiff * 0.12;
            this.angularVelocity *= 0.82;
            this.angle += this.angularVelocity;
        }
    }

    handleCollisions() {
        if (this.y + this.radius > CONFIG.groundY) {
            const impact = this.vy;
            this.y = CONFIG.groundY - this.radius;
            this.vy = -this.vy * this.restitution;
            if (Math.abs(this.vy) < 0.2) this.vy = 0;
            this.vx *= 0.85;
            onGroundImpact(this, impact);
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = -this.vx * this.restitution;
        } else if (this.x + this.radius > CONFIG.fieldW) {
            this.x = CONFIG.fieldW - this.radius;
            this.vx = -this.vx * this.restitution;
        }
    }

    releaseJump() {
        const onGround = (this.y + this.radius >= CONFIG.groundY - 5);
        if (onGround && this.isCharging) {
            let chargeRatio = this.chargeAmount / this.maxCharge;
            let jumpForce = (8.5 + (chargeRatio * 9.5)) * CONFIG.jumpScale;

            this.vy = -jumpForce;

            let horizontalLaunchDir = Math.sin(this.angle);
            this.vx += horizontalLaunchDir * (4.0 + chargeRatio * 6.0);

            this.vx += (this.playerNum === 1) ? 1.5 : -1.5;

            this.angularVelocity += (this.playerNum === 1) ? (0.2 + chargeRatio * 0.5) : -(0.2 + chargeRatio * 0.5);
        }
        this.isCharging = false;
        this.chargeAmount = 0;
    }
}

const p1 = new Actor(CONFIG.p1SpawnX, CONFIG.groundY - 40, 32, TEAM[1], true, 1);
const p2 = new Actor(CONFIG.p2SpawnX, CONFIG.groundY - 40, 32, TEAM[2], true, 2);
// 2v2 teammates (bots). playerNum is the team: 1 = blue/left, 2 = red/right.
const p3 = new Actor(0, CONFIG.groundY - 40, 32, TEAM[1], true, 1);
const p4 = new Actor(0, CONFIG.groundY - 40, 32, TEAM[2], true, 2);
let players = [p1, p2];
let balls = [];

function buildBalls(n) {
    balls = G.ballSpots(n).map(([x, y]) => {
        const b = new Actor(x, y, CONFIG.ballR, '#ffffff', false);
        b.gScale = CONFIG.ballGravity;
        return b;
    });
}
buildBalls(1);

function applyFieldSetting() {
    const fw = fieldDef().w;
    if (fw !== CONFIG.fieldW) { CONFIG.fieldW = fw; buildBackground(); }
}

function layoutTeams() {
    const FW = CONFIG.fieldW, c = FW / 2;
    const off = fieldDef().spawn;
    const two = settings.teams === 2;
    const place = (p, x) => { p.startX = x; p.startY = CONFIG.groundY - 40; };
    if (two) {
        place(p1, c - off * 0.6); place(p3, c - off * 1.35);
        place(p2, c + off * 0.6); place(p4, c + off * 1.35);
        players = [p1, p2, p3, p4];
    } else {
        place(p1, c - off); place(p2, c + off);
        players = [p1, p2];
    }
    for (const p of players) p.isBot = false;
    bots = [];
    if (net.active) {
        // Online: every seat without a connected player gets a bot
        for (const p of players) {
            const id = net.seats[seatOf(p)], who = id && net.roster[id];
            p.cos = who ? [Cosmetics.resolve('skin', who.skin), Cosmetics.resolve('hat', who.hat), Cosmetics.resolve('boots', who.boots), Cosmetics.resolve('acc', who.acc)] : [cosDef('skin'), cosDef('hat'), cosDef('boots'), cosDef('acc')];
            if (!who) bots.push(new Bot(p, 'normal'));
        }
        for (const b of bots) b.p.isBot = true;
        return;
    }
    for (const p of [p1, p2, p3, p4]) p.cos = null;
    if (isCPU()) bots.push(new Bot(p2, settings.opponent));
    if (two) {
        if (!p3Human()) bots.push(new Bot(p3, 'normal'));
        if (!p4Human()) bots.push(new Bot(p4, isCPU() ? settings.opponent : 'normal'));
    }
    for (const b of bots) b.p.isBot = true;
}

// Unchanged collision math; now returns the impact speed for effects.
function resolveCollision(c1, c2) {
    let dx = c2.x - c1.x;
    let dy = c2.y - c1.y;
    let distance = Math.hypot(dx, dy);
    let minDistance = c1.radius + c2.radius;

    if (distance < minDistance && distance > 0) {
        let overlap = minDistance - distance;
        let nx = dx / distance;
        let ny = dy / distance;

        let totalMass = c1.mass + c2.mass;
        c1.x -= nx * overlap * (c2.mass / totalMass);
        c1.y -= ny * overlap * (c2.mass / totalMass);
        c2.x += nx * overlap * (c1.mass / totalMass);
        c2.y += ny * overlap * (c1.mass / totalMass);

        let kx = c1.vx - c2.vx;
        let ky = c1.vy - c2.vy;
        let vn = kx * nx + ky * ny;

        if (vn > 0) {
            let impulse = (2 * vn) / totalMass;
            c1.vx -= nx * impulse * c2.mass;
            c1.vy -= ny * impulse * c2.mass;
            c2.vx += nx * impulse * c1.mass;
            c2.vy += ny * impulse * c1.mass;

            if (c1.isPlayer) c1.angularVelocity -= vn * 0.015;
            if (c2.isPlayer) c2.angularVelocity += vn * 0.015;
            return vn;
        }
    }
    return 0;
}

// =====================================================================
//  GAME STATE
// =====================================================================
let state = 'MENU'; // MENU, COUNTDOWN, PLAYING, GOAL, PAUSED, GAMEOVER, plus the game's own G.states
let prevState = null;
let scores = { 1: 0, 2: 0 };
let countdown = 0, countdownShort = false, lastBeep = -1;
let goalTimer = 0, matchOver = false;
let matchFrames = 0, elapsed = 0, overtime = false;
let tickCount = 0;
let banner = null, shake = 0, flash = 0;
let streak = 0, lastScorer = 0;

const particles = [];

const controlsLive = () => state === 'PLAYING' || state === 'GOAL';
const ACTIVE_STATES = ['PLAYING', 'GOAL', 'COUNTDOWN', ...(G.states || [])];   // game states such as a duel
const mode = () => MODES[settings.mode];
const targetGoals = () => (mode().kind === 'none' ? 1 : settings.target);
const playerName = (n) => settings.teams === 2
    ? (n === 1 ? 'Blue Team' : 'Red Team')
    : net.active ? netSeatName(n, n === 1 ? 'Blue' : 'Red')
    : (n === 1 ? 'Player 1' : (isCPU() ? 'CPU' : 'Player 2'));
const actorLabel = (p) => net.active ? (p === myActor() ? 'YOU' : netSeatName(seatOf(p), 'BOT').toUpperCase())
    : p === p1 ? 'P1' : p === p2 ? (isCPU() ? 'CPU' : 'P2')
    : p === p3 ? (p3Human() ? 'P3' : 'BOT')
    : (p4Human() ? 'P4' : (isCPU() ? 'CPU' : 'BOT'));

// Online players bring their own look; local play uses the team cards
const skinOf = (p) => p.cos ? p.cos[0] : (p.playerNum === 1 ? settings.p1Skin : settings.p2Skin);
const hatOf = (p) => p.cos ? p.cos[1] : (p.playerNum === 1 ? settings.p1Hat : settings.p2Hat);
const bootsOf = (p) => p.cos ? p.cos[2] : (p.playerNum === 1 ? settings.p1Boots : settings.p2Boots);
const accOf = (p) => p.cos ? p.cos[3] : (p.playerNum === 1 ? settings.p1Acc : settings.p2Acc);

// =====================================================================
//  INPUT
// =====================================================================
const keys = {};
const touchState = { 1: { left: false, right: false }, 2: { left: false, right: false } };

function pressJump(p) {
    if (p.isBot && !p.__ai) return;
    if (controlsLive() || state === 'COUNTDOWN') p.isCharging = true;
}

function releaseFor(p) {
    if (controlsLive()) {
        const willJump = (p.y + p.radius >= CONFIG.groundY - 5) && p.isCharging;
        const c = p.chargeAmount / p.maxCharge;
        p.releaseJump();
        if (willJump) onJump(p, c);
    } else {
        p.isCharging = false;
        p.chargeAmount = 0;
    }
}

// Keyboard layout:
//   P1: W jump, A/D lean, S action
//   P2: ↑ jump, ←/→ lean, ↓ action   (vs CPU, the arrows go to P1, or to P3 in 2v2 Humans)
//   P3: T jump, F/H lean, G action   (2v2 Humans with 2 players)
//   P4: I jump, J/L lean, K action   (2v2 Humans with 2 players)
function arrowsOwner() {
    if (!isCPU()) return p2;
    return p3Human() ? p3 : p1;
}
function jumpTarget(code) {
    if (net.active) return (code === 'KeyW' || code === 'ArrowUp') ? myActor() : null;
    if (code === 'KeyW') return p1;
    if (code === 'ArrowUp') return arrowsOwner();
    if (code === 'KeyT' && p3Human() && !isCPU()) return p3;
    if (code === 'KeyI' && p4Human()) return p4;
    return null;
}

function actionTarget(code) {
    if (net.active) return (code === 'KeyS' || code === 'ArrowDown') ? myActor() : null;
    if (code === 'KeyS') return p1;
    if (code === 'ArrowDown') return arrowsOwner();
    if (code === 'KeyG' && p3Human() && !isCPU()) return p3;
    if (code === 'KeyK' && p4Human()) return p4;
    return null;
}

function gatherInput() {
    if (net.active) {
        // Host: our own keys drive our seat, remote seats use their last sent input
        const me = myActor();
        if (me) {
            me.input.left = !!(keys.KeyA || keys.ArrowLeft || touchState[1].left);
            me.input.right = !!(keys.KeyD || keys.ArrowRight || touchState[1].right);
        }
        for (const s in net.inputs) {
            const p = seatActor(+s);
            if (p && p !== me && !p.isBot) { p.input.left = net.inputs[s].l; p.input.right = net.inputs[s].r; }
        }
        for (const b of bots) b.think();
        return;
    }
    const cpu = isCPU();
    const arrows = arrowsOwner();
    p1.input.left = !!(keys.KeyA || (arrows === p1 && keys.ArrowLeft) || touchState[1].left);
    p1.input.right = !!(keys.KeyD || (arrows === p1 && keys.ArrowRight) || touchState[1].right);
    if (!cpu) {
        p2.input.left = !!(keys.ArrowLeft || touchState[2].left);
        p2.input.right = !!(keys.ArrowRight || touchState[2].right);
    }
    if (p3Human()) {
        p3.input.left = !!(arrows === p3 ? keys.ArrowLeft : keys.KeyF);
        p3.input.right = !!(arrows === p3 ? keys.ArrowRight : keys.KeyH);
    }
    if (p4Human()) {
        p4.input.left = !!keys.KeyJ;
        p4.input.right = !!keys.KeyL;
    }
    for (const b of bots) b.think();
}

function clearAllInput() {
    for (const k in keys) keys[k] = false;
    for (const n of [1, 2]) { touchState[n].left = false; touchState[n].right = false; }
    for (const p of players) { p.isCharging = false; p.chargeAmount = 0; ACT.cancel?.(p); p.input.left = p.input.right = false; }
    document.querySelectorAll('.tc-btn.on').forEach(b => b.classList.remove('on'));
    AI.reset();
    net.inputs = {};
    net.touch.j = net.touch.d = false;
    netLocalChanged();
}

window.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    if (cosOpen()) { if (e.code === 'Escape') cosHide(); return; }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if (!e.repeat) {
        if (e.code === 'Escape' || e.code === 'KeyP') { togglePause(); return; }
        if (e.code === 'KeyM') { toggleMute(); return; }
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            if (net.active || !onlineScreen.classList.contains('hidden')) return;
            if (state === 'MENU') startMatch();
            else if (state === 'GAMEOVER') startMatch();
            else if (state === 'PAUSED') togglePause();
            return;
        }
    }
    if (isGuest()) { netLocalChanged(); return; }
    const p = jumpTarget(e.code);
    if (G.onJumpPress?.(p, e.repeat)) return;
    const dp = actionTarget(e.code);
    if (dp && !e.repeat) ACT.down?.(dp);
    if (p) pressJump(p);
});

window.addEventListener('keyup', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    keys[e.code] = false;
    if (isGuest()) { netLocalChanged(); return; }
    const dp = actionTarget(e.code);
    if (dp) ACT.up?.(dp);
    const p = jumpTarget(e.code);
    if (p) releaseFor(p);
});

window.addEventListener('blur', () => {
    if (net.active) { netBlur(); return; } // online matches keep running
    clearAllInput();
    if (ACTIVE_STATES.includes(state)) togglePause();
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !net.active && ACTIVE_STATES.includes(state)) togglePause();
});

// ---------- Touch controls ----------
const isTouch = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);

function makeTouchBtn(label, pn, act, extra = '') {
    const b = document.createElement('div');
    b.className = `tc-btn p${pn} ${extra}`;
    b.textContent = label;
    const who = () => net.active ? myActor() : (pn === 1 ? p1 : p2);
    const down = (e) => {
        e.preventDefault();
        Sound.init();
        try { b.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        b.classList.add('on');
        if (isGuest()) {
            if (act === 'jump' || act === 'dig') net.touch[act[0]] = true; else touchState[pn][act] = true;
            netLocalChanged();
            return;
        }
        const player = who();
        if (!player) return;
        if (act === 'jump') { if (!G.onJumpPress?.(player, false)) pressJump(player); }
        else if (act === 'dig') ACT.down?.(player);
        else touchState[pn][act] = true;
    };
    const up = (e) => {
        e.preventDefault();
        if (!b.classList.contains('on')) return;
        b.classList.remove('on');
        if (isGuest()) {
            if (act === 'jump' || act === 'dig') net.touch[act[0]] = false; else touchState[pn][act] = false;
            netLocalChanged();
            return;
        }
        const player = who();
        if (!player) return;
        if (act === 'jump') releaseFor(player);
        else if (act === 'dig') ACT.up?.(player);
        else touchState[pn][act] = false;
    };
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
    return b;
}

function buildTouchControls() {
    const tc = $('touch-controls');
    if (!isTouch || (net.active && !net.mySeat)) { tc.classList.add('off'); return; }
    tc.classList.remove('off');
    const L = $('tc-left'), R = $('tc-right');
    L.innerHTML = ''; R.innerHTML = '';
    L.append(makeTouchBtn('◀', 1, 'left'), makeTouchBtn('▶', 1, 'right'));
    if (isCPU() || net.active) {
        R.append(makeTouchBtn(ACTION, 1, 'dig', 'dig'), makeTouchBtn('JUMP', 1, 'jump', 'jump'));
    } else {
        L.append(makeTouchBtn(ACTION, 1, 'dig', 'dig'), makeTouchBtn('JUMP', 1, 'jump', 'jump'));
        R.append(makeTouchBtn('JUMP', 2, 'jump', 'jump'), makeTouchBtn(ACTION, 2, 'dig', 'dig'), makeTouchBtn('◀', 2, 'left'), makeTouchBtn('▶', 2, 'right'));
    }
}

// =====================================================================
//  BOTS — CPU opponents and 2v2 teammates
//  Each bot plans by running the real physics (Actor + resolveCollision)
//  a couple of seconds ahead for every lean/charge (and the game's own moves), then picks the best.
// =====================================================================
const AI_HORIZON = 150;
let simulating = false;
const sim = {
    me: new Actor(0, 0, 32, '', true, 2),
    others: [new Actor(0, 0, 32, '', true, 1), new Actor(0, 0, 32, '', true, 1), new Actor(0, 0, 32, '', true, 1)],
    ball: new Actor(0, 0, CONFIG.ballR, '', false)
};
function copyActor(dst, src) {
    dst.x = src.x; dst.y = src.y; dst.vx = src.vx; dst.vy = src.vy;
    dst.angle = src.angle; dst.angularVelocity = src.angularVelocity; dst.targetAngle = src.targetAngle;
    dst.playerNum = src.playerNum;
    dst.chargeAmount = 0; dst.isCharging = false;
    dst.input.left = false; dst.input.right = false;
}

// The jump-planning skeleton every bot shares. The game decides what to plan (G.ai):
//   levels: { easy, normal, hard } skill tables ({ react, noise, blunder, charges, ... })
//   state: extra Bot fields the game's plan uses (reset with the bot)
//   busy(bot, L): called first each frame; return true to skip the rest (the game has a multi-frame action running)
//   plan(bot, L): the bot is idle on the ground; pick a plan and call bot.start(lean, chargeFrames) or set bot.cooldown
class Bot {
    constructor(p, level) { this.p = p; this.level = level; this.reset(); }
    reset() { Object.assign(this, { charging: false, frames: 0, target: 0, lean: 0, cooldown: 20 }, G.ai.state); }
    start(lean, frames) {
        const p = this.p;
        this.lean = lean;
        this.target = Math.max(1, Math.min(60, frames));
        this.frames = 0;
        this.charging = true;
        p.input.left = lean < 0;
        p.input.right = lean > 0;
        p.__ai = true; pressJump(p); p.__ai = false;
    }
    think() {
        const p = this.p;
        const L = G.ai.levels[this.level] || G.ai.levels.normal;
        if (G.ai.busy?.(this, L)) return;
        if (this.charging) {
            p.input.left = this.lean < 0;
            p.input.right = this.lean > 0;
            if (!p.isCharging) { this.charging = false; return; }
            this.frames++;
            if (this.frames >= this.target) {
                releaseFor(p);
                this.charging = false;
                this.lean = 0;
                this.cooldown = Math.round(L.react * (0.5 + Math.random()));
            }
            return;
        }
        p.input.left = false;
        p.input.right = false;
        const onGround = p.y + p.radius >= CONFIG.groundY - 2;
        if (!onGround || !controlsLive()) return;
        if (this.cooldown > 0) { this.cooldown--; return; }
        G.ai.plan(this, L);
    }
}
let bots = [];
const AI = { reset() { for (const b of bots) b.reset(); } };

// =====================================================================
//  EFFECTS
// =====================================================================
function emit(x, y, n, o = {}) {
    if (net.rec && !simulating) net.fx.push(['e', r2(x), r2(y), n, o]);
    for (let i = 0; i < n; i++) {
        if (particles.length > 600) particles.shift();
        const a = (o.angle ?? -Math.PI / 2) + (Math.random() - 0.5) * (o.spread ?? Math.PI * 2);
        const sp = (o.speed ?? 3) * (0.4 + Math.random() * 0.8);
        const life = (o.life ?? 30) * (0.6 + Math.random() * 0.6);
        const color = Array.isArray(o.color) ? o.color[(Math.random() * o.color.length) | 0] : (o.color || '#fff');
        particles.push({
            x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life, max: life, size: (o.size ?? 3) * (0.6 + Math.random() * 0.8),
            color, g: o.gravity ?? 0.15, drag: o.drag ?? 0.97,
            confetti: !!o.confetti, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4
        });
    }
}

function updateParticles() {
    let w = 0;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vy += p.g;
        p.vx *= p.drag; p.vy *= p.drag;
        p.x += p.vx; p.y += p.vy;
        p.rot += p.vr;
        p.life--;
        if (p.life > 0) particles[w++] = p;
    }
    particles.length = w;
}

function groundDustColor() {
    const a = curArena();
    if (a.ground === 'sand') return ['#f7e3b5', '#e9cf94'];
    if (a.ground === 'neon') return ['#ff2bd6', '#00f0ff'];
    return ['#b8e994', '#78e08f', '#dfe6e9'];
}

function onGroundImpact(a, impact) {
    if (simulating || state === 'MENU') return;
    if (!a.isPlayer) {
        if (impact > 2.5) Sound.bounce(impact);
    } else if (impact > 7) {
        emit(a.x, CONFIG.groundY, Math.min(14, impact | 0), { color: groundDustColor(), speed: 2.5, spread: Math.PI * 0.9, life: 22, size: 3, gravity: 0.12 });
    }
}

function onJump(p, c) {
    Sound.jump(c);
    emit(p.x, CONFIG.groundY, 6 + Math.round(c * 16), { color: groundDustColor(), speed: 2 + c * 3, spread: Math.PI * 0.8, life: 24, size: 3.5, gravity: 0.1 });
    if (c > 0.95) {
        emit(p.x, CONFIG.groundY - 10, 24, { color: ['#f1c40f', '#ffeaa7', '#fff'], speed: 5, life: 26, size: 3, gravity: 0.05, drag: 0.92 });
        shake = Math.max(shake, 4);
    }
}

function onKick(p, b, vn) {
    if (vn < 1.5) return;
    if (tickCount - b.lastKickSound > 4) {
        Sound.kick(vn);
        b.lastKickSound = tickCount;
    }
    const k = p.radius / (p.radius + b.radius);
    const cx = p.x + (b.x - p.x) * k, cy = p.y + (b.y - p.y) * k;
    emit(cx, cy, Math.min(14, Math.round(vn)), { color: [TEAM[p.playerNum], '#ffffff'], speed: 2 + vn * 0.35, life: 18, size: 2.5, gravity: 0.08, drag: 0.93 });
    if (vn > 12) shake = Math.max(shake, Math.min(8, vn * 0.4));
}

function showBanner(text, sub, color, dur, small = false) {
    if (net.rec) net.fx.push(['b', text, sub, color, dur, small]);
    banner = { text, sub, color, dur, t: 0, small };
}

// =====================================================================
//  FLOW
// =====================================================================
function setScoreUI(pop) {
    p1ScoreEl.textContent = scores[1];
    p2ScoreEl.textContent = scores[2];
    if (pop) {
        const el = pop === 1 ? p1ScoreEl : p2ScoreEl;
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    }
}

function fmtClock(sec) {
    const s = Math.max(0, sec);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

let lastInfo = '';
function updateInfo() {
    const m = mode();
    let text, low = false;
    if (m.kind === 'time') {
        if (overtime) text = `OVERTIME · NEXT ${G.point.toUpperCase()} WINS`;
        else { const s = Math.ceil(matchFrames / 60); text = fmtClock(s); low = s <= 10; }
    } else if (m.kind === 'none') {
        text = `GOLDEN ${G.point.toUpperCase()} · NEXT ${G.point.toUpperCase()} WINS`;
    } else if (m.kind === 'endless') {
        text = 'INFINITE · NO LIMIT';
    } else {
        text = (m.tag ? m.tag + ' · ' : '') + 'FIRST TO ' + settings.target;
    }
    if (text !== lastInfo) { matchInfoEl.textContent = text; lastInfo = text; }
    matchInfoEl.classList.toggle('low', low);
}

function resetPositions() {
    for (const p of players) p.reset();
    balls.forEach(b => b.reset());
    AI.reset();
    G.resetRound?.();
}

function beginKickoff(short) {
    resetPositions();
    state = 'COUNTDOWN';
    countdownShort = short;
    countdown = short ? 70 : 180;
    lastBeep = -1;
    if (short) showBanner('READY', '', '#ffffff', 70, true);
    updateCamera(true);
}

function startMatch() {
    Sound.init();
    const m = mode();
    CONFIG.gravity = m.gravity || BASE_GRAVITY;
    CONFIG.fieldW = fieldDef().w;
    buildBackground();
    buildBalls(m.balls || 1);
    layoutTeams();
    scores = { 1: 0, 2: 0 };
    overtime = false;
    matchOver = false;
    streak = 0; lastScorer = 0;
    elapsed = 0;
    matchFrames = settings.time * 60;
    particles.length = 0;
    banner = null; flash = 0; shake = 0;
    p2TagEl.textContent = settings.teams === 2 ? (isCPU() ? 'CPU ×2' : (p4Human() ? 'P2 + P4' : 'P2 + BOT')) : (isCPU() ? 'CPU' : 'P2');
    $('p1-tag').textContent = settings.teams === 2 ? (p3Human() ? 'P1 + P3' : 'P1 + BOT') : 'P1';
    if (net.active) netSetTags();
    setScoreUI(0);
    updateInfo();
    menuScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    celebrationScreen.classList.add('hidden');
    clearAllInput();
    buildTouchControls();
    beginKickoff(false);
}

function goMenu() {
    state = 'MENU';
    CONFIG.gravity = BASE_GRAVITY;
    clearAllInput();
    pauseScreen.classList.add('hidden');
    celebrationScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    refreshMenu();
}

const pauseTitle = document.querySelector('#pause-screen .pause-title');
function togglePause() {
    const online = net.active;
    pauseTitle.textContent = online ? 'MATCH MENU' : 'PAUSED';
    $('resume-btn').textContent = online ? 'Back to game' : 'Resume';
    $('pause-menu-btn').textContent = online ? 'Leave room' : 'Menu';
    $('restart-btn').classList.toggle('hide', online);
    if (online) {
        // Online matches can't be paused for everyone; this is just an overlay
        if (state === 'MENU') return;
        pauseScreen.classList.toggle('hidden');
        return;
    }
    if (state === 'PAUSED') {
        state = prevState;
        pauseScreen.classList.add('hidden');
    } else if (ACTIVE_STATES.includes(state)) {
        prevState = state;
        state = 'PAUSED';
        clearAllInput();
        pauseScreen.classList.remove('hidden');
    }
}

function toggleMute() {
    settings.muted = !settings.muted;
    muteBtn.textContent = settings.muted ? '🔇' : '🔊';
    saveSettings();
}

function checkGoals() {
    for (const ball of balls) {
        const side = G.scoredFor(ball);
        if (side) { goalScored(side, ball); return true; }
    }
    return false;
}

function goalScored(side, ball) {
    scores[side]++;
    setScoreUI(side);
    const kind = mode().kind;
    matchOver = kind === 'endless' ? false : (kind === 'time' ? overtime : scores[side] >= targetGoals());
    streak = side === lastScorer ? streak + 1 : 1;
    lastScorer = side;
    state = 'GOAL';
    goalTimer = 120;
    flash = 0.45;
    shake = 10;
    Sound.goal();
    const goalPalette = curBall().goal || [TEAM[side], '#ffffff', '#f1c40f'];
    emit(ball.x, ball.y, 70, { color: goalPalette, speed: 8, life: 70, size: 5, gravity: 0.18, drag: 0.96, confetti: true });
    showBanner(`${G.point.toUpperCase()}!`, `${playerName(side)} scores` + (streak >= 2 ? ` · ${streak} in a row` : ''), TEAM[side], 115);
}

function showGameOver() {
    const winner = scores[1] > scores[2] ? 1 : 2;
    winnerText.textContent = `${playerName(winner)} Wins!`;
    winnerText.style.color = TEAM[winner];
    finalScoreEl.innerHTML = `<span class="s1">${scores[1]}</span> – <span class="s2">${scores[2]}</span>`;
    matchSummaryEl.textContent = `${mode().name} · ${fmtClock(Math.round(elapsed / 60))} played`;
    clearAllInput();
    const guest = isGuest();
    $('rematch-btn').classList.toggle('hide', guest);
    $('ol-wait').classList.toggle('hide', !guest);
    $('menu-btn').textContent = net.active ? (net.isHost ? 'Lobby' : 'Leave') : 'Main Menu';
    pauseScreen.classList.add('hidden');
    celebrationScreen.classList.remove('hidden');
}

function endMatch() {
    state = 'GAMEOVER';
    const winner = scores[1] > scores[2] ? 1 : 2;
    showGameOver();
    Sound.fanfare();
    for (let i = 0; i < 4; i++) {
        emit(camX + 150 + i * 240, 60, 40, { color: [TEAM[winner], '#ffffff', '#f1c40f'], speed: 6, angle: Math.PI / 2, spread: Math.PI, life: 140, size: 6, gravity: 0.08, drag: 0.985, confetti: true });
    }
}

// =====================================================================
//  SIMULATION (fixed 60Hz step so speed is identical on any monitor)
// =====================================================================
function physicsStep() {
    gatherInput();

    for (const p of players) p.update();
    for (const b of balls) b.update();

    for (const b of balls) {
        for (const p of players) { const h = resolveCollision(p, b); if (h > 0) onKick(p, b, h); }
    }
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const hp = resolveCollision(players[i], players[j]);
            if (hp > 5) { Sound.bump(); shake = Math.max(shake, 3); }
        }
    }
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) resolveCollision(balls[i], balls[j]);
    }

    for (const p of players) {
        ACT.step?.(p);
        const full = p.chargeAmount === p.maxCharge;
        if (full && !p.wasFull && !p.isBot) Sound.charged();
        p.wasFull = full;
        if (p.isCharging && p.chargeAmount > 5 && tickCount % 6 === 0) {
            emit(p.x + (Math.random() - 0.5) * 40, CONFIG.groundY - 2, 1, { color: full ? '#f1c40f' : 'rgba(255,255,255,0.8)', speed: 1.2, angle: -Math.PI / 2, spread: 0.6, life: 25, size: 2.5, gravity: -0.02 });
        }
    }

    const fx = ballFx(curBall());
    for (const b of balls) {
        b.spin += b.vx / b.radius;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 9) b.trail.shift();
        if (fx && tickCount % fx.every === 0 && Math.hypot(b.vx, b.vy) > fx.minSpeed) emit(b.x, b.y, 1, fx.opts);
    }
}

function tick() {
    if (isGuest()) { guestTick(); return; }
    tickSim();
    if (net.rec && tickCount % SNAP_EVERY === 0 && (state !== 'GAMEOVER' || net.fx.length || tickCount % 60 === 0)) netSendSnap();
}

function tickSim() {
    tickCount++;
    if (state === 'MENU' || state === 'PAUSED') return;

    updateParticles();
    updateCamera(false);
    if (shake > 0) { shake *= 0.88; if (shake < 0.3) shake = 0; }
    if (flash > 0) { flash -= 0.03; if (flash < 0) flash = 0; }
    if (banner && ++banner.t >= banner.dur) banner = null;

    switch (state) {
        case 'COUNTDOWN':
            countdown--;
            if (!countdownShort) {
                const sec = Math.ceil(countdown / 60);
                if (sec > 0 && sec !== lastBeep) {
                    lastBeep = sec;
                    Sound.beep(false);
                    showBanner(String(sec), '', '#ffffff', 60);
                }
            }
            if (countdown <= 0) {
                state = 'PLAYING';
                Sound.whistle();
                showBanner('GO!', '', '#f1c40f', 45);
            }
            break;

        case 'PLAYING':
            physicsStep();
            elapsed++;
            if (checkGoals()) break;
            G.step?.();
            if (state !== 'PLAYING') break;
            if (mode().kind === 'time' && !overtime) {
                matchFrames--;
                const s = Math.ceil(matchFrames / 60);
                if (matchFrames % 60 === 0 && s > 0 && s <= 5) Sound.beep(true);
                if (matchFrames <= 0) {
                    matchFrames = 0;
                    Sound.whistle();
                    if (scores[1] !== scores[2]) { endMatch(); break; }
                    overtime = true;
                    showBanner('OVERTIME', `Next ${G.point} wins`, '#f1c40f', 120);
                }
            }
            updateInfo();
            break;

        case 'GOAL':
            physicsStep(); // players can keep wobbling; goals aren't counted
            goalTimer--;
            if (goalTimer <= 0) {
                if (matchOver) endMatch();
                else beginKickoff(true);
            }
            break;

        default:   // GAMEOVER or one of the game's own G.states
            G.tickState?.();
    }
}

