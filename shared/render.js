// Shared engine, part 2: drawing (arena, players, balls, effects), menus, cosmetic browser and screen scaling.
'use strict';

// =====================================================================
//  RENDERING
// =====================================================================
function mulberry32(a) {
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

let renderScale = 1, bgScale = 1;
const bgCanvas = document.createElement('canvas');

// ---------- Camera (long field) ----------
let camX = 0;
function updateCamera(snap) {
    const FW = CONFIG.fieldW;
    if (FW <= W) { camX = 0; return; }
    let bx = 0;
    for (const b of balls) bx += b.x;
    bx /= balls.length;
    // Always centered on the ball (average of balls in Multi-Ball)
    const tx = Math.max(0, Math.min(FW - W, bx - W / 2));
    camX = snap ? tx : camX + (tx - camX) * 0.15;
    camX = Math.max(tx - 160, Math.min(tx + 160, camX)); // never let the ball drift far from center
}

function buildBackground() {
    const A = curArena();
    const FW = CONFIG.fieldW;
    bgScale = Math.min(renderScale, FW > W ? 2 : 3);
    bgCanvas.width = Math.round(FW * bgScale);
    bgCanvas.height = Math.round(H * bgScale);
    const g = bgCanvas.getContext('2d');
    g.setTransform(bgScale, 0, 0, bgScale, 0, 0);
    const MID = FW / 2;
    const rnd = mulberry32(1234 + A.index * 77);
    const GY = CONFIG.groundY;

    const sky = g.createLinearGradient(0, 0, 0, GY);
    A.sky.forEach((c, i, a) => sky.addColorStop(i / (a.length - 1), c));
    g.fillStyle = sky;
    g.fillRect(0, 0, FW, GY);

    if (A.id === 'night') {
        for (let i = 0; i < 70 * FW / 1024; i++) {
            g.fillStyle = `rgba(255,255,255,${0.1 + rnd() * 0.35})`;
            g.fillRect(rnd() * FW, rnd() * 260, 1.5, 1.5);
        }
        for (let lx = 150; lx < FW; lx += 724) {
            const gl = g.createRadialGradient(lx, 68, 5, lx, 68, 280);
            gl.addColorStop(0, 'rgba(255,255,230,0.32)');
            gl.addColorStop(1, 'rgba(255,255,230,0)');
            g.fillStyle = gl; g.fillRect(lx - 280, 0, 560, 380);
            g.fillStyle = '#2f3640'; g.fillRect(lx - 3, 78, 6, 260);
            g.fillStyle = '#fffbe6'; g.fillRect(lx - 28, 56, 56, 20);
        }
        g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(0, 330, FW, GY - 330);
        for (let y = 342; y < GY - 6; y += 13) {
            for (let x = 6; x < FW; x += 11) {
                if (rnd() < 0.75) {
                    g.fillStyle = `rgba(${rnd() < 0.5 ? '0,210,255' : '255,56,56'},${0.08 + rnd() * 0.12})`;
                    g.beginPath(); g.arc(x + rnd() * 4, y + rnd() * 3, 3.2, 0, Math.PI * 2); g.fill();
                }
            }
        }
    } else if (A.id === 'sunset') {
        const sun = g.createRadialGradient(MID, 360, 10, MID, 360, 140);
        sun.addColorStop(0, 'rgba(255,240,200,1)');
        sun.addColorStop(0.5, 'rgba(255,190,110,0.9)');
        sun.addColorStop(1, 'rgba(255,150,90,0)');
        g.fillStyle = sun; g.fillRect(MID - 140, 220, 280, 280);
        const hill = (color, base, amp, seed) => {
            g.fillStyle = color; g.beginPath(); g.moveTo(0, GY);
            for (let x = 0; x <= FW; x += 16) g.lineTo(x, base - Math.sin(x * 0.006 + seed) * amp - Math.sin(x * 0.017 + seed * 2) * amp * 0.4);
            g.lineTo(FW, GY); g.closePath(); g.fill();
        };
        hill('#7a3460', 400, 30, 1);
        hill('#4b2148', 435, 22, 4);
        g.fillStyle = 'rgba(40,10,40,0.6)';
        for (let i = 0; i < 5; i++) {
            const bx = 120 + rnd() * 780, by = 90 + rnd() * 120;
            g.beginPath(); g.moveTo(bx - 8, by); g.quadraticCurveTo(bx - 4, by - 5, bx, by); g.quadraticCurveTo(bx + 4, by - 5, bx + 8, by);
            g.lineWidth = 2; g.strokeStyle = 'rgba(40,10,40,0.6)'; g.stroke();
        }
    } else if (A.id === 'neon') {
        for (let i = 0; i < 90 * FW / 1024; i++) {
            g.fillStyle = `rgba(255,255,255,${0.1 + rnd() * 0.5})`;
            g.fillRect(rnd() * FW, rnd() * 300, 1.5, 1.5);
        }
        const sg = g.createLinearGradient(0, 200, 0, 440);
        sg.addColorStop(0, '#ffd319'); sg.addColorStop(0.5, '#ff2975'); sg.addColorStop(1, '#8c1eff');
        g.save(); g.beginPath(); g.arc(MID, 330, 120, 0, Math.PI * 2); g.clip();
        g.fillStyle = sg; g.fillRect(MID - 120, 200, 240, 260);
        g.fillStyle = A.sky[2];
        for (let i = 0; i < 7; i++) g.fillRect(MID - 120, 340 + i * 14, 240, 3 + i * 1.2);
        g.restore();
        g.strokeStyle = 'rgba(0,240,255,0.55)'; g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(0, GY);
        for (let x = 0; x <= FW; x += 64) g.lineTo(x, GY - 30 - rnd() * 90 * (Math.abs(x - MID) > 160 ? 1 : 0.15));
        g.lineTo(FW, GY); g.stroke();
    } else if (A.id === 'beach') {
        g.fillStyle = '#fff6c9'; g.beginPath(); g.arc(FW - 164, 90, 46, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.85)';
        for (let i = 0; i < 6 * FW / 1024; i++) {
            const cx = rnd() * FW, cy = 60 + rnd() * 150;
            for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(cx + k * 22, cy + (k % 2) * 6, 30, 16, 0, 0, Math.PI * 2); g.fill(); }
        }
        const sea = g.createLinearGradient(0, 390, 0, GY);
        sea.addColorStop(0, '#1e88e5'); sea.addColorStop(1, '#26c6da');
        g.fillStyle = sea; g.fillRect(0, 390, FW, GY - 390);
        g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
        for (let y = 402; y < GY; y += 16) {
            g.beginPath();
            for (let x = 0; x <= FW; x += 8) g.lineTo(x, y + Math.sin(x * 0.04 + y) * 2);
            g.stroke();
        }
    }

    // Ground
    if (A.ground === 'grass') {
        for (let x = 0, i = 0; x < FW; x += 64, i++) {
            g.fillStyle = A.grass[i % 2];
            g.fillRect(x, GY, 64, H - GY);
        }
    } else if (A.ground === 'neon') {
        g.fillStyle = '#12001f'; g.fillRect(0, GY, FW, H - GY);
        g.strokeStyle = 'rgba(255,43,214,0.55)'; g.lineWidth = 1.5;
        for (let k = 1; k < 9; k++) {
            const y = GY + k * k * 1.4;
            g.beginPath(); g.moveTo(0, y); g.lineTo(FW, y); g.stroke();
        }
        for (let x = -1200; x <= FW + 1200; x += 80) {
            g.beginPath(); g.moveTo(MID + (x - MID) * 0.25, GY); g.lineTo(x, H); g.stroke();
        }
    } else {
        g.fillStyle = '#f2d49b'; g.fillRect(0, GY, FW, H - GY);
        for (let i = 0; i < 400 * FW / 1024; i++) {
            g.fillStyle = rnd() < 0.5 ? 'rgba(160,120,60,0.25)' : 'rgba(255,255,255,0.35)';
            g.fillRect(rnd() * FW, GY + rnd() * (H - GY), 2, 2);
        }
    }
    const shade = g.createLinearGradient(0, GY, 0, H);
    shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,0,0,0.3)');
    g.fillStyle = shade; g.fillRect(0, GY, FW, H - GY);

    g.strokeStyle = A.line; g.lineWidth = 4;
    if (A.ground === 'neon') { g.shadowBlur = 12; g.shadowColor = A.line; }
    g.beginPath(); g.moveTo(0, GY); g.lineTo(FW, GY); g.stroke();
    g.shadowBlur = 0;
    g.fillStyle = A.line; g.fillRect(MID - 2, GY, 4, 14);

    G.draw.field(g, A, FW, GY);   // the game's goals / net / court lines
}

// ---------- Player drawing ----------
// Every cosmetic layer is drawn by the registry (shared/cosmetics/registry.js), which caches static items as sprites.
const cosCtx = { r: 32, t: 0, look: 1, team: '', teamNum: 1, hat: null, zoom: 1 };
function drawPlayer(g, p, skinId, hatId, bootId, accId, lookAt, t) {
    const r = p.radius;
    const skin = Cosmetics.get('skin', skinId);
    const hat = Cosmetics.get('hat', hatId);
    const c = cosCtx;
    g.save();
    g.translate(p.x, p.y);
    c.r = r; c.t = t; c.look = p.playerNum === 1 ? 1 : -1; c.team = TEAM[p.playerNum]; c.teamNum = p.playerNum; c.hat = hat;
    c.zoom = Cosmetics.zoomOf(g);
    g.rotate(p.angle);

    // Squash & stretch with charge (unchanged)
    const chargeRatio = p.chargeAmount / p.maxCharge;
    const digK = ACT.squash?.(p) || 0;   // the game's action squashes the body
    g.scale(1.0 + chargeRatio * 0.15 + digK * 0.12, 1.0 - chargeRatio * 0.35 - digK * 0.22);

    if (p.chargeAmount === p.maxCharge && Math.floor(Date.now() / 50) % 2 === 0) {
        g.shadowBlur = 20;
        g.shadowColor = '#f1c40f';
    }
    Cosmetics.draw('skin', 'body', g, skin, c);
    g.shadowBlur = 0;
    Cosmetics.draw('skin', 'extras', g, skin, c);
    Cosmetics.draw('boots', 'main', g, Cosmetics.get('boots', bootId), c);
    Cosmetics.draw('hat', 'main', g, hat, c);

    // Eyes (pupils follow the ball)
    const look = c.look;
    const ex = r * 0.4 * look, ey = -r * 0.4;
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(ex, ey, 8, 0, Math.PI * 2); g.fill();
    let px = r * 0.45 * look, py = ey;
    if (lookAt) {
        const a = Math.atan2(lookAt.y - p.y, lookAt.x - p.x) - p.angle;
        px = ex + Math.cos(a) * 3.5;
        py = ey + Math.sin(a) * 3.5;
    }
    g.fillStyle = '#000000';
    g.beginPath(); g.arc(px, py, 4, 0, Math.PI * 2); g.fill();

    Cosmetics.draw('acc', 'main', g, Cosmetics.get('acc', accId), c);

    // Charge meter arc above head (unchanged look, lifted above hats)
    if (p.chargeAmount > 5) {
        const lift = Cosmetics.hatLift(hat, r);
        g.strokeStyle = 'rgba(0,0,0,0.35)';
        g.lineWidth = 6;
        g.beginPath(); g.arc(0, -r * 1.5 - lift, 15, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = '#f1c40f';
        g.lineWidth = 4;
        g.beginPath();
        g.arc(0, -r * 1.5 - lift, 15, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * chargeRatio));
        g.stroke();
    }
    g.restore();
}

// ---------- Ball drawing ----------
const ballCtx = { r: 18, t: 0, look: 1, team: '', teamNum: 0, hat: null, zoom: 1 };
function drawBall(g, b, ballId, t = 0) {
    g.save();
    g.translate(b.x, b.y);
    ballCtx.r = b.radius; ballCtx.t = t; ballCtx.zoom = Cosmetics.zoomOf(g);
    g.rotate(b.spin);
    Cosmetics.draw('ball', 'main', g, Cosmetics.get('ball', ballId), ballCtx);
    g.restore();
}

function drawShadows() {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    for (const a of [...players, ...balls]) {
        const h = CONFIG.groundY - (a.y + a.radius);
        const alpha = Math.max(0, 0.32 - h / 900);
        if (alpha <= 0) continue;
        const w = a.radius * Math.max(0.35, 1 - h / 500);
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.ellipse(a.x, CONFIG.groundY + 3, w, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawTrails() {
    const col = curBall().trail || '255,255,255';
    for (const b of balls) {
        if (Math.hypot(b.vx, b.vy) < 5 || b.trail.length < 2) continue;
        for (let i = 0; i < b.trail.length - 1; i++) {
            const k = i / b.trail.length;
            ctx.fillStyle = `rgba(${col},${k * 0.35})`;
            ctx.beginPath(); ctx.arc(b.trail[i].x, b.trail[i].y, b.radius * (0.4 + k * 0.5), 0, Math.PI * 2); ctx.fill();
        }
    }
}

function drawParticles() {
    for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        if (p.confetti) {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
            ctx.restore();
        } else {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.globalAlpha = 1;
}

function drawMarkers() {
    for (const p of players) {
        const lift = Cosmetics.hatLift(Cosmetics.get('hat', hatOf(p)), p.radius);
        const y = Math.max(14, p.y - p.radius * 2.25 - lift);
        ctx.fillStyle = TEAM[p.playerNum];
        ctx.beginPath(); ctx.moveTo(p.x - 7, y - 8); ctx.lineTo(p.x + 7, y - 8); ctx.lineTo(p.x, y); ctx.closePath(); ctx.fill();
        if (state === 'COUNTDOWN' || settings.teams === 2 || net.active) {
            ctx.font = '800 13px Segoe UI, Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(actorLabel(p), p.x, y - 13);
        }
    }
}

function drawOffscreen() {
    for (const a of [...balls, ...players]) {
        if (a.y + a.radius >= 0) continue;
        const x = Math.max(camX + 16, Math.min(camX + W - 16, a.x));
        ctx.fillStyle = a.isPlayer ? TEAM[a.playerNum] : '#ffffff';
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(x, 6); ctx.lineTo(x - 9, 20); ctx.lineTo(x + 9, 20); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function drawSideArrows() {
    if (CONFIG.fieldW <= W) return;
    for (const a of [...players, ...balls]) {
        const sx = a.x - camX;
        if (sx > -a.radius && sx < W + a.radius) continue;
        const left = sx < 0;
        const x = left ? 10 : W - 10;
        const y = Math.max(40, Math.min(CONFIG.groundY - 10, a.y));
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = a.isPlayer ? TEAM[a.playerNum] : '#ffffff';
        ctx.beginPath();
        if (left) { ctx.moveTo(x, y); ctx.lineTo(x + 14, y - 9); ctx.lineTo(x + 14, y + 9); }
        else { ctx.moveTo(x, y); ctx.lineTo(x - 14, y - 9); ctx.lineTo(x - 14, y + 9); }
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function drawMinimap() {
    const FW = CONFIG.fieldW;
    if (FW <= W) return;
    const mx = 18, my = 18, mw = 240, mh = 40, k = mw / FW;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.strokeRect(mx + camX * k, my + 1, W * k, mh - 2);
    const gy = my + mh - 6;
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(mx, gy, mw, 1);
    ctx.fillStyle = TEAM[1]; ctx.fillRect(mx, gy - 12, 3, 12);
    ctx.fillStyle = TEAM[2]; ctx.fillRect(mx + mw - 3, gy - 12, 3, 12);
    const yOf = (a) => my + 4 + Math.max(0, Math.min(1, a.y / CONFIG.groundY)) * (mh - 12);
    for (const p of players) {
        ctx.fillStyle = TEAM[p.playerNum];
        ctx.beginPath(); ctx.arc(mx + p.x * k, yOf(p), p.isBot ? 2.5 : 3.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    for (const b of balls) { ctx.beginPath(); ctx.arc(mx + b.x * k, yOf(b), 2.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
}

function easeOutBack(x) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

function drawBanner() {
    if (!banner) return;
    const p = banner.t / banner.dur;
    const pop = banner.t < 12 ? 0.5 + 0.5 * easeOutBack(banner.t / 12) : 1;
    const alpha = p > 0.75 ? Math.max(0, (1 - p) / 0.25) : 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2, H / 2 - 50);
    ctx.scale(pop, pop);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${banner.small ? 64 : 104}px Segoe UI, Roboto, sans-serif`;
    ctx.lineWidth = 12; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeText(banner.text, 0, 0);
    ctx.fillStyle = banner.color;
    ctx.fillText(banner.text, 0, 0);
    if (banner.sub) {
        ctx.font = '800 28px Segoe UI, Roboto, sans-serif';
        ctx.lineWidth = 7;
        ctx.strokeText(banner.sub, 0, 72);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(banner.sub, 0, 72);
    }
    ctx.restore();
}

function nearestBall(p) {
    let best = balls[0], d = Infinity;
    for (const b of balls) { const dd = Math.hypot(b.x - p.x, b.y - p.y); if (dd < d) { d = dd; best = b; } }
    return best;
}

function render(t) {
    ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (shake > 0.3 && state !== 'PAUSED') ctx.translate((Math.random() - 0.5) * shake * 2, (Math.random() - 0.5) * shake * 2);
    const cam = state === 'MENU' ? Math.max(0, (CONFIG.fieldW - W) / 2) : camX;
    ctx.drawImage(bgCanvas, cam * bgScale, 0, W * bgScale, H * bgScale, 0, 0, W, H);
    if (state !== 'MENU') {
        ctx.save();
        ctx.translate(-camX, 0);
        drawShadows();
        drawTrails();
        for (const p of players) {
            const n = p.playerNum;
            drawPlayer(ctx, p, skinOf(p), hatOf(p), bootsOf(p), accOf(p), nearestBall(p), t);
        }
        for (const b of balls) drawBall(ctx, b, settings.ball, t);
        drawMarkers();
        G.draw.world?.();   // the game's overlays in the world
        drawParticles();
        drawOffscreen();
        ctx.restore();
        drawSideArrows();
    }
    ctx.restore();
    if (state !== 'MENU') drawMinimap();
    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash})`; ctx.fillRect(0, 0, W, H); }
    if (state !== 'MENU') { G.draw.screen?.(); drawBanner(); }
}

// ---------- Menu previews ----------
const previewCtx = { 1: $('p1-preview').getContext('2d'), 2: $('p2-preview').getContext('2d') };
const ballPrevCtx = $('ball-preview').getContext('2d');
const prevActors = {
    1: { x: 80, y: 102, radius: 32, angle: 0, chargeAmount: 0, maxCharge: 60, playerNum: 1 },
    2: { x: 80, y: 102, radius: 32, angle: 0, chargeAmount: 0, maxCharge: 60, playerNum: 2 }
};
const prevBall = { x: 15, y: 15, radius: 12, spin: 0 };

function drawPreviews(t) {
    for (const n of [1, 2]) {
        const g = previewCtx[n];
        const P = prevActors[n];
        g.setTransform(2, 0, 0, 2, 0, 0);
        g.clearRect(0, 0, 160, 160);
        P.angle = Math.sin(t * 0.003 + n) * 0.12;
        const ph = (t / 1000 + n * 0.7) % 3;
        P.chargeAmount = 0; // no charge arc in the menu preview (it read like a halo)
        g.fillStyle = 'rgba(0,0,0,0.3)';
        g.beginPath(); g.ellipse(80, 102 + 32 * 1.7 + 2, 30, 4, 0, 0, Math.PI * 2); g.fill();
        drawPlayer(g, P, n === 1 ? settings.p1Skin : settings.p2Skin, n === 1 ? settings.p1Hat : settings.p2Hat, n === 1 ? settings.p1Boots : settings.p2Boots, n === 1 ? settings.p1Acc : settings.p2Acc, null, t);
    }
    ballPrevCtx.setTransform(2, 0, 0, 2, 0, 0);
    ballPrevCtx.clearRect(0, 0, 30, 30);
    prevBall.spin = t * 0.003;
    drawBall(ballPrevCtx, prevBall, settings.ball);
}

// =====================================================================
//  MENU UI
// =====================================================================
function buildChips(el, items, isActive, onPick) {
    el.innerHTML = '';
    for (const it of items) {
        const b = document.createElement('button');
        b.className = 'chip' + (isActive(it) ? ' active' : '');
        b.textContent = it.name;
        b.addEventListener('click', () => {
            Sound.init(); Sound.click();
            onPick(it);
            refreshMenu();
            b.blur();
        });
        el.appendChild(b);
    }
}

function refreshMenu() {
    const m = mode();
    buildChips($('mode-chips'), MODE_ORDER.map(id => ({ id, name: MODES[id].name })), it => it.id === settings.mode, it => { settings.mode = it.id; });
    $('mode-desc').textContent = m.desc;
    $('length-setting').style.visibility = (m.kind === 'none' || m.kind === 'endless') ? 'hidden' : 'visible';
    if (m.kind === 'time') {
        $('length-label').textContent = 'Match time';
        buildChips($('length-chips'), TIMES.map(s => ({ id: s, name: fmtClock(s) })), it => it.id === settings.time, it => { settings.time = it.id; });
    } else {
        $('length-label').textContent = 'First to';
        buildChips($('length-chips'), TARGETS.map(n => ({ id: n, name: `${n} ${G.point}s` })), it => it.id === settings.target, it => { settings.target = it.id; });
    }
    buildChips($('opp-chips'), OPPONENTS, it => it.id === settings.opponent, it => { settings.opponent = it.id; });
    if (FIELDS.length > 1) buildChips($('field-chips'), FIELDS, it => it.id === settings.field, it => { settings.field = it.id; applyFieldSetting(); });
    buildChips($('teams-chips'), TEAM_SIZES, it => it.id === teamSizeId(), it => { settings.teams = it.teams; settings.mates = it.mates; });

    document.querySelectorAll('.picker').forEach(pk => {
        const key = pk.dataset.target;
        pk.querySelector('.pick-label').textContent = Cosmetics.get(COS_KEYS[key], settings[key]).name;
    });

    const cpu = isCPU();
    const lvl = `${settings.opponent[0].toUpperCase()}${settings.opponent.slice(1)}`;
    const two = settings.teams === 2;
    const h3 = p3Human(), h4 = p4Human();
    $('p1-title').textContent = two ? (h3 ? 'Players 1 + 3' : 'Player 1 + Bot') : 'Player 1';
    $('p2-title').textContent = cpu ? (two ? `CPU Team · ${lvl}` : `CPU · ${lvl}`) : (two ? (h4 ? 'Players 2 + 4' : 'Player 2 + Bot') : 'Player 2');
    const row = (who, j, l, r, d) => `${who ? who + ': ' : ''}<b>${j}</b> jump · <b>${l}</b> <b>${r}</b> lean · <b>${d}</b> ${ACT.name}`;
    if (h3 && cpu) {
        $('p1-keys').innerHTML = row('P1', 'W', 'A', 'D', 'S') + '<br>' + row('P3', '↑', '←', '→', '↓');
    } else if (h3) {
        $('p1-keys').innerHTML = row('P1', 'W', 'A', 'D', 'S') + '<br>' + row('P3', 'T', 'F', 'H', 'G');
    } else {
        $('p1-keys').innerHTML = cpu
            ? `Hold &amp; release <b>W</b> or <b>↑</b> to jump<br><b>A</b> <b>D</b> or <b>←</b> <b>→</b> lean · <b>S</b> or <b>↓</b> ${ACT.name}`
            : `Hold &amp; release <b>W</b> to jump<br><b>A</b> <b>D</b> lean · <b>S</b> ${ACT.name}`;
    }
    if (cpu) {
        $('p2-keys').innerHTML = 'Computer controlled<br>Pick a look for your rival';
    } else if (h4) {
        $('p2-keys').innerHTML = row('P2', '↑', '←', '→', '↓') + '<br>' + row('P4', 'I', 'J', 'L', 'K');
    } else {
        $('p2-keys').innerHTML = `Hold &amp; release <b>↑</b> to jump<br><b>←</b> <b>→</b> lean · <b>↓</b> ${ACT.name}`;
    }
    muteBtn.textContent = settings.muted ? '🔇' : '🔊';
    saveSettings();
}

document.querySelectorAll('.picker').forEach(pk => {
    const key = pk.dataset.target;
    pk.querySelectorAll('.arrow').forEach(a => {
        a.addEventListener('click', () => {
            Sound.init(); Sound.click();
            settings[key] = Cosmetics.step(COS_KEYS[key], settings[key], Number(a.dataset.dir));
            if (key === 'arena') buildBackground();
            refreshMenu();
            a.blur();
        });
    });
});

// ---------- Cosmetic browser ----------
// A searchable grid of every item in a category. Thumbnails are drawn only when they scroll into view.
const cosScreen = $('cos-screen'), cosGrid = $('cos-grid'), cosSearch = $('cos-search');
const COS_TITLES = { skin: 'Skins', hat: 'Hats', boots: 'Boots', acc: 'Accessories', ball: 'Balls', arena: 'Arenas' };
const THUMB = 80;
let cosKey = '', cosObserver = null, cosSearchTimer = 0;
const cosOpen = () => !cosScreen.classList.contains('hidden');
function cosThumb(cv, cat, id, n) {
    const g = cv.getContext('2d');
    g.setTransform(2, 0, 0, 2, 0, 0);
    g.clearRect(0, 0, THUMB, THUMB);
    if (cat === 'ball') { drawBall(g, { x: THUMB / 2, y: THUMB / 2, radius: 24, spin: 0 }, id, 0); return; }
    if (cat === 'arena') {
        const A = Cosmetics.get('arena', id), gy = THUMB * 0.68;
        const sky = g.createLinearGradient(0, 0, 0, gy);
        A.sky.forEach((col, i) => sky.addColorStop(A.sky.length === 1 ? 0 : i / (A.sky.length - 1), col));
        g.fillStyle = sky; g.fillRect(0, 0, THUMB, gy);
        g.fillStyle = A.ground === 'grass' ? A.grass[0] : A.ground === 'sand' ? '#f2d49b' : '#120428';
        g.fillRect(0, gy, THUMB, THUMB - gy);
        if (A.ground === 'grass') { g.fillStyle = A.grass[1]; for (let x = 0; x < THUMB; x += 20) g.fillRect(x, gy, 10, THUMB - gy); }
        g.strokeStyle = A.line; g.lineWidth = 2; g.beginPath(); g.moveTo(0, gy); g.lineTo(THUMB, gy); g.stroke();
        G.draw.thumb?.(g, A, gy);   // a corner of the game's goal / net
        return;
    }
    const k = n === 2 ? 'p2' : 'p1';
    const wear = (c, key) => cat === c ? id : settings[k + key];
    const r = 17, y = cat === 'hat' ? 47 : cat === 'boots' ? 32 : 40;
    const actor = { x: THUMB / 2, y, radius: r, angle: 0, chargeAmount: 0, maxCharge: 60, playerNum: n };
    g.fillStyle = 'rgba(0,0,0,0.3)';
    g.beginPath(); g.ellipse(THUMB / 2, y + r * 1.75 + 2, r * 0.95, 3, 0, 0, Math.PI * 2); g.fill();
    drawPlayer(g, actor, wear('skin', 'Skin'), wear('hat', 'Hat'), wear('boots', 'Boots'), wear('acc', 'Acc'), null, 0);
}
function renderCosGrid() {
    const cat = COS_KEYS[cosKey], n = cosKey.startsWith('p2') ? 2 : 1;
    const items = Cosmetics.search(cat, cosSearch.value);
    $('cos-count').textContent = `${items.length} of ${Cosmetics.list(cat).length}`;
    if (cosObserver) cosObserver.disconnect();
    cosObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (!e.isIntersecting) continue;
            cosObserver.unobserve(e.target);
            cosThumb(e.target, cat, e.target.dataset.id, n);
        }
    }, { root: cosGrid, rootMargin: '120px' }) : null;
    const frag = document.createDocumentFragment();
    for (const it of items) {
        const b = document.createElement('button');
        b.className = `cos-item r-${it.rarity}` + (it.id === settings[cosKey] ? ' active' : '');
        b.title = `${it.name} · ${it.rarity}${it.tags.length ? ' · ' + it.tags.join(', ') : ''}`;
        const cv = document.createElement('canvas');
        cv.width = cv.height = THUMB * 2;
        cv.dataset.id = it.id;
        const label = document.createElement('span');
        label.textContent = it.name;
        b.append(cv, label);
        b.addEventListener('click', () => cosPick(it.id));
        frag.appendChild(b);
        if (cosObserver) cosObserver.observe(cv); else cosThumb(cv, cat, it.id, n);
    }
    cosGrid.innerHTML = '';
    if (!items.length) cosGrid.innerHTML = '<div class="cos-empty">Nothing matches that search.</div>';
    cosGrid.appendChild(frag);
}
function cosShow(key) {
    cosKey = key;
    const cat = COS_KEYS[key];
    $('cos-title').textContent = (key.startsWith('p1') ? 'Player 1 · ' : key.startsWith('p2') ? 'Player 2 · ' : '') + COS_TITLES[cat];
    cosSearch.value = '';
    renderCosGrid();
    cosScreen.classList.remove('hidden');
    const active = cosGrid.querySelector('.cos-item.active');
    if (active) active.scrollIntoView({ block: 'center' });
    if (!matchMedia('(pointer: coarse)').matches) cosSearch.focus();
}
function cosHide() {
    cosScreen.classList.add('hidden');
    if (cosObserver) cosObserver.disconnect();
    cosGrid.innerHTML = '';
    cosSearch.blur();
}
function cosPick(id) {
    Sound.init(); Sound.click();
    settings[cosKey] = id;
    if (cosKey === 'arena') buildBackground();
    cosHide();
    refreshMenu();
}
document.querySelectorAll('.picker').forEach(pk => {
    pk.querySelector('.pick-label').addEventListener('click', () => { Sound.init(); Sound.click(); cosShow(pk.dataset.target); });
});
$('cos-close').addEventListener('click', cosHide);
cosSearch.addEventListener('input', () => { clearTimeout(cosSearchTimer); cosSearchTimer = setTimeout(renderCosGrid, 80); });
cosSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); cosHide(); }
    else if (e.key === 'Enter') { const first = cosGrid.querySelector('.cos-item'); if (first) first.click(); }
});

$('start-btn').addEventListener('click', startMatch);
$('rematch-btn').addEventListener('click', () => { if (net.active) netHostStart(false); else startMatch(); });
$('menu-btn').addEventListener('click', () => {
    if (!net.active) goMenu();
    else if (net.isHost) netHostToLobby();
    else netLeave('You left the room.');
});
$('resume-btn').addEventListener('click', togglePause);
$('restart-btn').addEventListener('click', startMatch);
$('pause-menu-btn').addEventListener('click', () => { if (net.active) netLeave(net.isHost ? 'Room closed.' : 'You left the room.'); else goMenu(); });
$('pause-btn').addEventListener('click', (e) => { togglePause(); e.currentTarget.blur(); });
muteBtn.addEventListener('click', (e) => { Sound.init(); toggleMute(); e.currentTarget.blur(); });

// =====================================================================
//  SCALING (fit any screen, crisp on high-DPI)
// =====================================================================
function fit() {
    const s = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.98;
    container.style.transform = `scale(${s})`;
    const k = Math.min(3, Math.max(1, s * (window.devicePixelRatio || 1)));
    if (Math.abs(k - renderScale) > 0.01 || canvas.width !== Math.round(W * k)) {
        renderScale = k;
        canvas.width = Math.round(W * k);
        canvas.height = Math.round(H * k);
        buildBackground();
    }
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

