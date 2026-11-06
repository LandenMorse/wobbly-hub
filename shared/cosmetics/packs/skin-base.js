// Base skins (the originals). Order here is the picker order, and the first
// eighteen are frozen in the legacy index table in wobbly-soccer.html.
Cosmetics.define({ pack: 'skin-base', category: 'skin', author: 'core' }, (u) => {
    const srand = u.rng(42);
    const STARS = Array.from({ length: 18 }, () => ({ x: srand() * 2 - 1, y: srand() * 3 - 1.3, s: 0.6 + srand() * 1.3, ph: srand() * 6.28 }));
    const CRACKS = [
        [[-0.85, -0.7], [-0.45, -0.15], [-0.6, 0.35], [-0.25, 0.9]],
        [[0.75, -0.95], [0.4, -0.2], [0.65, 0.45], [0.35, 1.1]],
        [[-0.15, 1.05], [0.15, 1.35], [-0.05, 1.7]]
    ];
    return [
        { id: 'classic', name: 'Classic' },   // no fill: the team colour
        {
            id: 'gold', name: 'Golden', rarity: 'epic', anim: true,
            fill: (g, c) => u.linear(g, -c.r, -c.r * 1.3, c.r, c.r * 1.7, [[0, '#fff7c2'], [0.45, '#f1c40f'], [1, '#a67c00']]),
            draw(g, c) {
                const r = c.r, x = ((c.t * 0.12) % (r * 5)) - r * 2.5;
                u.poly(g, [[x, -r * 1.5], [x + 14, -r * 1.5], [x - r * 0.8 + 14, r * 1.8], [x - r * 0.8, r * 1.8]], 'rgba(255,255,255,0.35)');
            }
        },
        {
            id: 'galaxy', name: 'Galaxy', rarity: 'rare', anim: true,
            fill: (g, c) => u.radial(g, -c.r * 0.3, -c.r * 0.4, 2, 0, 0, c.r * 1.8, [[0, '#a29bfe'], [0.4, '#5f27cd'], [1, '#130828']]),
            draw(g, c) {
                for (const s of STARS) {
                    g.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(c.t * 0.003 + s.ph));
                    u.circle(g, s.x * c.r, s.y * c.r, s.s, '#fff');
                }
            }
        },
        {
            id: 'tiger', name: 'Tiger', fill: '#f39c12', pattern: ['belly', '#fdf2e9'],
            draw(g, c) {
                const r = c.r;
                g.strokeStyle = '#1e1e1e'; g.lineWidth = 5; g.lineCap = 'round';
                for (let y = -r * 1.1; y < r * 1.6; y += r * 0.42) {
                    g.beginPath(); g.moveTo(-r * 1.05, y); g.quadraticCurveTo(-r * 0.7, y + 4, -r * 0.45, y + 10); g.stroke();
                    g.beginPath(); g.moveTo(r * 1.05, y); g.quadraticCurveTo(r * 0.7, y + 4, r * 0.45, y + 10); g.stroke();
                }
            }
        },
        {
            id: 'ninja', name: 'Ninja', fill: '#2d3436', anim: true,
            draw(g, c) {
                const r = c.r;
                g.fillStyle = '#f5cba7'; g.fillRect(-r * 1.2, -r * 0.7, r * 2.4, r * 0.6);
                g.fillStyle = '#d63031'; g.fillRect(-r * 1.2, -r * 1.02, r * 2.4, r * 0.24);
            },
            extras(g, c) {   // headband tails flutter behind
                const r = c.r, look = c.look, bx = -look * r * 0.95, by = -r * 0.9;
                g.strokeStyle = '#d63031'; g.lineWidth = 5; g.lineCap = 'round';
                for (let k = 0; k < 2; k++) {
                    g.beginPath(); g.moveTo(bx, by);
                    g.quadraticCurveTo(bx - look * 14, by + 4 + Math.sin(c.t * 0.01 + k) * 5, bx - look * (26 + k * 5), by + 10 + k * 9 + Math.sin(c.t * 0.012 + k) * 6);
                    g.stroke();
                }
            }
        },
        {
            id: 'robot', name: 'Robot', rarity: 'rare', anim: true,
            fill: (g, c) => u.linear(g, -c.r, 0, c.r, 0, ['#dfe6e9', '#b2bec3', '#636e72']),
            draw(g, c) {
                const r = c.r, t = c.t;
                u.line(g, [[-r * 1.1, r * 0.25], [r * 1.1, r * 0.25]], 'rgba(0,0,0,0.25)', 2, 'butt');
                g.fillStyle = '#2d3436'; g.fillRect(-r * 0.45, r * 0.55, r * 0.9, r * 0.5);
                g.fillStyle = Math.floor(t / 400) % 2 ? '#00ff9d' : '#00995e'; g.fillRect(-r * 0.35, r * 0.68, r * 0.25, r * 0.22);
                g.fillStyle = Math.floor(t / 300) % 2 ? '#fdcb6e' : '#a07a2c'; g.fillRect(r * 0.08, r * 0.68, r * 0.25, r * 0.22);
                for (const x of [-0.75, 0.75]) u.circle(g, x * r, r * 0.25, 2.5, '#636e72');
            },
            extras(g, c) {   // antenna, only when the hat leaves the top of the head clear
                if (!c.hat || !c.hat.clearTop) return;
                const r = c.r;
                u.line(g, [[0, -r * 1.3], [0, -r * 1.3 - 14]], '#636e72', 3, 'butt');
                u.circle(g, 0, -r * 1.3 - 16, 4, Math.floor(c.t / 350) % 2 ? '#ff3838' : '#7f1d1d');
            }
        },
        {
            id: 'slime', name: 'Slime', anim: true,
            fill: (g, c) => u.radial(g, -c.r * 0.3, -c.r * 0.5, 2, 0, 0, c.r * 1.8, ['rgba(170,255,200,0.97)', 'rgba(30,170,90,0.92)']),
            draw(g, c) {
                const r = c.r, t = c.t;
                for (let i = 0; i < 5; i++) {
                    const yy = r * 1.6 - ((t * 0.03 + i * r * 0.6) % (r * 2.9));
                    const xx = Math.sin(i * 2.1 + t * 0.002) * r * 0.6;
                    u.circle(g, xx, yy, 2 + (i % 3) * 1.5, null, 'rgba(255,255,255,0.55)', 1.5);
                }
                u.ellipse(g, -r * 0.45, -r * 0.85, r * 0.22, r * 0.12, -0.6, 'rgba(255,255,255,0.4)');
            }
        },
        {
            id: 'magma', name: 'Magma', rarity: 'rare', anim: true,
            fill: (g, c) => u.radial(g, 0, c.r * 0.3, 2, 0, c.r * 0.2, c.r * 1.8, [[0, '#ffd166'], [0.45, '#e85d04'], [1, '#5c0a0a']]),
            draw(g, c) {
                const r = c.r;
                g.lineJoin = 'round';
                for (const k of CRACKS) u.line(g, k.map(([x, y]) => [x * r, y * r]), 'rgba(60,0,0,0.75)', 3, 'butt');
                g.fillStyle = `rgba(255,200,80,${0.12 + 0.1 * Math.sin(c.t * 0.005)})`;
                g.fillRect(-r * 1.2, -r * 1.5, r * 2.4, r * 3.3);
            }
        },
        // ---- Jerseys: mostly one-line pattern definitions ----
        { id: 'jersey_hoops',     name: 'Hoops',     fill: '#ffffff', pattern: ['hoops', '#e74c3c'], tags: ['jersey'] },
        { id: 'jersey_brazil',    name: 'Brazil',    fill: '#f9ca24', pattern: [['band', '#1e8449'], ['collar', '#2d3436']], tags: ['jersey'] },
        { id: 'jersey_pinstripe', name: 'Pinstripe', fill: '#1e3a8a', pattern: ['stripes', 'rgba(255,255,255,0.6)'], tags: ['jersey'] },
        { id: 'jersey_sash',      name: 'Sash',      pattern: ['sash', '#ffffff'], tags: ['jersey'] },
        { id: 'jersey_checker',   name: 'Checker',   fill: '#ecf0f1', pattern: ['checker', '#1e1e1e'], tags: ['jersey'] },
        { id: 'jersey_retro',     name: 'Retro',     fill: '#8e1b1b', pattern: [['collar', '#ffffff', 0.22], ['band', '#ffffff', 0.9, 0.18]], tags: ['jersey'] },
        {
            id: 'jersey_tuxedo', name: 'Tuxedo', fill: '#1e1e1e', tags: ['jersey'],
            draw(g, c) {
                u.ellipse(g, 0, c.r * 0.5, c.r * 0.42, c.r * 0.7, 0, '#ffffff');
                u.circle(g, 0, -c.r * 0.2, c.r * 0.13, '#d63031');
            }
        },
        {
            id: 'jersey_hawaiian', name: 'Hawaiian', fill: '#00b894', tags: ['jersey'],
            draw(g, c) {
                const dots = [[-0.6, -0.6, '#ff7675'], [0.5, -0.4, '#ffeaa7'], [-0.2, 0.2, '#fd79a8'], [0.7, 0.6, '#ff7675'], [-0.7, 0.9, '#ffeaa7'], [0.1, 1.1, '#fd79a8']];
                for (const [x, y, col] of dots) u.circle(g, x * c.r, y * c.r, c.r * 0.16, col);
            }
        },
        { id: 'jersey_rainbow', name: 'Rainbow', fill: '#ffffff', pattern: ['bands', ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6']], tags: ['jersey'] },
        {
            id: 'jersey_camo', name: 'Camo', fill: '#4b5320', tags: ['jersey'],
            draw(g, c) {
                const blobs = [[-0.6, -0.5, 0.35, '#2d3a1a'], [0.5, -0.2, 0.4, '#8a7a4a'], [-0.2, 0.5, 0.38, '#c9b98a'], [0.6, 0.8, 0.32, '#2d3a1a'], [-0.7, 1.0, 0.3, '#8a7a4a']];
                for (const [x, y, s, col] of blobs) u.ellipse(g, x * c.r, y * c.r, s * c.r, s * c.r * 0.7, 0.4, col);
            }
        }
    ];
});
