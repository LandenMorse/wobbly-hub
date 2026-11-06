Cosmetics.define({ pack: 'skin-a-fruit', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'fruit_lime', name: 'Lime', rarity: 'common', tags: ['fruit', 'green'],
        fill: '#a3e635', pattern: [['dots', '#ecfccb', 0.1, 0.45], ['collar', '#3f6212']]
    },
    {
        id: 'fruit_cherry', name: 'Cherry', rarity: 'common', tags: ['fruit', 'red'],
        fill: '#b71c1c',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.4 * r, -0.3 * r, 0.22 * r, 0.55 * r, 0.25, 'rgba(255,255,255,0.5)');
        }
    },
    {
        id: 'fruit_orange', name: 'Orange', rarity: 'common', tags: ['fruit', 'orange'],
        fill: '#ff9800', pattern: [['dots', '#e65100', 0.08, 0.4]]
    },
    {
        id: 'fruit_blueberry', name: 'Blueberry', rarity: 'common', tags: ['fruit', 'blue'],
        fill: '#4f5b8a',
        draw(g, c) {
            const r = c.r;
            u.star(g, 0, 0.75 * r, 0.28 * r, 0.12 * r, 5, '#1f2a4d');
        }
    },
    {
        id: 'fruit_banana', name: 'Banana', rarity: 'common', tags: ['fruit', 'yellow'],
        fill: '#fdd835', pattern: [['band', '#5d4037', -1.0, 0.18], ['band', '#5d4037', 1.5, 0.18]]
    },
    {
        id: 'fruit_grape', name: 'Grape Bunch', rarity: 'common', tags: ['fruit', 'purple'],
        fill: '#6a1b9a', pattern: ['blobs', ['#8e24aa', '#ab47bc', '#4a148c'], 14, 7]
    },
    {
        id: 'fruit_strawberry', name: 'Strawberry', rarity: 'rare', tags: ['fruit', 'red'],
        fill: '#e53935', pattern: [['dots', '#fff176', 0.09, 0.5], ['collar', '#2e7d32']],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.poly(g, [[0, -1.2 * r], [s * 0.9 * r, -1.5 * r], [s * 0.6 * r, -1.0 * r]], '#43a047');
        }
    },
    {
        id: 'fruit_kiwi', name: 'Kiwi', rarity: 'rare', tags: ['fruit', 'brown'],
        fill: '#8d6e63', pattern: [['dots', '#5d4037', 0.07, 0.35]],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 0.2 * r, 0.6 * r, 0.95 * r, 0, null, '#7cb342', 0.12 * r);
            u.ellipse(g, 0, 0.2 * r, 0.3 * r, 0.5 * r, 0, '#c5e1a5', null);
        }
    },
    {
        id: 'fruit_dragon', name: 'Dragonfruit', rarity: 'epic', tags: ['fruit', 'pink'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#ff4fa3', '#c2185b']),
        draw(g, c) {
            const r = c.r, rnd = u.rng(3);
            for (let i = 0; i < 14; i++) u.ellipse(g, (rnd() * 1.8 - 0.9) * r, (rnd() * 2.6 - 1.0) * r, 0.05 * r, 0.09 * r, 0, '#1b1b1b');
        },
        extras(g, c) { const r = c.r; for (const s of [-1, 1]) u.poly(g, [[s * 0.9 * r, -0.2 * r], [s * 1.35 * r, -0.5 * r], [s * 0.95 * r, 0.2 * r]], '#7cb342'); }
    },
    {
        id: 'fruit_golden', name: 'Golden Apple', rarity: 'common', tags: ['fruit', 'gold'],
        fill: '#ffd54f',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.4 * r, -0.3 * r, 0.18 * r, 0.35 * r, 0.3, 'rgba(255,255,255,0.6)');
        },
        extras(g, c) {
            const r = c.r;
            u.line(g, [[0, -1.3 * r], [0.15 * r, -1.8 * r]], '#5d4037', 0.1 * r, 'round');
            u.poly(g, [[0.15 * r, -1.7 * r], [0.7 * r, -2.1 * r], [0.6 * r, -1.55 * r]], '#43a047');
        }
    },
]);
