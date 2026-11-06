Cosmetics.define({ pack: 'boots-c-sweet', category: 'boots', author: 'helper' }, (u) => [
    {
        id: 'sweet_donut', name: 'Donut Dash', rarity: 'common', tags: ['sweet', 'candy'],
        colors: ['#f9a8d4', '#d6b98c'],
    },
    {
        id: 'sweet_cocoa', name: 'Cocoa', rarity: 'common', tags: ['sweet', 'chocolate'],
        colors: ['#5d3a1a', '#fff3e0'],
    },
    {
        id: 'sweet_lemon', name: 'Lemon Drop', rarity: 'common', tags: ['sweet', 'citrus'],
        colors: ['#fde047', '#ffffff'],
    },
    {
        id: 'sweet_berry', name: 'Berry Blast', rarity: 'common', tags: ['sweet', 'fruit'],
        colors: ['#7e22ce', '#f472b6'],
    },
    {
        id: 'sweet_cotton', name: 'Cotton Candy', rarity: 'common', tags: ['sweet', 'candy'],
        colors: ['#bae6fd', '#f472b6'],
    },
    {
        id: 'sweet_cream', name: 'Ice Cream', rarity: 'common', tags: ['sweet', 'dessert'],
        colors: ['#fef3c7', '#6ee7b7'],
    },
    {
        id: 'sweet_sprinkle', name: 'Sprinkles', rarity: 'rare', tags: ['sweet', 'dessert'],
        colors: ['#f9a8d4', '#ffffff'],
        over(g, c, x) {
            const r = c.r;
            const rnd = u.rng(11);
            const cols = ['#facc15', '#38bdf8', '#22c55e', '#a855f7', '#f97316'];
            for (let i = 0; i < 5; i++) {
                const sx = x + (rnd() - 0.5) * 0.8 * r;
                const sy = (1.5 + rnd() * 0.9) * r;
                const ang = rnd() * Math.PI;
                const dx = Math.cos(ang) * 0.1 * r;
                const dy = Math.sin(ang) * 0.1 * r;
                u.line(g, [[sx - dx, sy - dy], [sx + dx, sy + dy]], cols[i % cols.length], 0.07 * r, 'round');
            }
        },
    },
    {
        id: 'sweet_gummy', name: 'Gummy Bears', rarity: 'rare', tags: ['sweet', 'candy'],
        colors: ['#dc2626', '#f97316'],
        over(g, c, x) {
            const r = c.r;
            u.ellipse(g, x - 0.22 * r, 1.7 * r, 0.09 * r, 0.05 * r, -0.4, 'rgba(255,255,255,0.6)', null);
            u.ellipse(g, x + 0.14 * r, 2.05 * r, 0.09 * r, 0.05 * r, -0.4, 'rgba(255,255,255,0.6)', null);
        },
    },
    {
        id: 'sweet_lolli', name: 'Lollipop Swirl', rarity: 'epic', tags: ['sweet', 'candy'],
        colors: ['#ffffff', '#ff1493'],
        over(g, c, x) {
            const r = c.r;
            const pts = [];
            for (let i = 0; i <= 12; i++) {
                const a = (i / 12) * Math.PI * 1.6 - 0.4;
                pts.push([x + Math.cos(a) * 0.3 * r, 2.0 * r + Math.sin(a) * 0.3 * r * 0.6]);
            }
            u.line(g, pts, '#ff69b4', 0.09 * r, 'round');
        },
    },
    {
        id: 'sweet_golden', name: 'Golden Syrup', rarity: 'legendary', tags: ['sweet', 'syrup'],
        colors: ['#f59e0b', '#78350f'], anim: true,
        over(g, c, x) {
            const r = c.r;
            const p = (c.t % 1600) / 1600;
            const sx = x + (-0.28 + 0.56 * p) * r;
            u.ellipse(g, sx, 1.68 * r, 0.06 * r, 0.14 * r, 0.4, 'rgba(255,255,255,0.8)', null);
        },
    },
]);
