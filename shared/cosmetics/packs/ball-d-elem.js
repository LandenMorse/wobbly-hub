Cosmetics.define({ pack: 'ball-d-elem', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'elem_water', name: 'Water', rarity: 'common', tags: ['element', 'water'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#90caf9', '#1565c0']));
            for (const dy of [-0.4, 0.1, 0.6]) {
                u.line(g, [[-0.6 * r, dy * r], [-0.3 * r, (dy - 0.15) * r], [0, dy * r], [0.3 * r, (dy - 0.15) * r], [0.6 * r, dy * r]], '#bbdefb', 3, 'round');
            }
        }
    },
    {
        id: 'elem_earth', name: 'Stone', rarity: 'common', tags: ['element', 'earth'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#a1887f', '#5d4037']));
            u.line(g, [[-0.5 * r, -0.2 * r], [-0.1 * r, 0], [-0.2 * r, 0.4 * r]], '#3e2723', 3, 'round');
            u.line(g, [[0.1 * r, -0.6 * r], [0.2 * r, -0.2 * r], [0.6 * r, -0.1 * r]], '#3e2723', 3, 'round');
            u.line(g, [[0.3 * r, 0.3 * r], [0.6 * r, 0.6 * r]], '#3e2723', 3, 'round');
        }
    },
    {
        id: 'elem_leaf', name: 'Leaf', rarity: 'common', tags: ['element', 'nature'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#a5d6a7', '#2e7d32']));
            u.line(g, [[-0.6 * r, 0.6 * r], [0.6 * r, -0.6 * r]], '#1b5e20', 3, 'round');
            for (const t of [-0.3, 0, 0.3]) {
                const px = t * r, py = -t * r;
                u.line(g, [[px, py], [px - 0.3 * r, py - 0.1 * r]], '#1b5e20', 2, 'round');
                u.line(g, [[px, py], [px + 0.1 * r, py + 0.3 * r]], '#1b5e20', 2, 'round');
            }
        }
    },
    {
        id: 'elem_sand', name: 'Sand', rarity: 'common', tags: ['element', 'desert'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#f5deb3', '#d7b77a']));
            const rnd = u.rng(5);
            for (let i = 0; i < 18; i++) {
                const x = (rnd() * 1.6 - 0.8) * r;
                const y = (rnd() * 1.6 - 0.8) * r;
                if (Math.hypot(x, y) < 0.85 * r) u.circle(g, x, y, 0.07 * r, '#a67c3d');
            }
        }
    },
    {
        id: 'elem_storm', name: 'Storm', rarity: 'common', tags: ['element', 'sky'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#607d8b', '#263238']));
            u.ellipse(g, -0.3 * r, -0.35 * r, 0.5 * r, 0.25 * r, 0, '#37474f');
            u.ellipse(g, 0.2 * r, -0.4 * r, 0.45 * r, 0.22 * r, 0, '#37474f');
            u.poly(g, [[0.15 * r, -0.05 * r], [-0.2 * r, 0.4 * r], [0.02 * r, 0.4 * r], [-0.15 * r, 0.85 * r], [0.3 * r, 0.3 * r], [0.05 * r, 0.3 * r], [0.25 * r, -0.05 * r]], '#ffd600', '#f57f17', 2);
        }
    },
    {
        id: 'elem_snow', name: 'Snowball', rarity: 'common', tags: ['element', 'winter'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ffffff', '#cfe8ff']));
            u.ellipse(g, 0.3 * r, 0.4 * r, 0.6 * r, 0.35 * r, -0.5, 'rgba(120,160,200,0.25)');
        }
    },
    {
        id: 'elem_lava', name: 'Lava', rarity: 'rare', tags: ['element', 'fire'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#4e342e', '#212121']));
            u.line(g, [[-0.6 * r, -0.4 * r], [-0.2 * r, -0.1 * r], [-0.4 * r, 0.3 * r], [-0.1 * r, 0.7 * r]], '#ff6d00', 4, 'round');
            u.line(g, [[0.2 * r, -0.7 * r], [0.3 * r, -0.2 * r], [0.7 * r, 0]], '#ff6d00', 4, 'round');
            u.line(g, [[0.2 * r, 0.1 * r], [0.5 * r, 0.5 * r]], '#ffab40', 3, 'round');
        }
    },
    {
        id: 'elem_thunder', name: 'Thunder', rarity: 'rare', tags: ['element', 'electric'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#fff9c4', '#ffd600']));
            u.line(g, [[-0.6 * r, -0.5 * r], [-0.2 * r, -0.1 * r], [-0.5 * r, 0.1 * r], [-0.1 * r, 0.6 * r]], '#ffffff', 4, 'round');
            u.line(g, [[0.5 * r, -0.6 * r], [0.2 * r, -0.1 * r], [0.5 * r, 0], [0.1 * r, 0.6 * r]], '#ffffff', 4, 'round');
        }
    },
    {
        id: 'elem_frost', name: 'Frost Core', rarity: 'epic', tags: ['element', 'ice'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#e1f5fe', '#4fc3f7']));
            for (let k = 0; k < 6; k++) {
                const a = k * Math.PI / 3;
                const tipX = Math.cos(a) * 0.9 * r, tipY = Math.sin(a) * 0.9 * r;
                const b1x = Math.cos(a + 0.35) * 0.3 * r, b1y = Math.sin(a + 0.35) * 0.3 * r;
                const b2x = Math.cos(a - 0.35) * 0.3 * r, b2y = Math.sin(a - 0.35) * 0.3 * r;
                u.poly(g, [[tipX, tipY], [b1x, b1y], [b2x, b2y]], '#e1f5fe', '#0288d1', 2);
            }
        }
    },
    {
        id: 'elem_plasma', name: 'Plasma', rarity: 'legendary', tags: ['element', 'energy'], anim: true,
        draw(g, c) {
            const r = c.r;
            const t = c.t / 600;
            u.circle(g, 0, 0, r, u.radial(g, 0, 0, 0.1 * r, 0, 0, r, ['#ff4fd8', '#00838f']));
            for (let i = 0; i < 4; i++) {
                const a = t + i * Math.PI / 2;
                const pts = [];
                for (let s = 0; s <= 20; s++) {
                    const ang = a + s * 0.3;
                    const rad = (0.2 + s * 0.03) * r;
                    pts.push([Math.cos(ang) * rad, Math.sin(ang) * rad]);
                }
                u.line(g, pts, i % 2 ? '#00e5ff' : '#ff4fd8', 3, 'round');
            }
        }
    },
]);
