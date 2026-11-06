Cosmetics.define({ pack: 'acc-c-jungle', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'jungle_vine', name: 'Vine Wrap', rarity: 'common', tags: ['jungle', 'nature'],
        draw(g, c) {
            const r = c.r;
            const pts = [];
            for (let i = 0; i <= 8; i++) {
                const t = i / 8;
                pts.push([(-0.9 + 1.8 * t) * r, (0.5 + 1.1 * t) * r]);
            }
            u.line(g, pts, '#1b3d1f', 0.3 * r, 'round');
            u.line(g, pts, '#4caf50', 0.18 * r, 'round');
            for (const i of [1, 3, 5, 7]) {
                const p = pts[i];
                u.ellipse(g, p[0] + 0.14 * r, p[1] - 0.12 * r, 0.2 * r, 0.1 * r, -0.6, '#66bb6a', '#1b3d1f', 2);
                u.ellipse(g, p[0] - 0.14 * r, p[1] + 0.12 * r, 0.2 * r, 0.1 * r, 2.5, '#43a047', '#1b3d1f', 2);
            }
        }
    },
    {
        id: 'jungle_feather', name: 'Tribal Feather', rarity: 'common', tags: ['tribal', 'jungle'],
        draw(g, c) {
            const r = c.r;
            const fx = 1.1 * r * c.look;
            u.ellipse(g, fx, -0.2 * r, 0.14 * r, 0.5 * r, 0.3 * c.look, '#ff7043', '#3e2723', 2);
            u.ellipse(g, fx - 0.2 * r * c.look, 0.0 * r, 0.12 * r, 0.42 * r, 0.1 * c.look, '#ffca28', '#3e2723', 2);
            u.line(g, [[fx, -0.6 * r], [fx, 0.3 * r]], '#3e2723', 2, 'round');
        }
    },
    {
        id: 'jungle_warpaint', name: 'War Paint', rarity: 'common', tags: ['tribal', 'war'],
        draw(g, c) {
            const r = c.r;
            const cols = ['#e53935', '#fdd835', '#1e88e5'];
            for (let i = 0; i < 3; i++) {
                const y0 = (0.0 + i * 0.18) * r;
                u.line(g, [[0.2 * r * c.look, y0], [0.75 * r * c.look, y0 + 0.22 * r]], cols[i], 0.14 * r, 'round');
            }
        }
    },
    {
        id: 'jungle_tooth', name: 'Tooth Necklace', rarity: 'common', tags: ['tribal', 'jungle'],
        draw(g, c) {
            const r = c.r;
            const arc = (t) => [(-0.9 + 1.8 * t) * r, 0.45 * r + Math.sin(Math.PI * t) * 0.35 * r];
            const cord = [];
            for (let i = 0; i <= 12; i++) cord.push(arc(i / 12));
            u.line(g, cord, '#5d4037', 0.1 * r, 'round');
            for (const t of [0.1, 0.3, 0.5, 0.7, 0.9]) {
                const p = arc(t);
                u.poly(g, [[p[0] - 0.15 * r, p[1]], [p[0] + 0.15 * r, p[1]], [p[0], p[1] + 0.36 * r]], '#fff8e1', '#333', 2);
            }
        }
    },
    {
        id: 'jungle_butterfly', name: 'Butterfly', rarity: 'common', tags: ['nature', 'jungle'],
        draw(g, c) {
            const r = c.r;
            const x = 0.9 * r * c.look;
            const y = 0.2 * r;
            u.ellipse(g, x + 0.2 * r * c.look, y - 0.12 * r, 0.24 * r, 0.2 * r, -0.4, '#ab47bc', '#2a1030', 2);
            u.ellipse(g, x + 0.16 * r * c.look, y + 0.16 * r, 0.18 * r, 0.14 * r, 0.3, '#ffca28', '#2a1030', 2);
            u.line(g, [[x, y - 0.2 * r], [x - 0.08 * r * c.look, y - 0.4 * r]], '#2a1030', 2, 'round');
            u.rect(g, x - 0.05 * r, y - 0.22 * r, 0.1 * r, 0.52 * r, '#3e2723', '#2a1030', 1.5);
        }
    },
    {
        id: 'jungle_leafcape', name: 'Leaf Cape', rarity: 'common', tags: ['jungle', 'nature'],
        draw(g, c) {
            const r = c.r;
            const b = -c.look;
            const leaves = [[0.95, 0.6, 0.6], [1.3, 1.0, 0.9], [0.8, 1.3, 1.2]];
            for (const [dx, dy, rot] of leaves) {
                const x = dx * r * b;
                const y = dy * r;
                const a = rot * b;
                u.ellipse(g, x, y, 0.42 * r, 0.2 * r, a, '#43a047', '#1b3d1f', 2);
                u.line(g, [[x - 0.3 * r * b, y], [x + 0.3 * r * b, y]], '#1b3d1f', 1.5, 'round');
            }
        }
    },
    {
        id: 'jungle_parrot', name: 'Parrot Pal', rarity: 'rare', tags: ['jungle', 'bird'],
        draw(g, c) {
            const r = c.r;
            const bx = 1.1 * r * c.look;
            const by = 0.3 * r;
            u.ellipse(g, bx, by + 0.1 * r, 0.22 * r, 0.32 * r, 0, '#e53935', '#333', 2);
            u.ellipse(g, bx - 0.05 * r * c.look, by + 0.15 * r, 0.14 * r, 0.26 * r, 0.2 * c.look, '#1e88e5', '#333', 2);
            u.circle(g, bx + 0.05 * r * c.look, by - 0.25 * r, 0.2 * r, '#e53935', '#333', 2);
            u.poly(g, [[bx + 0.14 * r * c.look, by - 0.3 * r], [bx + 0.38 * r * c.look, by - 0.2 * r], [bx + 0.14 * r * c.look, by - 0.12 * r]], '#ffc107', '#333', 2);
        }
    },
    {
        id: 'jungle_mush', name: 'Mushroom Cap', rarity: 'rare', tags: ['jungle', 'fungus'],
        draw(g, c) {
            const r = c.r;
            const mx = -0.55 * r * c.look;
            const my = 0.55 * r;
            u.rect(g, mx - 0.1 * r, my, 0.2 * r, 0.3 * r, '#fff3e0', '#3e1a1a', 2);
            u.ellipse(g, mx, my, 0.3 * r, 0.22 * r, 0, '#e53935', '#3e1a1a', 2);
            u.circle(g, mx - 0.12 * r, my - 0.06 * r, 0.07 * r, '#ffffff', null);
            u.circle(g, mx + 0.12 * r, my - 0.08 * r, 0.07 * r, '#ffffff', null);
            u.circle(g, mx, my - 0.14 * r, 0.07 * r, '#ffffff', null);
        }
    },
    {
        id: 'jungle_firefly', name: 'Firefly Swarm', rarity: 'epic', tags: ['jungle', 'glow'], anim: true,
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 5; i++) {
                const a = c.t / 1000 * 1.3 + i * (2 * Math.PI / 5);
                const fx = Math.cos(a) * 0.95 * r;
                const fy = 0.2 * r + Math.sin(a + i) * 0.8 * r;
                u.circle(g, fx, fy, 0.3 * r, u.radial(g, fx, fy, 0, fx, fy, 0.3 * r, ['rgba(255,235,59,0.9)', 'rgba(255,235,59,0)']), null);
                u.circle(g, fx, fy, 0.09 * r, '#fff176', '#5d4037', 1.5);
            }
        }
    },
    {
        id: 'jungle_spirit', name: 'Jungle Spirit', rarity: 'legendary', tags: ['jungle', 'spirit', 'glow'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0.2 * r, 1.2 * r, u.radial(g, 0, 0.2 * r, 0, 0, 0.2 * r, 1.2 * r, ['rgba(105,240,174,0.3)', 'rgba(105,240,174,0)']), null);
            for (let i = 0; i < 6; i++) {
                const a = c.t / 1000 * 0.9 + i * (Math.PI / 3);
                const x = Math.cos(a) * 1.2 * r;
                const y = 0.25 * r + Math.sin(a) * 1.0 * r;
                u.ellipse(g, x, y, 0.2 * r, 0.09 * r, a + Math.PI / 2, 'rgba(105,240,174,0.75)', '#1b5e20', 1.5);
            }
        }
    },
]);
