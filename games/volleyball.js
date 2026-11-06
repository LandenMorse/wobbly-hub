// Wobbly Volleyball: the rules. Everything else (menus, physics, bots' skeleton, online rooms) is the shared engine in shared/.
// Written against docs/GAMES.md. Engine names (state, balls, players, emit, Sound, CONFIG...) are globals from shared/*.js.
(() => {
'use strict';

const NET_BOUNCE = 0.45;      // how lively the net is
const TOUCH_GAP = 14;         // frames before the same player's contact counts as a new touch
const SPIKE_FRAMES = 12;      // how long a spike lunge can smash the ball

// NET, TOUCHES AND SPIKES
// Players can't cross the net at any height.
function playerRange(p) {
    const edge = CONFIG.netHalf + p.radius;
    return p.playerNum === 1 ? [-Infinity, CONFIG.netX - edge] : [CONFIG.netX + edge, Infinity];
}
// The net is a post from netTop down to the ground with a rounded top: the ball bounces off the post and can roll over the tape.
// Returns the speed the ball hit the net with (0 if it didn't).
function courtCollide(a) {
    const NX = CONFIG.netX, half = CONFIG.netHalf;
    if (a.isPlayer) {
        const [lo, hi] = playerRange(a);
        if (a.x > hi) { a.x = hi; if (a.vx > 0) a.vx = -a.vx * a.restitution; }
        else if (a.x < lo) { a.x = lo; if (a.vx < 0) a.vx = -a.vx * a.restitution; }
        return 0;
    }
    const cy = Math.max(CONFIG.netTop, Math.min(CONFIG.groundY, a.y));   // closest point on the post
    const dx = a.x - NX, dy = a.y - cy;
    const d = Math.hypot(dx, dy), min = a.radius + half;
    if (d >= min) return 0;
    let nx, ny;
    if (d > 0.0001) { nx = dx / d; ny = dy / d; } else { nx = a.vx > 0 ? -1 : 1; ny = 0; }
    a.x = NX + nx * min;
    a.y = cy + ny * min;
    const vn = a.vx * nx + a.vy * ny;
    if (vn < 0) {
        a.vx -= (1 + NET_BOUNCE) * vn * nx;
        a.vy -= (1 + NET_BOUNCE) * vn * ny;
    }
    // Never let the ball balance on the tape
    if (ny < -0.7 && Math.abs(a.vx) < 0.4) a.vx = a.x <= NX ? -0.6 : 0.6;
    return Math.max(0, -vn);
}

// Three touches per side. Contacts from the same player within TOUCH_GAP frames count as one touch.
let pendingFault = null;
function registerTouch(p, b) {
    if (state !== 'PLAYING') return;
    const team = p.playerNum;
    if (b.touchTeam === team) {
        if (b.lastToucher === p && tickCount - b.lastTouchTick < TOUCH_GAP) { b.lastTouchTick = tickCount; return; }
        b.touchCount++;
    } else {
        b.touchTeam = team;
        b.touchCount = 1;
    }
    b.hits = (b.hits || 0) + 1;
    b.lastToucher = p;
    b.lastTouchTick = tickCount;
    if (b.touchCount > 3 && !mode().noTouchLimit && !pendingFault) pendingFault = { team: team === 1 ? 2 : 1, ball: b };
}

// Spike: tap S / ↓ in the air to lunge at the net. A ball you hit during the lunge is smashed down over it.
function applySpike(p) {
    if (p.spikeUsed || p.y + p.radius >= CONFIG.groundY - 2) return false;
    const dir = p.playerNum === 1 ? 1 : -1;
    p.spikeUsed = true;
    p.spikeT = SPIKE_FRAMES;
    p.vx += dir * 2.5;
    p.vy = Math.max(p.vy, 0) + 3;
    p.angularVelocity += dir * 0.35;
    return true;
}
function spikeHit(p, b) {
    if (!(p.spikeT > 0)) return false;
    const dir = p.playerNum === 1 ? 1 : -1;
    b.vx = dir * 12 + p.vx * 0.3;
    b.vy = Math.max(2, b.vy * 0.2 + 4);
    p.spikeT = 0;
    return true;
}
function spikeFor(p) {
    if (p.isBot && !p.__ai) return;
    if (!controlsLive() || !applySpike(p)) return;
    p.spikeAnim = 12;
    Sound.swoosh();
    emit(p.x, p.y, 8, { color: ['#ffffff', TEAM[p.playerNum]], speed: 2.5, life: 14, size: 2.5, gravity: 0 });
}
function onSpikeHit(p, b) {
    b.lastSpike = tickCount;
    b.lastSpikeTeam = p.playerNum;
    Sound.spike();
    shake = Math.max(shake, 7);
    emit(b.x, b.y, 22, { color: ['#f1c40f', '#ffffff', TEAM[p.playerNum]], speed: 6, life: 22, size: 3, gravity: 0.05, drag: 0.9 });
}
function onNetHit(b, v) {
    if (tickCount - (b.lastNetSound || 0) > 6) { Sound.bounce(v); b.lastNetSound = tickCount; }
    emit(b.x, b.y, Math.min(8, v | 0), { color: ['#ffffff', 'rgba(255,255,255,0.6)'], speed: 2, life: 14, size: 2, gravity: 0.1 });
}

// SERVING: the team that wins a point serves the next one (rally scoring), rotating servers on a side-out
let servingTeam = 1, serverIdx = { 1: 0, 2: 0 };
// A team's players, back row first (the back player serves first in 2v2)
function teamPlayers(t) {
    return players.filter(p => p.playerNum === t).sort((a, b) => Math.abs(b.startX - CONFIG.netX) - Math.abs(a.startX - CONFIG.netX));
}
// The serve: the ball drops onto the server's head. In Multi-Ball the second ball drops on the other side.
function placeServe() {
    balls.forEach((b, i) => {
        const t = i === 0 ? servingTeam : (servingTeam === 1 ? 2 : 1);
        const tp = teamPlayers(t);
        const s = tp[(i === 0 ? serverIdx[t] : 0) % tp.length];
        b.startX = s.startX + (t === 1 ? 4 : -4);
        b.startY = CONFIG.groundY - 260;
        b.reset();
        b.touchTeam = 0; b.touchCount = 0; b.hits = 0; b.lastToucher = null; b.lastTouchTick = -999;
        b.lastSpike = -999; b.lastSpikeTeam = 0;
        b.side = b.x < CONFIG.netX ? 1 : 2;
    });
}
// What the ref calls before a serve
function serveCall() {
    if (mode().kind !== 'goals') return 'READY';
    const t = targetGoals(), a = scores[1], b = scores[2];
    if (a >= t - 1 && a === b) return 'DEUCE';
    if ((a >= t - 1 && a > b) || (b >= t - 1 && b > a)) return 'MATCH POINT';
    return 'READY';
}

// A rally ends when a ball touches the floor: the point goes to the other side. 1 = point for Blue, 2 = point for Red, 0 = still in play
function floorWinner(b) {
    if (b.y + b.radius < CONFIG.groundY - 1) return 0;
    return b.x < CONFIG.netX ? 2 : 1;
}

// BOTS: the plan that picks a lean, a walk or a charge by running the real physics ahead
// The last time anyone touched any ball. Bots drop a plan made before the latest touch.
const lastTouchAny = () => balls.reduce((m, b) => Math.max(m, b.lastTouchTick || -999), -999);

// Run one plan through the real physics: lean (while charging, or for `walk` frames on foot),
// then jump after n frames of charge. Touch faults count against us too.
function simulatePlan(p, ball, lean, n, walk = 0) {
    const me = sim.me, b = sim.ball;
    copyActor(me, p); copyActor(b, ball);
    const os = [];
    for (const q of players) {
        if (q === p) continue;
        const o = sim.others[os.length];
        copyActor(o, q);
        os.push(o);
    }
    me.isCharging = n > 0;
    const limit = !mode().noTouchLimit;
    let touches = ball.touchTeam === p.playerNum ? (ball.touchCount || 0) : 0, lastTouch = -99;
    let result = 0, touched = false, f = 0;
    simulating = true;
    for (; f < AI_HORIZON; f++) {
        if (n > 0 && f === n) me.releaseJump();
        const leanNow = (f <= n || f < walk) ? lean : 0;
        me.input.left = leanNow < 0;
        me.input.right = leanNow > 0;
        for (const o of os) o.update();
        me.update(); b.update();
        for (const o of os) resolveCollision(o, b);
        if (resolveCollision(me, b) > 0) {
            if (f - lastTouch > TOUCH_GAP) touches++;
            lastTouch = f;
            touched = true;
        }
        for (const o of os) resolveCollision(o, me);
        courtCollide(me);
        for (const o of os) courtCollide(o);
        courtCollide(b);
        if (limit && touches > 3) { result = -1; break; }
        if ((b.x < CONFIG.netX ? 1 : 2) !== p.playerNum) touches = 0;   // it went over: a fresh count next time
        const g = floorWinner(b);
        if (g) { result = g === p.playerNum ? 1 : -1; break; }
    }
    simulating = false;
    return { result, touched, f, ballX: b.x, ballY: b.y, meX: me.x, jumped: n > 0 };
}
function scorePlan(r, p, support) {
    const team = p.playerNum;
    let s = 0;
    if (r.result === 1) s += 2000 - r.f * 4;          // we win the point
    else if (r.result === -1) {                        // we lose it, but still try to get there
        s -= 3000 - r.f * 4;
        s -= Math.abs(r.meX - r.ballX) * 1.5;
    } else {
        const theirs = team === 1 ? r.ballX > CONFIG.netX : r.ballX < CONFIG.netX;
        if (theirs) s += 300;                                          // sent over and still flying
        else {
            s -= Math.abs(r.meX - r.ballX) * (support ? 0.35 : 0.9);    // still on our side: get under it
            if (r.ballY < CONFIG.groundY - 160) s += 60;               // and keep it up
        }
    }
    s -= Math.abs(r.meX - p.startX) * (support ? 0.5 : 0.12);        // drift back towards our spot
    if (r.touched && r.result >= 0) s += support ? 10 : 30;
    if (r.jumped && !r.touched && r.result >= 0) s -= 80;   // a jump that doesn't reach the ball just leaves us stuck charging
    return s;
}

function planVolleyball(bot, L) {
    const p = bot.p;
    const team = p.playerNum;
    // Focus on the ball that matters most: on our side, close, and low
    let ball = balls[0], best = Infinity;
    for (const bl of balls) {
        const ours = (bl.x < CONFIG.netX ? 1 : 2) === team;
        const s = Math.hypot(bl.x - p.x, bl.y - p.y) + (ours ? 0 : 400) - (CONFIG.groundY - bl.y) * 0.2;
        if (s < best) { best = s; ball = bl; }
    }
    // In 2v2, whoever is further from the ball covers their own spot
    const myD = Math.hypot(ball.x - p.x, ball.y - p.y);
    const support = players.some(q => q !== p && q.playerNum === team && Math.hypot(ball.x - q.x, ball.y - q.y) < myD - 20);

    if (Math.random() < L.blunder) {
        bot.start([-1, 0, 1][(Math.random() * 3) | 0], L.charges[(Math.random() * L.charges.length) | 0]);
        bot.seen = lastTouchAny();
        return;
    }

    const noise = () => (Math.random() * 2 - 1) * L.noise;
    let bestScore = scorePlan(simulatePlan(p, ball, 0, 0), p, support) + noise();
    let bestLean = 0, bestN = 0, bestWalk = 0;
    for (const lean of [-1, 1]) {
        for (const w of L.walks) {
            const sc = scorePlan(simulatePlan(p, ball, lean, 0, w), p, support) + noise();
            if (sc > bestScore) { bestScore = sc; bestLean = lean; bestN = 0; bestWalk = w; }
        }
    }
    for (const lean of [-1, 0, 1]) {
        for (const n of L.charges) {
            const sc = scorePlan(simulatePlan(p, ball, lean, n), p, support) + noise();
            if (sc > bestScore) { bestScore = sc; bestLean = lean; bestN = n; bestWalk = 0; }
        }
    }
    if (bestN > 0) { bot.start(bestLean, bestN); bot.seen = lastTouchAny(); }
    else if (bestWalk > 0) { bot.walking = bestWalk; bot.lean = bestLean; bot.seen = lastTouchAny(); }
    else bot.cooldown = Math.max(6, L.react);
}

// Touch counter for the side that has the ball (hidden when there's no limit)
function drawTouches() {
    if (mode().noTouchLimit || (state !== 'PLAYING' && state !== 'GOAL')) return;
    const b = balls[0];
    if (!b || !b.touchTeam || !b.touchCount) return;
    const t = b.touchTeam;
    const cx = t === 1 ? CONFIG.netX / 2 : (CONFIG.netX + CONFIG.fieldW) / 2, y = CONFIG.groundY + 42;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - 62, y - 13, 124, 26, 13); else ctx.rect(cx - 62, y - 13, 124, 26);
    ctx.fill();
    ctx.font = '800 11px Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TOUCHES', cx - 22, y + 1);
    for (let i = 0; i < 3; i++) {
        const x = cx + 18 + i * 14;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
        if (i < b.touchCount) { ctx.fillStyle = b.touchCount >= 3 ? '#f1c40f' : TEAM[t]; ctx.fill(); }
        else { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    }
    ctx.restore();
}

function drawCourt(g, A, FW, GY) {
    const MID = FW / 2;
    // Attack lines
    g.fillStyle = A.line;
    for (const x of [MID - 180, MID + 180]) g.fillRect(x - 2, GY, 4, 10);

    // Net: a post with a mesh band under the tape (the ball bounces off the same shape, see courtCollide)
    const NX = CONFIG.netX, NT = CONFIG.netTop, band = 70, bw = 9;
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.beginPath(); g.ellipse(NX, GY + 3, 22, 4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.22)';
    g.fillRect(NX - bw, NT, bw * 2, band);
    g.strokeStyle = A.net; g.lineWidth = 1;
    for (let x = NX - bw; x <= NX + bw + 0.1; x += 6) { g.beginPath(); g.moveTo(x, NT); g.lineTo(x, NT + band); g.stroke(); }
    for (let y = NT; y <= NT + band; y += 6) { g.beginPath(); g.moveTo(NX - bw, y); g.lineTo(NX + bw, y); g.stroke(); }
    g.strokeStyle = A.post; g.lineWidth = 6; g.lineCap = 'round';
    if (A.ground === 'neon') { g.shadowBlur = 14; g.shadowColor = A.post; }
    g.beginPath(); g.moveTo(NX, GY); g.lineTo(NX, NT + 2); g.stroke();
    g.shadowBlur = 0; g.lineCap = 'butt';
    g.fillStyle = '#ffffff';
    g.fillRect(NX - bw - 3, NT - 4, bw * 2 + 6, 7);
    g.fillStyle = 'rgba(0,0,0,0.2)';
    g.fillRect(NX - bw - 3, NT + 1, bw * 2 + 6, 2);
}

Games.define({
    id: 'volleyball',
    point: 'point',
    subtitle: 'Hold jump to charge · lean to aim · tap down in the air to spike',
    startLabel: 'Serve',
    overLabel: 'FINAL SCORE',
    hint: 'three touches per side · win by 2',
    storageKey: 'wobblyVolleyball.settings.v1',      // keep: players' saved settings live here
    defaults: { target: 11, ball: 'beach', arena: 'beach' },
    targets: [7, 11, 15],
    winBy: 2,
    pickSeats: true,
    // A bigger, floatier ball with a speed cap so rallies stay readable; players walk properly, steer in the air
    // and hang near the top of a jump long enough to line up a spike (jumps keep roughly the same height, they just last longer)
    config: {
        ballR: 21, ballGravity: 0.5, ballMaxSpeed: 13,
        walkAccel: 1.5, walkMax: 5, airAccel: 0.35, airMax: 6,
        airGravity: 0.6, apexBand: 3, apexHang: 0.5, jumpScale: Math.sqrt(0.6),
        netX: 512, netTop: 360, netHalf: 6   // the net stands in the middle of the court
    },
    modes: [
        { id: 'classic', desc: 'First to the target, win by 2. Three touches per side.' },
        { id: 'timed', desc: 'Most points when the clock hits zero. Ties go to sudden death.' },
        { id: 'multi', desc: 'Two balls at once and no touch limit. Pure chaos.', balls: 2, noTouchLimit: true },
        { id: 'moon', desc: 'Low gravity. Sky-high rallies.' },
        { id: 'infinite', desc: 'No score limit, no clock. Rally forever.' }
    ],
    sounds: {
        spike()   { this.noise(0.16, 0.3, 2400, 0.7); this.tone(140, 0.2, 'sine', 0.35, 45); this.tone(1200, 0.08, 'square', 0.04, 500); },
        swoosh()  { this.noise(0.14, 0.1, 1600, 1.2); }
    },
    ballSpots: (n) => Array.from({ length: n }, () => [CONFIG.netX, 150]),
    scoredFor: (b) => pendingFault ? pendingFault.team : floorWinner(b),
    playerRange,
    onContact(p, b) {
        registerTouch(p, b);
        if (spikeHit(p, b)) onSpikeHit(p, b);
    },
    afterCollisions() {
        for (const p of players) courtCollide(p);
        for (const b of balls) {
            const hn = courtCollide(b);
            if (hn > 2.5) onNetHit(b, hn);
            const side = b.x < CONFIG.netX ? 1 : 2;   // crossing the net starts a fresh touch count
            if (side !== b.side) { b.side = side; b.touchTeam = 0; b.touchCount = 0; }
        }
    },
    resetRound(first) {
        if (first) { servingTeam = Math.random() < 0.5 ? 1 : 2; serverIdx = { 1: 0, 2: 0 }; }   // coin toss for the first serve
        pendingFault = null;
        placeServe();
    },
    kickoffCall: (short) => short
        ? { title: serveCall(), sub: `${playerName(servingTeam)} to serve` }
        : { sub: `${playerName(servingTeam)} serves first` },
    // A point: an ace, a spike or a plain rally win on the floor, or a fourth touch
    celebrate(side, ball) {
        const why = pendingFault ? 'touches' : 'floor';
        pendingFault = null;
        const ace = why === 'floor' && side === servingTeam && ball.hits === 1;
        const kill = why === 'floor' && tickCount - ball.lastSpike < 90 && ball.lastSpikeTeam === side;
        if (side !== servingTeam) { servingTeam = side; serverIdx[side]++; }   // side-out: winners serve, next player up
        flash = why === 'floor' ? 0.4 : 0.2;
        shake = kill ? 12 : 8;
        Sound.goal();
        if (why === 'floor') {
            const pal = curBall().goal || [TEAM[side], '#ffffff', '#f1c40f'];
            emit(ball.x, CONFIG.groundY - 4, 60, { color: pal, speed: 7, angle: -Math.PI / 2, spread: Math.PI * 0.9, life: 60, size: 5, gravity: 0.2, drag: 0.96, confetti: true });
            emit(ball.x, CONFIG.groundY, 24, { color: groundDustColor(), speed: 4, angle: -Math.PI / 2, spread: Math.PI * 0.8, life: 30, size: 4, gravity: 0.2 });
        } else {
            Sound.whistle();
        }
        const title = why === 'touches' ? '4 TOUCHES' : ace ? 'ACE!' : kill ? 'SPIKE!' : 'POINT!';
        const sub = why === 'touches' ? `Point to ${playerName(side)}` : `${playerName(side)} scores` + (streak >= 2 ? ` · ${streak} in a row` : '');
        showBanner(title, sub, TEAM[side], 115, why === 'touches');
    },
    // The second button: tap in the air to spike
    action: {
        name: 'spike',
        tip: '(in the air)',
        reset(p) { p.spikeT = 0; p.spikeUsed = false; p.spikeAnim = 0; },
        update(p, onGround) {
            if (p.spikeT > 0) p.spikeT--;
            if (onGround) p.spikeUsed = false;
        },
        down: spikeFor,
        step(p) { if (p.spikeAnim > 0) p.spikeAnim--; },
        squash: (p) => (p.spikeAnim || 0) / 12,
        snap: (p) => [p.spikeAnim],
        apply(p, A, i) { p.spikeAnim = A[i] | 0; }
    },
    // Online: the touch counter the host shows
    snap: () => ({ tc: balls.map(b => [b.touchTeam | 0, b.touchCount | 0]) }),
    applySnap(s) {
        if (!Array.isArray(s.tc)) return;
        balls.forEach((b, i) => { const t = s.tc[i]; if (Array.isArray(t)) { b.touchTeam = t[0] | 0; b.touchCount = t[1] | 0; } });
    },
    ai: {
        levels: {
            easy:   { react: 40, noise: 500, blunder: 0.25, spike: 0.03, walks: [12, 30], charges: [1, 15, 30, 45, 60] },
            normal: { react: 16, noise: 150, blunder: 0.06, spike: 0.12, walks: [8, 20, 40], charges: [1, 5, 10, 15, 20, 26, 32, 40, 48, 56, 60] },
            hard:   { react: 3,  noise: 12,  blunder: 0,    spike: 0.4,  walks: [6, 14, 28, 48], charges: [1, 4, 8, 12, 16, 20, 25, 30, 36, 42, 48, 54, 60] }
        },
        state: { walking: 0, seen: -999 },
        busy(bot, L) {
            const p = bot.p;
            const onGround = p.y + p.radius >= CONFIG.groundY - 2;
            // Someone hit the ball since we planned: the plan is stale, so drop it and think again
            if ((bot.charging || bot.walking > 0) && lastTouchAny() !== bot.seen) {
                if (bot.charging) { p.isCharging = false; p.chargeAmount = 0; }
                bot.charging = false; bot.walking = 0; bot.cooldown = 0;
                p.input.left = p.input.right = false;
            }
            // In the air: spike a ball that's high and just in front of us
            if (!onGround && !p.spikeUsed && controlsLive() && Math.random() < L.spike) {
                const dir = p.playerNum === 1 ? 1 : -1;
                for (const b of balls) {
                    const dx = (b.x - p.x) * dir, dy = b.y - p.y;
                    if (dx > -6 && dx < 64 && dy > -80 && dy < 6 && b.y < CONFIG.netTop - 10 && Math.abs(b.x - CONFIG.netX) < 320) {
                        p.__ai = true; spikeFor(p); p.__ai = false;
                        break;
                    }
                }
            }
            if (bot.walking > 0) {
                p.input.left = bot.lean < 0;
                p.input.right = bot.lean > 0;
                if (--bot.walking === 0) { p.input.left = p.input.right = false; bot.cooldown = Math.max(2, L.react >> 2); }
                return true;
            }
            return false;
        },
        plan: planVolleyball
    },
    draw: {
        field: drawCourt,
        world: drawTouches,
        thumb(g, A, gy) {
            g.strokeStyle = A.post; g.lineWidth = 3; g.beginPath(); g.moveTo(THUMB / 2, gy); g.lineTo(THUMB / 2, gy - 22); g.stroke();
            g.fillStyle = '#ffffff'; g.fillRect(THUMB / 2 - 5, gy - 24, 10, 3);
        }
    }
});
})();
