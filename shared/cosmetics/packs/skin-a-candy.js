Cosmetics.define({ pack: 'skin-a-candy', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'candy_mint', name: 'Mint Swirl', rarity: 'common', tags: ['candy', 'mint', 'green'],
        fill: '#ffffff',
        pattern: [['stripes', '#2ecc71']],
    },
    {
        id: 'candy_lolly', name: 'Lollipop', rarity: 'common', tags: ['candy', 'rainbow', 'swirl'],
        fill: '#ffffff',
        draw(g, c) {
            const r = c.r;
            const cols = ['#ff3b3b', '#ff9f1c', '#ffe066', '#2ecc71', '#3b82f6', '#a855f7'];
            for (let i = 0; i < cols.length; i++) {
                u.circle(g, 0, 0.2 * r, (0.9 - i * 0.14) * r, cols[i], null);
            }
        },
        extras(g, c) {
            const r = c.r;
            u.rect(g, -0.1 * r, 1.4 * r, 0.2 * r, 0.7 * r, '#f5f5f5', '#cfcfcf', 0.03 * r);
        },
    },
    {
        id: 'candy_gummy', name: 'Gummy Bear', rarity: 'common', tags: ['candy', 'gummy', 'red'],
        fill: 'rgba(230, 30, 60, 0.75)',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.4 * r, -0.3 * r, 0.25 * r, 0.4 * r, 0.3, 'rgba(255,255,255,0.55)', null);
            u.circle(g, 0.35 * r, 0.4 * r, 0.12 * r, 'rgba(255,255,255,0.45)', null);
        },
    },
    {
        id: 'candy_cotton', name: 'Cotton Candy', rarity: 'common', tags: ['candy', 'pink', 'blue'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#ff9ecf', '#8ec5ff']),
    },
    {
        id: 'candy_choc', name: 'Chocolate', rarity: 'common', tags: ['candy', 'chocolate', 'brown'],
        fill: '#6d4128',
        pattern: [['checker', '#4e2a17', 0.5]],
    },
    {
        id: 'candy_bubble', name: 'Bubblegum', rarity: 'common', tags: ['candy', 'pink', 'bubble'],
        fill: '#ff2d95',
        draw(g, c) {
            const r = c.r;
            u.circle(g, -0.4 * r, -0.4 * r, 0.2 * r, 'rgba(255,255,255,0.7)', null);
            u.circle(g, 0.35 * r, 0.3 * r, 0.12 * r, 'rgba(255,255,255,0.6)', null);
            u.circle(g, 0.1 * r, 0.9 * r, 0.08 * r, 'rgba(255,255,255,0.5)', null);
        },
    },
    {
        id: 'candy_donut', name: 'Donut', rarity: 'rare', tags: ['candy', 'donut', 'sprinkles'],
        fill: '#d9a66b',
        draw(g, c) {
            const r = c.r, rnd = u.rng(7);
            u.ellipse(g, 0, -0.2 * r, 0.95 * r, 0.7 * r, 0, '#ff7eb6', null);
            const sprinkle = ['#ffffff', '#3b82f6', '#2ecc71', '#ffe066', '#a855f7'];
            for (let i = 0; i < 16; i++) {
                const x = (rnd() * 1.6 - 0.8) * r;
                const y = (rnd() * 1.0 - 0.6) * r;
                u.ellipse(g, x, y, 0.06 * r, 0.03 * r, rnd() * 3, sprinkle[i % sprinkle.length], null);
            }
        },
    },
    {
        id: 'candy_icecream', name: 'Ice Cream', rarity: 'rare', tags: ['candy', 'icecream', 'scoops'],
        fill: '#ffffff',
        pattern: [['rows', ['#ff9ec7', '#ffe66d', '#8fd3ff']]],
    },
    {
        id: 'candy_cupcake', name: 'Cupcake', rarity: 'epic', tags: ['candy', 'cupcake', 'cherry'],
        fill: '#ffd6e8',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, -0.7 * r, 0.6 * r, '#ff5fa2', null);
            u.circle(g, -0.45 * r, -0.2 * r, 0.4 * r, '#ff5fa2', null);
            u.circle(g, 0.45 * r, -0.2 * r, 0.4 * r, '#ff5fa2', null);
            u.circle(g, 0, 0.3 * r, 0.3 * r, '#ff8fc0', null);
        },
        extras(g, c) {
            const r = c.r;
            u.line(g, [[0, -1.3 * r], [0.2 * r, -1.9 * r]], '#2e7d32', 0.06 * r, 'round');
            u.circle(g, 0, -1.5 * r, 0.22 * r, '#d00000', '#8b0000', 0.03 * r);
        },
    },
    {
        id: 'candy_sour', name: 'Sour Worms', rarity: 'common', tags: ['candy', 'sour', 'neon'],
        fill: '#39ff14',
        pattern: [['bands', ['#39ff14', '#ff8c00']]],
    },
]);
