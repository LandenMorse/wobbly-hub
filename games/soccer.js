// Wobbly Soccer: the rules. Everything else (menus, physics, bots' skeleton, online rooms) is the shared engine in shared/.
// Written against docs/GAMES.md. Engine names (state, balls, players, emit, Sound, CONFIG...) are globals from shared/*.js.
(() => {
'use strict';

// DIG: scoop a ball that is on the ground up into the air
const DIG_COOLDOWN = 40;
const DIG_MAX = 40; // frames to fully charge a dig (2/3 s)
function canDig(p, b) {
    return p.y + p.radius >= CONFIG.groundY - 2
        && b.y + b.radius >= CONFIG.groundY - 34
        && Math.abs(b.x - p.x) < p.radius + b.radius + 22
        && b.y > p.y - 10;
}
function digAim(p) { return p.input.left ? -1 : p.input.right ? 1 : (p.playerNum === 1 ? 1 : -1); }
// ratio 0 = quick tap, 1 = fully charged
function applyDig(b, aim, ratio = 0) {
    b.y = Math.min(b.y, CONFIG.groundY - b.radius - 2);
    b.vy = -(10 + ratio * 7);
    b.vx = aim * (3.2 + ratio * 3.3);
}
function startDigCharge(p) {
    if (p.isBot && !p.__ai) return;
    if (!controlsLive() && state !== 'COUNTDOWN') return;
    p.digCharging = true;
    p.digCharge = 0;
}
function releaseDig(p) {
    if (!p.digCharging) return;
    const ratio = p.digCharge / DIG_MAX;
    p.digCharging = false;
    p.digCharge = 0;
    doDig(p, ratio);
}
function doDig(p, ratio = 0) {
    if (!controlsLive() || p.digCD > 0) return;
    let target = null, best = Infinity;
    for (const b of balls) {
        if (canDig(p, b)) { const d = Math.abs(b.x - p.x); if (d < best) { best = d; target = b; } }
    }
    p.digAnim = 12;
    if (target) {
        applyDig(target, digAim(p), ratio);
        p.digCD = DIG_COOLDOWN;
        Sound.dig(ratio);
        emit(target.x, CONFIG.groundY, 14 + Math.round(ratio * 16), { color: groundDustColor(), speed: 3.5 + ratio * 3, angle: -Math.PI / 2, spread: Math.PI * 0.7, life: 26, size: 3.5, gravity: 0.18 });
        if (ratio > 0.95) shake = Math.max(shake, 4);
    } else {
        p.digCD = 15;
        if (p.y + p.radius >= CONFIG.groundY - 2) emit(p.x, CONFIG.groundY, 5, { color: groundDustColor(), speed: 1.5, angle: -Math.PI / 2, spread: Math.PI * 0.6, life: 16, size: 2.5 });
    }
}

// Deadlock -> duel
const LOCK_WARN = 60;     // 1s of deadlock before the timer appears
const LOCK_DUEL = 240;    // then a 3s countdown into the duel
const DUEL_FRAMES = 240;  // 4s of mashing
const DUEL_STEP = 0.07;   // meter movement per tap
const DUEL_CPU_RATE = { easy: 5, normal: 7, hard: 9 }; // taps per second
let lockFrames = 0, lockBall = null, lastLockSec = -1;
let duel = null;

// DEADLOCK -> DUEL
let lockPair = null; // { 1: blue player, 2: red player } pinning the ball
function findLockedBall() {
    const grounded = (p) => p.y + p.radius >= CONFIG.groundY - 2;
    for (const b of balls) {
        if (b.y < CONFIG.groundY - 90) continue;          // ball must be low
        if (Math.hypot(b.vx, b.vy) > 2.5) continue;       // and barely moving
        const near = players.filter(p => grounded(p) && Math.hypot(b.x - p.x, b.y - p.y) < p.radius + b.radius + 16);
        for (const a of near) {
            if (a.playerNum !== 1) continue;
            for (const c of near) {
                if (c.playerNum !== 2) continue;
                // squeezed between a blue and a red player
                if (b.x > Math.min(a.x, c.x) && b.x < Math.max(a.x, c.x)) { lockPair = { 1: a, 2: c }; return b; }
            }
        }
    }
    return null;
}

function updateDeadlock() {
    const b = findLockedBall();
    if (b) { lockFrames++; lockBall = b; }
    else { lockFrames = Math.max(0, lockFrames - 3); if (lockFrames === 0) lockBall = null; }
    if (lockFrames >= LOCK_WARN && b) {
        const sec = Math.ceil((LOCK_DUEL - lockFrames) / 60);
        if (sec > 0 && sec !== lastLockSec) { lastLockSec = sec; Sound.beep(false); }
    } else if (lockFrames < LOCK_WARN) {
        lastLockSec = -1;
    }
    if (lockFrames >= LOCK_DUEL && lockBall) startDuel(lockBall);
}

function startDuel(b) {
    state = 'DUEL';
    duel = { v: 0, frames: DUEL_FRAMES, intro: 45, taps: { 1: 0, 2: 0 }, ball: b, cpuAcc: 0, pair: lockPair || { 1: p1, 2: p2 } };
    lockFrames = 0; lockBall = null; lastLockSec = -1;
    for (const p of players) { p.isCharging = false; p.chargeAmount = 0; p.input.left = p.input.right = false; }
    AI.reset();
    banner = null;
    shake = 6;
    Sound.whistle();
    emit(b.x, b.y, 24, { color: ['#f1c40f', '#ffffff'], speed: 5, life: 26, size: 3, gravity: 0.05, drag: 0.92 });
}

function duelTap(n) {
    if (state !== 'DUEL' || !duel || duel.intro > 0) return;
    duel.taps[n]++;
    duel.v = Math.max(-1, Math.min(1, duel.v + (n === 1 ? DUEL_STEP : -DUEL_STEP)));
    Sound.tone(n === 1 ? 560 : 440, 0.04, 'square', 0.03);
    const p = (duel.pair && duel.pair[n]) || (n === 1 ? p1 : p2);
    emit(p.x, p.y - p.radius, 2, { color: TEAM[n], speed: 2.5, life: 14, size: 2.5, gravity: 0.05 });
    if (Math.abs(duel.v) >= 1) endDuel(duel.v > 0 ? 1 : 2);
}

function endDuel(w) {
    const win = duel.pair[w], lose = duel.pair[w === 1 ? 2 : 1];
    const dir = w === 1 ? 1 : -1; // winner's attacking direction
    const b = duel.ball;
    // Ball pops out in front of the winner
    b.x = Math.max(b.radius + 1, Math.min(CONFIG.fieldW - b.radius - 1, win.x + dir * (win.radius + b.radius + 4)));
    b.y = CONFIG.groundY - b.radius - 4;
    b.vx = dir * 4; b.vy = -5;
    // Loser gets knocked back out of the way
    if (dir * (lose.x - win.x) > 0) {
        lose.x = Math.max(lose.radius, Math.min(CONFIG.fieldW - lose.radius, b.x + dir * (lose.radius + b.radius + 24)));
        lose.vx = dir * 7;
    } else {
        lose.vx = -dir * 7;
    }
    lose.vy = -11;
    lose.angularVelocity += dir * 0.5;
    win.vx = 0;
    duel = null;
    state = 'PLAYING';
    shake = 8;
    Sound.kick(14); Sound.charged();
    emit(win.x, win.y - win.radius, 30, { color: [TEAM[w], '#ffffff', '#f1c40f'], speed: 6, life: 40, size: 4, gravity: 0.12, confetti: true });
    showBanner('POSSESSION', `${playerName(w)} wins the duel`, TEAM[w], 80, true);
}

function drawDeadlockTimer() {
    if (state !== 'PLAYING' || lockFrames < LOCK_WARN || !lockBall) return;
    const frac = Math.max(0, (LOCK_DUEL - lockFrames) / (LOCK_DUEL - LOCK_WARN));
    const sec = Math.max(1, Math.ceil((LOCK_DUEL - lockFrames) / 60));
    const x = lockBall.x, y = CONFIG.groundY - 150;
    ctx.save();
    ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(tickCount * 0.15));
    ctx.font = '900 14px Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.strokeText('DEADLOCK', x, y - 42);
    ctx.fillStyle = '#f1c40f'; ctx.fillText('DEADLOCK', x, y - 42);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Segoe UI, Roboto, sans-serif';
    ctx.fillText(String(sec), x, y + 1);
    ctx.restore();
}

function drawDuel() {
    if (state !== 'DUEL' && !(state === 'PAUSED' && prevState === 'DUEL')) return;
    if (!duel) return;
    const cx = W / 2, barW = 520, barH = 30, by = 300;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pop = duel.intro > 30 ? 0.6 + 0.4 * easeOutBack((45 - duel.intro) / 15) : 1;
    ctx.save();
    ctx.translate(cx, 175); ctx.scale(pop, pop);
    ctx.font = '900 92px Segoe UI, Roboto, sans-serif';
    ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.strokeText('DUEL!', 0, 0);
    ctx.fillStyle = '#f1c40f'; ctx.fillText('DUEL!', 0, 0);
    ctx.restore();
    ctx.font = '800 22px Segoe UI, Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(duel.intro > 0 ? 'Get ready...' : 'MASH YOUR JUMP BUTTON!', cx, 240);

    // Tug-of-war bar
    ctx.fillStyle = 'rgba(0,210,255,0.35)';
    ctx.fillRect(cx - barW / 2, by - barH / 2, barW / 2, barH);
    ctx.fillStyle = 'rgba(255,56,56,0.35)';
    ctx.fillRect(cx, by - barH / 2, barW / 2, barH);
    const mx = cx + duel.v * (barW / 2);
    ctx.fillStyle = duel.v >= 0 ? TEAM[1] : TEAM[2];
    if (duel.v >= 0) ctx.fillRect(cx, by - barH / 2, mx - cx, barH);
    else ctx.fillRect(mx, by - barH / 2, cx - mx, barH);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
    ctx.strokeRect(cx - barW / 2, by - barH / 2, barW, barH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1, by - barH / 2 - 6, 2, barH + 12);
    ctx.beginPath(); ctx.arc(mx, by, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();

    // Labels
    const cpu = isCPU();
    const two = settings.teams === 2;
    const k1 = (isTouch || net.active) ? 'JUMP' : (cpu ? 'W / ↑' : (p3Human() ? 'W / T' : 'W'));
    const k2 = (isTouch || net.active) ? 'JUMP' : (p4Human() ? '↑ / I' : '↑');
    const n1 = two ? 'BLUE' : 'P1', n2 = two ? 'RED' : 'P2';
    ctx.font = '800 18px Segoe UI, Roboto, sans-serif';
    ctx.fillStyle = TEAM[1];
    ctx.fillText(`${n1} · ${k1} · ${duel.taps[1]}`, cx - barW / 2 + 90, by + 38);
    ctx.fillStyle = TEAM[2];
    ctx.fillText(`${cpu ? 'CPU' : n2 + ' · ' + k2} · ${duel.taps[2]}`, cx + barW / 2 - 90, by + 38);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px Segoe UI, Roboto, sans-serif';
    ctx.fillText(`${(Math.max(0, duel.frames) / 60).toFixed(1)}s · winner gets the ball`, cx, by + 70);
    ctx.restore();
}

// BOTS: the plan that picks a lean, a charge or a dig by running the real physics ahead
// Which team a ball just scored for: 1 (right goal), 2 (left goal) or 0
function scoredFor(b) {
    if (b.y <= CONFIG.groundY - CONFIG.goalHeight) return 0;
    if (b.x < CONFIG.goalWidth) return 2;
    if (b.x > CONFIG.fieldW - CONFIG.goalWidth) return 1;
    return 0;
}
function simulatePlan(p, ball, lean, n, digN = -1) {
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
    let result = 0, touched = false, f = 0;
    simulating = true;
    for (; f < AI_HORIZON; f++) {
        if (digN >= 0 && f === digN && canDig(me, b)) { applyDig(b, p.playerNum === 1 ? 1 : -1, digN / DIG_MAX); touched = true; }
        if (n > 0 && f === n) me.releaseJump();
        const leanNow = f <= n ? lean : 0;
        me.input.left = leanNow < 0;
        me.input.right = leanNow > 0;
        for (const o of os) o.update();
        me.update(); b.update();
        for (const o of os) resolveCollision(o, b);
        if (resolveCollision(me, b) > 0) touched = true;
        for (const o of os) resolveCollision(o, me);
        const g = scoredFor(b);
        if (g) { result = g === p.playerNum ? 1 : -1; break; }
    }
    simulating = false;
    return { result, touched, f, ballX: b.x, meX: me.x };
}
function scorePlan(r, ball, team, support) {
    const dir = team === 1 ? 1 : -1; // attacking direction
    let s = 0;
    if (r.result === 1) s += 2000 - r.f * 5;           // we score
    else if (r.result === -1) s -= 3000 - r.f * 5;     // own goal / conceded
    s += (r.ballX - ball.x) * dir * 1.2;                // ball pushed toward their goal
    // Stay goal-side of the ball; a supporting teammate hangs further back
    const back = support ? 220 : 60;
    const want = Math.max(40, Math.min(CONFIG.fieldW - 40, r.ballX - dir * back));
    s -= Math.abs(r.meX - want) * 0.5;
    if ((r.meX - r.ballX) * dir > 10) s -= 120;
    if (r.touched) s += support ? 10 : 40;
    return s;
}

function planSoccer(bot, L) {
    const p = bot.p;
    const team = p.playerNum;
    const ownGoalX = team === 1 ? 0 : CONFIG.fieldW;
    // Focus on the most dangerous ball (close to our goal, then to us)
    let ball = balls[0], best = Infinity;
    for (const bl of balls) {
        const s = Math.hypot(bl.x - p.x, bl.y - p.y) + Math.abs(bl.x - ownGoalX) * 0.5;
        if (s < best) { best = s; ball = bl; }
    }
    // In 2v2, whoever is further from the ball plays support
    const myD = Math.hypot(ball.x - p.x, ball.y - p.y);
    const support = players.some(q => q !== p && q.playerNum === team && Math.hypot(ball.x - q.x, ball.y - q.y) < myD - 20);

    if (Math.random() < L.blunder) {
        bot.start([-1, 0, 1][(Math.random() * 3) | 0], L.charges[(Math.random() * L.charges.length) | 0]);
        return;
    }

    const noise = () => (Math.random() * 2 - 1) * L.noise;
    let bestScore = scorePlan(simulatePlan(p, ball, 0, 0), ball, team, support) + noise();
    let bestLean = 0, bestN = 0, bestDig = -1;
    if (p.digCD === 0 && canDig(p, ball)) {
        for (const dn of [1, 20, DIG_MAX]) {
            const sc = scorePlan(simulatePlan(p, ball, 0, 0, dn), ball, team, support) + noise();
            if (sc > bestScore) { bestScore = sc; bestDig = dn; }
        }
    }
    for (const lean of [-1, 0, 1]) {
        for (const n of L.charges) {
            const sc = scorePlan(simulatePlan(p, ball, lean, n), ball, team, support) + noise();
            if (sc > bestScore) { bestScore = sc; bestLean = lean; bestN = n; bestDig = -1; }
        }
    }
    if (bestDig >= 0) {
        p.__ai = true; startDigCharge(p); p.__ai = false;
        bot.digging = true; bot.frames = 0; bot.target = bestDig;
    }
    else if (bestN > 0) bot.start(bestLean, bestN);
    else bot.cooldown = Math.max(6, L.react);
}

function drawDigMeters() {
    for (const p of players) {
        if (!p.digCharging || p.digCharge < 4) continue;
        const r = p.digCharge / DIG_MAX, w = 44, x = p.x - w / 2, y = CONFIG.groundY + 12;
        const full = p.digCharge === DIG_MAX;
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(x - 2, y - 2, w + 4, 10);
        ctx.fillStyle = full && Math.floor(Date.now() / 80) % 2 ? '#ffffff' : '#e67e22';
        ctx.fillRect(x, y, w * r, 6);
        ctx.font = '800 10px Segoe UI, Roboto, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('DIG', p.x, y + 10);
    }
}


const AI_LEVELS = {
    easy:   { react: 40, noise: 500, blunder: 0.3,  charges: [1, 15, 30, 45, 60] },
    normal: { react: 16, noise: 150, blunder: 0.08, charges: [1, 5, 10, 15, 20, 26, 32, 40, 48, 56, 60] },
    hard:   { react: 3,  noise: 12,  blunder: 0,    charges: [1, 4, 8, 12, 16, 20, 25, 30, 36, 42, 48, 54, 60] }
};

function drawGoals(g, A, FW, GY) {
    const top = GY - CONFIG.goalHeight, gw = CONFIG.goalWidth;
    for (const side of ['left', 'right']) {
        const gx = side === 'left' ? 0 : FW - gw;
        g.fillStyle = 'rgba(0,0,0,0.22)';
        g.fillRect(gx, top, gw, CONFIG.goalHeight);
        g.strokeStyle = A.net; g.lineWidth = 1;
        for (let x = gx; x <= gx + gw; x += 12) { g.beginPath(); g.moveTo(x, top); g.lineTo(x, GY); g.stroke(); }
        for (let y = top; y <= GY; y += 12) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx + gw, y); g.stroke(); }
        g.strokeStyle = A.post; g.lineWidth = 6; g.lineCap = 'round';
        if (A.ground === 'neon') { g.shadowBlur = 14; g.shadowColor = A.post; }
        const fx = side === 'left' ? gw : FW - gw;
        g.beginPath(); g.moveTo(gx, top); g.lineTo(gx + gw, top); g.stroke();
        g.beginPath(); g.moveTo(fx, top); g.lineTo(fx, GY); g.stroke();
        g.shadowBlur = 0; g.lineCap = 'butt';
    }
}

Games.define({
    id: 'soccer',
    point: 'goal',
    subtitle: 'Hold jump to charge · lean to aim · release to launch',
    startLabel: 'Kick Off',
    overLabel: 'FULL TIME',
    hint: 'hold S / ↓ to charge a dig',
    storageKey: 'wobblySoccer.settings.v2',      // keep: players' saved settings and online name live here
    defaults: { target: 5, ball: 'classic', arena: 'night' },
    targets: [3, 5, 7],
    config: { goalWidth: 90, goalHeight: 180 },
    fields: [{ id: 'standard', name: 'Standard', w: 1024, spawn: 262 }, { id: 'long', name: 'Long', w: 2048, spawn: 524 }],
    modes: ['classic', 'timed', 'golden', 'multi', 'moon', 'infinite'],
    sounds: {
        dig(r = 0) { this.noise(0.14 + r * 0.1, 0.25 + r * 0.1, 500, 0.8); this.tone(260 - r * 60, 0.14 + r * 0.08, 'triangle', 0.1, 620 + r * 500); },
        digFull() { this.tone(660, 0.1, 'sine', 0.06); this.tone(880, 0.12, 'sine', 0.05, null, 0.05); }
    },
    ballSpots(n) {
        const c = CONFIG.fieldW / 2;
        return (n === 1 ? [[c, 150]] : [[c, 150], [c - 82, 80], [c + 82, 80]]).slice(0, n);
    },
    scoredFor,
    // The deadlock -> duel state
    states: ['DUEL'],
    resetRound() { lockFrames = 0; lockBall = null; lastLockSec = -1; duel = null; },
    step: updateDeadlock,
    tickState() {
        if (state !== 'DUEL') return;
        if (duel.intro > 0) { duel.intro--; return; }
        duel.frames--;
        if (isCPU()) {
            duel.cpuAcc += (DUEL_CPU_RATE[settings.opponent] || 7) / 60 * (0.6 + Math.random() * 0.8);
            while (state === 'DUEL' && duel.cpuAcc >= 1) { duel.cpuAcc--; duelTap(2); }
        }
        if (state === 'DUEL' && duel.frames <= 0) {
            endDuel(duel.v > 0 ? 1 : duel.v < 0 ? 2 : (Math.random() < 0.5 ? 1 : 2));
        }
    },
    // In a duel the jump button mashes instead of jumping
    onJumpPress(p, repeat) {
        if (state !== 'DUEL') return false;
        if (p && !repeat) duelTap(p.playerNum);
        return true;
    },
    // The second button: hold to charge a dig, release to scoop the ball up
    action: {
        name: 'dig',
        reset(p) { p.digCD = 0; p.digAnim = 0; p.digCharging = false; p.digCharge = 0; },
        cancel(p) { p.digCharging = false; p.digCharge = 0; },
        down: startDigCharge,
        up: releaseDig,
        step(p) {
            if (p.digCD > 0) p.digCD--;
            if (p.digAnim > 0) p.digAnim--;
            if (p.digCharging && p.digCharge < DIG_MAX && p.y + p.radius >= CONFIG.groundY - 2) {
                p.digCharge++;
                if (p.digCharge === DIG_MAX && !p.isBot) Sound.digFull();
                if (tickCount % 5 === 0) emit(p.x + (Math.random() - 0.5) * 30, CONFIG.groundY - 1, 1, { color: groundDustColor(), speed: 1.4, angle: -Math.PI / 2, spread: 1, life: 18, size: 2.2, gravity: 0.1 });
            }
        },
        squash: (p) => Math.max((p.digAnim || 0) / 12, (p.digCharge || 0) / DIG_MAX * 0.7),
        snap: (p) => [p.digCharge, p.digCharging ? 1 : 0, p.digAnim],
        apply(p, A, i) { p.digCharge = A[i] | 0; p.digCharging = !!A[i + 1]; p.digAnim = A[i + 2] | 0; }
    },
    // Online: what the host adds to its snapshots, and how a guest restores it
    snap: () => ({
        lk: lockFrames, lb: lockBall ? balls.indexOf(lockBall) : -1,
        du: duel ? [r2(duel.v), duel.frames, duel.intro, duel.taps[1], duel.taps[2]] : null
    }),
    applySnap(s) {
        lockFrames = s.lk | 0;
        lockBall = s.lb >= 0 ? (balls[s.lb] || null) : null;
        duel = Array.isArray(s.du) ? { v: +s.du[0] || 0, frames: s.du[1] | 0, intro: s.du[2] | 0, taps: { 1: s.du[3] | 0, 2: s.du[4] | 0 } } : null;
    },
    ai: {
        levels: AI_LEVELS,
        state: { digging: false },
        busy(bot, L) {   // a dig is charging: wait for the planned frames, then release
            if (!bot.digging) return false;
            const p = bot.p;
            p.input.left = p.input.right = false;
            if (!p.digCharging) { bot.digging = false; return true; }
            if (++bot.frames >= bot.target) {
                releaseDig(p);
                bot.digging = false;
                bot.cooldown = Math.max(6, L.react);
            }
            return true;
        },
        plan: planSoccer
    },
    draw: {
        field: drawGoals,
        world() { drawDigMeters(); drawDeadlockTimer(); },
        screen: drawDuel,
        thumb(g, A, gy) { g.strokeStyle = A.post; g.lineWidth = 3; g.beginPath(); g.moveTo(8, gy); g.lineTo(8, gy - 26); g.lineTo(22, gy - 26); g.stroke(); }
    }
});
})();
