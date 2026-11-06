Cosmetics.define({ pack: 'hat-b-holiday', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'holiday_elf', name: 'Elf Cap', rarity: 'common', tags: ['christmas', 'green'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.6 * r, -1.0 * r], [0.6 * r, -1.0 * r], [0.3 * c.look * r, -2.7 * r]], '#2e7d32', null);
            u.rect(g, -0.68 * r, -1.14 * r, 1.36 * r, 0.18 * r, '#c62828', null);
            u.circle(g, 0.3 * c.look * r, -2.75 * r, 0.18 * r, '#ffd54f', null);
        }
    },
    {
        id: 'holiday_reindeer', name: 'Reindeer Antlers', rarity: 'common', tags: ['christmas', 'animal'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.25 * r, -1.3 * r], [-0.5 * r, -2.1 * r], [-0.95 * r, -2.5 * r]], '#6d4c41', 0.12 * r, 'round');
            u.line(g, [[-0.5 * r, -1.9 * r], [-0.8 * r, -1.95 * r]], '#6d4c41', 0.1 * r, 'round');
            u.line(g, [[0.25 * r, -1.3 * r], [0.5 * r, -2.1 * r], [0.95 * r, -2.5 * r]], '#6d4c41', 0.12 * r, 'round');
            u.line(g, [[0.5 * r, -1.9 * r], [0.8 * r, -1.95 * r]], '#6d4c41', 0.1 * r, 'round');
            u.circle(g, 0, -1.15 * r, 0.2 * r, '#e53935', null);
        }
    },
    {
        id: 'holiday_bunny', name: 'Easter Basket', rarity: 'common', tags: ['easter', 'pastel'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.8 * r, -1.0 * r], [0.8 * r, -1.0 * r], [0.65 * r, -1.5 * r], [-0.65 * r, -1.5 * r]], '#f8bbd0', null);
            u.line(g, [[-0.72 * r, -1.25 * r], [0.72 * r, -1.25 * r]], '#f48fb1', 0.08 * r, 'round');
            u.ellipse(g, -0.35 * r, -1.7 * r, 0.22 * r, 0.28 * r, 0, '#fff59d', null);
            u.ellipse(g, 0.1 * r, -1.85 * r, 0.22 * r, 0.28 * r, 0, '#b2ebf2', null);
            u.ellipse(g, 0.45 * r, -1.6 * r, 0.2 * r, 0.26 * r, 0, '#d1c4e9', null);
        }
    },
    {
        id: 'holiday_cupid', name: 'Cupid Hearts', rarity: 'common', tags: ['valentine', 'pink'], clearTop: true,
        draw(g, c) {
            const r = c.r;
            const heart = (x, y, s, fill) => {
                u.circle(g, x - 0.13 * s * r, y - 0.1 * r, 0.2 * s * r, fill, null);
                u.circle(g, x + 0.13 * s * r, y - 0.1 * r, 0.2 * s * r, fill, null);
                u.poly(g, [[x - 0.32 * s * r, y - 0.05 * r], [x + 0.32 * s * r, y - 0.05 * r], [x, y + 0.35 * s * r]], fill, null);
            };
            u.line(g, [[-0.95 * r, -1.0 * r], [-0.3 * r, -1.3 * r], [0.3 * r, -1.3 * r], [0.95 * r, -1.0 * r]], '#f48fb1', 0.18 * r, 'round');
            heart(-0.75 * r, -2.0 * r, 1.0, '#ec407a');
            heart(0.75 * r, -2.0 * r, 1.0, '#ec407a');
        }
    },
    {
        id: 'holiday_leprechaun', name: 'Leprechaun', rarity: 'rare', tags: ['stpatricks', 'green'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.55 * r, -2.4 * r, 1.1 * r, 1.3 * r, '#2e7d32', null);
            u.ellipse(g, 0, -1.1 * r, 0.95 * r, 0.14 * r, 0, '#1b5e20', null);
            u.rect(g, -0.55 * r, -1.5 * r, 1.1 * r, 0.2 * r, '#1b5e20', null);
            u.rect(g, -0.2 * r, -1.45 * r, 0.4 * r, 0.3 * r, '#ffca28', '#f9a825', 0.04 * r);
            const cx = 0.36 * r, cy = -1.85 * r;
            u.circle(g, cx - 0.09 * r, cy, 0.1 * r, '#66bb6a', null);
            u.circle(g, cx + 0.09 * r, cy, 0.1 * r, '#66bb6a', null);
            u.circle(g, cx, cy - 0.09 * r, 0.1 * r, '#66bb6a', null);
            u.circle(g, cx, cy + 0.09 * r, 0.1 * r, '#66bb6a', null);
        }
    },
    {
        id: 'holiday_turkey', name: 'Turkey Feathers', rarity: 'common', tags: ['thanksgiving', 'autumn'],
        draw(g, c) {
            const r = c.r;
            const angles = [-0.9, -0.45, 0, 0.45, 0.9];
            const tips = ['#ff8f00', '#e53935', '#fdd835', '#e53935', '#ff8f00'];
            for (let i = 0; i < angles.length; i++) {
                const a = angles[i];
                u.ellipse(g, Math.sin(a) * 0.9 * r, -1.2 * r - Math.cos(a) * 0.9 * r, 0.2 * r, 0.75 * r, a, '#6d4c41', null);
            }
            for (let i = 0; i < angles.length; i++) {
                const a = angles[i];
                u.ellipse(g, Math.sin(a) * 1.45 * r, -1.2 * r - Math.cos(a) * 1.45 * r, 0.2 * r, 0.3 * r, a, tips[i], null);
            }
            u.ellipse(g, 0, -1.15 * r, 0.6 * r, 0.2 * r, 0, '#6d4c41', null);
        }
    },
    {
        id: 'holiday_firework', name: 'Firework Burst', rarity: 'rare', tags: ['celebration', 'sparks'], anim: true,
        draw(g, c) {
            const r = c.r;
            const t = c.t;
            const cols = ['#ff1744', '#ffea00', '#00e5ff', '#76ff03', '#d500f9', '#ff9100', '#2979ff'];
            const cx = 0, cy = -1.7 * r;
            for (let i = 0; i < 7; i++) {
                const a = -Math.PI + (i + 0.5) * Math.PI / 7 + Math.sin(t / 400) * 0.1;
                const len = (0.8 + 0.2 * Math.sin(t / 250 + i * 1.3)) * r;
                const x1 = cx + Math.cos(a) * 0.3 * r;
                const y1 = cy + Math.sin(a) * 0.3 * r;
                const x2 = cx + Math.cos(a) * len;
                const y2 = cy + Math.sin(a) * len;
                u.line(g, [[x1, y1], [x2, y2]], cols[i], 0.1 * r, 'round');
            }
            u.circle(g, cx, cy, 0.15 * r, '#fff59d', null);
        }
    },
    {
        id: 'holiday_newyear', name: 'New Year Hat', rarity: 'common', tags: ['party', 'gold'],
        draw(g, c) {
            const r = c.r;
            const rnd = u.rng(5);
            const cols = ['#e53935', '#1e88e5', '#43a047', '#ffffff', '#ec407a'];
            u.poly(g, [[-0.6 * r, -1.0 * r], [0.6 * r, -1.0 * r], [0, -2.8 * r]], '#ffc107', null);
            u.circle(g, 0, -2.85 * r, 0.14 * r, '#ffffff', null);
            for (let i = 0; i < 10; i++) {
                const x = (rnd() - 0.5) * 1.6 * r;
                const y = -1.2 * r - rnd() * 1.4 * r;
                u.circle(g, x, y, 0.07 * r, cols[i % cols.length], null);
            }
        }
    },
    {
        id: 'holiday_snowman', name: 'Snowman Top', rarity: 'epic', tags: ['winter', 'snow'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.5 * r, -2.3 * r, 1.0 * r, 1.2 * r, '#212121', null);
            u.ellipse(g, 0, -1.1 * r, 0.8 * r, 0.14 * r, 0, '#212121', null);
            u.rect(g, -0.5 * r, -1.5 * r, 1.0 * r, 0.2 * r, '#e53935', null);
            u.circle(g, -0.3 * r, -2.35 * r, 0.16 * r, '#ffffff', null);
            u.circle(g, 0.15 * r, -2.42 * r, 0.2 * r, '#ffffff', null);
            u.circle(g, -0.55 * r, -1.12 * r, 0.1 * r, '#ffffff', null);
            u.circle(g, 0.6 * r, -1.05 * r, 0.12 * r, '#ffffff', null);
            u.poly(g, [[0.25 * r, -1.3 * r], [0.5 * r, -1.3 * r], [0.55 * r, -0.95 * r], [0.3 * r, -0.95 * r]], '#e53935', null);
        }
    },
    {
        id: 'holiday_gingerbread', name: 'Gingerbread', rarity: 'legendary', tags: ['christmas', 'candy'], anim: true,
        draw(g, c) {
            const r = c.r;
            const t = c.t;
            u.poly(g, [[-1.5 * r, -1.0 * r], [1.5 * r, -1.0 * r], [0, -2.9 * r]], '#8d5524', null);
            const xs = [-1.2, -0.6, 0, 0.6, 1.2];
            for (let i = 0; i < xs.length; i++) {
                u.circle(g, xs[i] * r, -1.2 * r, 0.18 * r, '#ffffff', null);
            }
            u.circle(g, -0.7 * r, -1.7 * r, 0.14 * r, '#e53935', null);
            u.circle(g, 0.65 * r, -1.75 * r, 0.14 * r, '#43a047', null);
            u.circle(g, 0.1 * r, -2.2 * r, 0.12 * r, '#fdd835', null);
            const lights = [[-0.8, -1.5], [-0.35, -1.9], [0.35, -1.9], [0.8, -1.5], [-0.2, -2.4], [0.2, -2.4]];
            for (let i = 0; i < lights.length; i++) {
                const b = 0.5 + 0.5 * Math.sin(t / 300 + i);
                u.circle(g, lights[i][0] * r, lights[i][1] * r, 0.08 * r, `rgba(255,235,59,${b.toFixed(3)})`, null);
            }
        }
    },
]);
