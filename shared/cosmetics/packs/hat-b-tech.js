Cosmetics.define({ pack: 'hat-b-tech', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'tech_headset', name: 'Gamer Headset', rarity: 'common', tags: ['tech', 'gaming'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.95 * r, -0.8 * r], [-0.8 * r, -1.5 * r], [0, -1.7 * r], [0.8 * r, -1.5 * r], [0.95 * r, -0.8 * r]], '#111111', 0.18 * r, 'round');
            u.ellipse(g, -0.95 * r, -0.8 * r, 0.28 * r, 0.36 * r, 0, '#111111', c.team, 0.08 * r);
            u.ellipse(g, 0.95 * r, -0.8 * r, 0.28 * r, 0.36 * r, 0, '#111111', c.team, 0.08 * r);
            u.circle(g, -0.95 * r, -0.8 * r, 0.1 * r, c.team);
            u.circle(g, 0.95 * r, -0.8 * r, 0.1 * r, c.team);
            u.line(g, [[0.95 * r, -0.44 * r], [0.7 * r, -0.3 * r]], '#111111', 0.07 * r, 'round');
        }
    },
    {
        id: 'tech_vr', name: 'VR Goggles', rarity: 'rare', tags: ['tech', 'vr'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1.0 * r, -1.3 * r, 2.0 * r, 0.35 * r, '#546e7a', null);
            u.rect(g, -0.9 * r, -1.12 * r, 1.8 * r, 0.1 * r, '#00e5ff', null);
            u.rect(g, -1.15 * r, -1.22 * r, 0.22 * r, 0.22 * r, '#37474f', null);
            u.rect(g, 0.93 * r, -1.22 * r, 0.22 * r, 0.22 * r, '#37474f', null);
        }
    },
    {
        id: 'tech_circuit', name: 'Circuit Band', rarity: 'common', tags: ['tech', 'circuit'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1.0 * r, -1.25 * r, 2.0 * r, 0.22 * r, '#1b5e20', '#0a2e10', 0.03 * r);
            u.line(g, [[-0.85 * r, -1.14 * r], [-0.5 * r, -1.14 * r], [-0.5 * r, -1.07 * r]], '#ffd54f', 0.04 * r);
            u.line(g, [[-0.2 * r, -1.14 * r], [0.2 * r, -1.14 * r]], '#ffd54f', 0.04 * r);
            u.line(g, [[0.5 * r, -1.07 * r], [0.5 * r, -1.14 * r], [0.85 * r, -1.14 * r]], '#ffd54f', 0.04 * r);
            u.circle(g, -0.5 * r, -1.14 * r, 0.05 * r, '#ffd54f');
            u.circle(g, 0.5 * r, -1.14 * r, 0.05 * r, '#ffd54f');
        }
    },
    {
        id: 'tech_bot', name: 'Robo Antenna', rarity: 'common', tags: ['tech', 'robot'], anim: true,
        draw(g, c) {
            const r = c.r;
            const on = Math.floor(c.t / 400) % 2 === 0;
            u.line(g, [[0, -1.3 * r], [0, -1.95 * r]], '#78909c', 0.06 * r);
            u.ellipse(g, 0, -1.15 * r, 0.5 * r, 0.2 * r, 0, '#b0bec5', '#607d8b', 0.04 * r);
            u.circle(g, 0, -2.0 * r, 0.14 * r, on ? '#ff1744' : '#4a0a10');
        }
    },
    {
        id: 'tech_pixel', name: 'Pixel Crown', rarity: 'common', tags: ['tech', 'gold'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.8 * r, -1.2 * r, 1.6 * r, 0.2 * r, '#ffc107', '#8a5a00', 0.04 * r);
            u.rect(g, -0.8 * r, -1.6 * r, 0.3 * r, 0.4 * r, '#ffc107', '#8a5a00', 0.04 * r);
            u.rect(g, -0.25 * r, -1.75 * r, 0.5 * r, 0.55 * r, '#ffc107', '#8a5a00', 0.04 * r);
            u.rect(g, 0.5 * r, -1.6 * r, 0.3 * r, 0.4 * r, '#ffc107', '#8a5a00', 0.04 * r);
            u.rect(g, -0.07 * r, -1.5 * r, 0.14 * r, 0.14 * r, '#e53935', null);
        }
    },
    {
        id: 'tech_neon', name: 'Neon Halo', rarity: 'rare', tags: ['tech', 'glow'], clearTop: true, anim: true,
        draw(g, c) {
            const r = c.r;
            const a = 0.6 + 0.4 * Math.sin(c.t / 300);
            u.ellipse(g, 0, -1.95 * r, 1.0 * r, 0.22 * r, 0, null, 'rgba(0,229,255,' + a.toFixed(2) + ')', 0.14 * r);
            u.ellipse(g, 0, -1.95 * r, 1.0 * r, 0.22 * r, 0, null, '#e0ffff', 0.04 * r);
        }
    },
    {
        id: 'tech_wifi', name: 'Wifi Wave', rarity: 'common', tags: ['tech', 'signal'],
        draw(g, c) {
            const r = c.r;
            const arc = (R) => {
                const pts = [];
                for (let i = 0; i <= 8; i++) {
                    const t = 0.6 + (Math.PI - 1.2) * i / 8;
                    pts.push([Math.cos(t) * R * r, -1.35 * r - Math.sin(t) * R * r]);
                }
                return pts;
            };
            u.line(g, arc(0.55), '#29b6f6', 0.12 * r, 'round');
            u.line(g, arc(0.9), '#29b6f6', 0.12 * r, 'round');
            u.line(g, arc(1.25), '#29b6f6', 0.12 * r, 'round');
            u.circle(g, 0, -1.35 * r, 0.12 * r, '#29b6f6');
        }
    },
    {
        id: 'tech_hologram', name: 'Hologram', rarity: 'epic', tags: ['tech', 'hologram'], anim: true,
        draw(g, c) {
            const r = c.r;
            const f = Math.floor(c.t / 80) % 5 === 0 ? 0.3 : 0.75;
            const fill = 'rgba(0,229,255,' + (f * 0.5).toFixed(2) + ')';
            const stroke = 'rgba(0,229,255,' + f.toFixed(2) + ')';
            u.line(g, [[-0.4 * r, -2.3 * r], [-0.2 * r, -2.5 * r]], stroke, 0.05 * r);
            u.line(g, [[0.3 * r, -2.3 * r], [0.5 * r, -2.5 * r]], stroke, 0.05 * r);
            u.line(g, [[0.3 * r, -1.6 * r], [0.5 * r, -1.8 * r]], stroke, 0.05 * r);
            u.line(g, [[-0.4 * r, -1.6 * r], [-0.2 * r, -1.8 * r]], stroke, 0.05 * r);
            u.rect(g, -0.2 * r, -2.5 * r, 0.7 * r, 0.7 * r, fill, stroke, 0.05 * r);
            u.rect(g, -0.4 * r, -2.3 * r, 0.7 * r, 0.7 * r, fill, stroke, 0.06 * r);
        }
    },
    {
        id: 'tech_drone', name: 'Drone Cap', rarity: 'rare', tags: ['tech', 'drone'], anim: true,
        draw(g, c) {
            const r = c.r;
            const by = Math.sin(c.t / 300) * 0.05 * r;
            const cy = -2.0 * r + by;
            const ry = -2.3 * r + by;
            u.line(g, [[0, cy], [-0.7 * r, ry]], '#37474f', 0.05 * r);
            u.line(g, [[0, cy], [0.7 * r, ry]], '#37474f', 0.05 * r);
            u.ellipse(g, -0.7 * r, ry, 0.3 * r, 0.05 * r, c.t / 60, 'rgba(255,255,255,0.8)', null);
            u.ellipse(g, 0.7 * r, ry, 0.3 * r, 0.05 * r, c.t / 60, 'rgba(255,255,255,0.8)', null);
            u.rect(g, -0.35 * r, cy - 0.11 * r, 0.7 * r, 0.22 * r, '#37474f', null);
            u.circle(g, 0, cy, 0.06 * r, '#ff5252');
        }
    },
    {
        id: 'tech_matrix', name: 'Matrix Code', rarity: 'legendary', tags: ['tech', 'matrix'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1.1 * r, -1.12 * r, 2.2 * r, 0.12 * r, 'rgba(0,60,0,0.6)', null);
            for (let i = 0; i < 5; i++) {
                const x = (i - 2) * 0.5 * r;
                for (let j = 0; j < 5; j++) {
                    const f = (c.t / 1500 + i * 0.23 + j * 0.17) % 1;
                    const y = (-3.0 + f * 1.85) * r;
                    const a = 0.25 + 0.75 * f;
                    u.rect(g, x - 0.08 * r, y, 0.16 * r, 0.14 * r, 'rgba(0,255,102,' + a.toFixed(2) + ')', null);
                }
            }
        }
    },
]);
