Cosmetics.define({ pack: 'skin-a-forest', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'forest_pine', name: 'Pine', rarity: 'common', tags: ['forest', 'green'],
        fill: '#1b5e20',
        pattern: [['stripes', '#0d3b13']],
    },
    {
        id: 'forest_bark', name: 'Bark', rarity: 'common', tags: ['forest', 'brown'],
        fill: '#6d4c41',
        pattern: [['bands', ['#6d4c41', '#4e342e', '#8d6e63']]],
    },
    {
        id: 'forest_mushroom', name: 'Toadstool', rarity: 'common', tags: ['forest', 'red'],
        fill: '#d32f2f',
        pattern: [['dots', '#ffffff', 0.12, 0.5]],
    },
    {
        id: 'forest_moss', name: 'Mossy Rock', rarity: 'common', tags: ['forest', 'grey'],
        fill: '#8a9a8b',
        pattern: [['blobs', ['#558b2f', '#33691e'], 6, 4]],
    },
    {
        id: 'forest_fox', name: 'Fox', rarity: 'common', tags: ['forest', 'orange'],
        fill: '#ef6c00',
        pattern: [['belly', '#ffffff']],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.poly(g, [[s * 0.25 * r, -1.1 * r], [s * 0.8 * r, -2.4 * r], [s * 0.9 * r, -0.9 * r]], '#e65100');
        },
    },
    {
        id: 'forest_owl', name: 'Owl', rarity: 'common', tags: ['forest', 'brown'],
        fill: '#8d6e63',
        pattern: [['dots', '#d7ccc8', 0.12, 0.38]],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 1.0 * r, 0.7 * r, 0.6 * r, 0, '#efebe9');
            u.poly(g, [[-0.15 * r, 0.2 * r], [0.15 * r, 0.2 * r], [0, 0.5 * r]], '#ffb300');
        },
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.poly(g, [[s * 0.35 * r, -1.2 * r], [s * 0.85 * r, -1.9 * r], [s * 0.9 * r, -0.9 * r]], '#6d4c41');
        }
    },
    {
        id: 'forest_deer', name: 'Fawn', rarity: 'rare', tags: ['forest', 'tan'],
        fill: '#d2b48c',
        pattern: [['dots', '#ffffff', 0.1, 0.55]],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.line(g, [[s * 0.45 * r, -1.2 * r], [s * 0.8 * r, -2.2 * r], [s * 1.1 * r, -2.4 * r]], '#5d4037', 0.12 * r, 'round');
        },
    },
    {
        id: 'forest_bear', name: 'Bear', rarity: 'rare', tags: ['forest', 'brown'],
        fill: '#5d4037',
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.circle(g, s * 0.8 * r, -1.25 * r, 0.4 * r, '#5d4037');
                u.circle(g, s * 0.8 * r, -1.25 * r, 0.2 * r, '#8d6e63');
            }
        },
    },
    {
        id: 'forest_firefly', name: 'Firefly', rarity: 'epic', tags: ['forest', 'glow'], anim: true,
        fill: '#0b3d1e',
        draw(g, c) {
            const r = c.r, rnd = u.rng(7);
            for (let i = 0; i < 6; i++) {
                const x = (rnd() * 1.6 - 0.8) * r;
                const y = (rnd() * 2.4 - 0.8) * r;
                const a = 0.5 + 0.5 * Math.sin(c.t / 400 + i * 1.7);
                u.circle(g, x, y, 0.09 * r, 'rgba(255,241,118,' + a.toFixed(2) + ')', null);
            }
        },
    },
    {
        id: 'forest_leaf', name: 'Autumn Leaf', rarity: 'common', tags: ['forest', 'autumn'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#c62828', '#ef6c00', '#fdd835']),
        draw(g, c) {
            const r = c.r;
            u.line(g, [[0, -1.1 * r], [0, 1.5 * r]], 'rgba(255,255,255,0.4)', 0.06 * r, 'round');
        },
    },
]);
