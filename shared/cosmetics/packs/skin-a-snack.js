Cosmetics.define({ pack: 'skin-a-snack', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'snack_pizza', name: 'Pizza', rarity: 'common', tags: ['food', 'tan'],
        fill: '#e8b45c',
        draw(g, c) {
            const r = c.r;
            const spots = [[-0.45, -0.3], [0.35, -0.25], [-0.1, 0.25], [0.55, 0.45], [-0.55, 0.55], [0.1, 0.8]];
            for (const [x, y] of spots) u.circle(g, x * r, y * r, 0.17 * r, '#c62828', '#8e0000', 0.04 * r);
        }
    },
    {
        id: 'snack_burger', name: 'Burger', rarity: 'common', tags: ['food', 'bun'],
        fill: '#d89a4a',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1 * r, -0.1 * r, 2 * r, 0.22 * r, '#66bb6a');
            u.rect(g, -1 * r, 0.22 * r, 2 * r, 0.3 * r, '#5d3a1a');
            u.rect(g, -1 * r, 0.62 * r, 2 * r, 0.16 * r, '#66bb6a');
        }
    },
    {
        id: 'snack_fries', name: 'Fries', rarity: 'common', tags: ['food', 'red'],
        fill: '#fdd835',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1 * r, 0.35 * r, 2 * r, 1.4 * r, '#d32f2f');
            for (const x of [-0.5, 0, 0.5]) u.line(g, [[x * r, 0.5 * r], [x * r, 1.6 * r]], '#ffee58', 0.14 * r);
        },
        extras(g, c) {
            const r = c.r;
            for (const x of [-0.5, 0, 0.5]) u.rect(g, (x - 0.08) * r, -2.4 * r, 0.16 * r, 1.0 * r, '#ffeb3b');
        }
    },
    {
        id: 'snack_taco', name: 'Taco', rarity: 'common', tags: ['food', 'yellow'],
        fill: '#fbc02d',
        pattern: [['blobs', ['#43a047', '#e53935'], 6, 7]]
    },
    {
        id: 'snack_sushi', name: 'Sushi', rarity: 'common', tags: ['food', 'white'],
        fill: '#fafafa',
        pattern: [['band', '#1b1b1b', 0.2, 0.45]]
    },
    {
        id: 'snack_pretzel', name: 'Pretzel', rarity: 'common', tags: ['food', 'brown'],
        fill: '#8d5524',
        pattern: [['dots', '#f5f5f5', 0.12, 0.5]]
    },
    {
        id: 'snack_hotdog', name: 'Hot Dog', rarity: 'rare', tags: ['food', 'bun'],
        fill: '#e0a96d',
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.8 * r, -0.2 * r], [-0.4 * r, -0.45 * r], [0, -0.2 * r], [0.4 * r, -0.45 * r], [0.8 * r, -0.2 * r]], '#e53935', 0.14 * r, 'round');
            u.line(g, [[-0.8 * r, 0.4 * r], [-0.4 * r, 0.15 * r], [0, 0.4 * r], [0.4 * r, 0.15 * r], [0.8 * r, 0.4 * r]], '#e53935', 0.14 * r, 'round');
        }
    },
    {
        id: 'snack_cookie', name: 'Cookie', rarity: 'rare', tags: ['food', 'chocolate'],
        fill: '#c8a165',
        draw(g, c) {
            const r = c.r;
            const chips = [[-0.5, -0.4], [0.3, -0.3], [-0.2, 0.2], [0.6, 0.3], [-0.6, 0.7], [0.1, 0.9]];
            for (const [x, y] of chips) u.ellipse(g, x * r, y * r, 0.16 * r, 0.11 * r, 0.4, '#4e2a14');
        }
    },
    {
        id: 'snack_ramen', name: 'Ramen', rarity: 'epic', tags: ['food', 'broth'], anim: true,
        fill: '#ff8f00',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -1 * r, 0.2 * r, 2 * r, 0.25 * r, '#fff8e1');
            u.ellipse(g, -0.3 * r, 0.9 * r, 0.25 * r, 0.12 * r, 0, '#fdd835');
            u.ellipse(g, 0.4 * r, 0.8 * r, 0.22 * r, 0.1 * r, 0, '#e53935');
            u.line(g, [[-0.6 * r, 0.35 * r], [0.6 * r, 0.35 * r]], '#66bb6a', 0.08 * r, 'round');
        },
        extras(g, c) {
            const r = c.r;
            for (let i = 0; i < 3; i++) {
                const x = (-0.6 + i * 0.6) * r;
                const wob = Math.sin(c.t / 400 + i * 1.7) * 0.12 * r;
                u.line(g, [[x, -1.4 * r], [x + wob, -1.9 * r], [x - wob, -2.4 * r]], 'rgba(255,255,255,0.85)', 0.1 * r, 'round');
            }
        }
    },
    {
        id: 'snack_popcorn', name: 'Popcorn', rarity: 'common', tags: ['food', 'red'],
        fill: '#fafafa',
        pattern: [['stripes', '#e53935']],
        draw(g, c) {
            const r = c.r, rnd = u.rng(5);
            for (let i = 0; i < 9; i++) u.circle(g, (rnd() * 1.6 - 0.8) * r, (rnd() * 2.2 - 0.8) * r, 0.1 * r, '#ffd54f');
        }
    },
]);
