Cosmetics.define({ pack: 'hat-b-royal', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'royal_tiara', name: 'Tiara', rarity: 'rare', tags: ['royal', 'silver'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.75 * r, -1.2 * r], [-0.55 * r, -1.6 * r], [-0.35 * r, -1.2 * r]], '#e0e7ea', '#90a4ae', 0.03 * r);
            u.poly(g, [[-0.2 * r, -1.2 * r], [0, -1.8 * r], [0.2 * r, -1.2 * r]], '#e0e7ea', '#90a4ae', 0.03 * r);
            u.poly(g, [[0.35 * r, -1.2 * r], [0.55 * r, -1.6 * r], [0.75 * r, -1.2 * r]], '#e0e7ea', '#90a4ae', 0.03 * r);
            u.rect(g, -0.75 * r, -1.2 * r, 1.5 * r, 0.2 * r, '#cfd8dc', '#90a4ae', 0.03 * r);
            u.circle(g, 0, -1.12 * r, 0.12 * r, '#ec407a', '#880e4f', 0.02 * r);
        }
    },
    {
        id: 'royal_jester', name: 'Jester Cap', rarity: 'common', tags: ['jester', 'fun'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.6 * r, -1.15 * r], [-1.1 * r, -1.9 * r], [-0.9 * r, -2.2 * r], [-0.4 * r, -1.5 * r]], '#e53935');
            u.poly(g, [[0.6 * r, -1.15 * r], [1.1 * r, -1.9 * r], [0.9 * r, -2.2 * r], [0.4 * r, -1.5 * r]], '#fdd835');
            u.poly(g, [[-0.2 * r, -1.3 * r], [0, -2.5 * r], [0.2 * r, -1.3 * r]], '#e53935');
            u.circle(g, -0.9 * r, -2.2 * r, 0.14 * r, '#ffd54f', '#f9a825', 0.02 * r);
            u.circle(g, 0.9 * r, -2.2 * r, 0.14 * r, '#ffd54f', '#f9a825', 0.02 * r);
            u.circle(g, 0, -2.5 * r, 0.14 * r, '#ffd54f', '#f9a825', 0.02 * r);
            u.rect(g, -0.6 * r, -1.15 * r, 1.2 * r, 0.15 * r, '#fdd835');
        }
    },
    {
        id: 'royal_guard', name: 'Palace Guard', rarity: 'common', tags: ['guard', 'black'],
        draw(g, c) {
            const r = c.r;
            const rnd = u.rng(5);
            u.ellipse(g, 0, -1.98 * r, 0.72 * r, 0.98 * r, 0, '#212121', '#000000', 0.03 * r);
            for (let i = 0; i < 10; i++) {
                const x = (rnd() * 2 - 1) * 0.6 * r;
                const y = -2.6 * r + rnd() * 1.4 * r;
                u.line(g, [[x, y], [x + 0.05 * r, y + 0.2 * r]], '#424242', 0.03 * r);
            }
            u.line(g, [[-0.66 * r, -1.2 * r], [-0.55 * r, -0.6 * r]], '#fdd835', 0.06 * r);
            u.line(g, [[0.66 * r, -1.2 * r], [0.55 * r, -0.6 * r]], '#fdd835', 0.06 * r);
            u.rect(g, -0.2 * r, -1.2 * r, 0.4 * r, 0.2 * r, '#fdd835');
        }
    },
    {
        id: 'royal_laurel', name: 'Roman Wreath', rarity: 'common', tags: ['roman', 'green'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.95 * r, -1.1 * r], [0, -1.2 * r], [0.95 * r, -1.1 * r]], '#2e7d32', 0.14 * r, 'round');
            for (let i = 0; i < 7; i++) {
                const t = -1 + i / 3;
                const x = t * 0.9 * r;
                const y = -1.25 * r - (1 - t * t) * 0.2 * r;
                u.ellipse(g, x, y, 0.18 * r, 0.08 * r, t * 0.8, '#43a047', '#1b5e20', 0.02 * r);
            }
            u.poly(g, [[-0.1 * r, -1.0 * r], [-0.3 * r, -0.7 * r], [-0.2 * r, -0.6 * r], [0, -0.9 * r]], '#d32f2f');
            u.poly(g, [[0.1 * r, -1.0 * r], [0.3 * r, -0.7 * r], [0.2 * r, -0.6 * r], [0, -0.9 * r]], '#d32f2f');
            u.circle(g, 0, -1.05 * r, 0.12 * r, '#d32f2f', '#7f0000', 0.02 * r);
        }
    },
    {
        id: 'royal_turban', name: 'Sultan Turban', rarity: 'rare', tags: ['sultan', 'purple'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.45 * r, 0.95 * r, 0.45 * r, 0, '#7b1fa2', '#4a0072', 0.04 * r);
            u.line(g, [[-0.9 * r, -1.3 * r], [0.9 * r, -1.15 * r]], '#ce93d8', 0.06 * r);
            u.line(g, [[-0.9 * r, -1.15 * r], [0.9 * r, -1.0 * r]], '#ce93d8', 0.06 * r);
            u.circle(g, 0, -1.5 * r, 0.14 * r, '#ffd54f', '#ff6f00', 0.03 * r);
            u.ellipse(g, 0.45 * r * c.look, -2.1 * r, 0.12 * r, 0.55 * r, 0.35 * c.look, '#ef5350');
        }
    },
    {
        id: 'royal_samurai', name: 'Kabuto', rarity: 'epic', tags: ['samurai', 'red'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.5 * r, 0.95 * r, 0.5 * r, 0, '#8b0000', '#4a0000', 0.04 * r);
            u.poly(g, [[-0.35 * r, -1.3 * r], [0, -1.05 * r], [0.35 * r, -1.3 * r], [0.25 * r, -1.1 * r], [-0.25 * r, -1.1 * r]], '#5d0000');
            u.poly(g, [[-0.15 * r, -1.9 * r], [-0.9 * r, -2.7 * r], [-0.75 * r, -2.8 * r], [-0.05 * r, -2.0 * r]], '#ffd700', '#b8860b', 0.03 * r);
            u.poly(g, [[0.15 * r, -1.9 * r], [0.9 * r, -2.7 * r], [0.75 * r, -2.8 * r], [0.05 * r, -2.0 * r]], '#ffd700', '#b8860b', 0.03 * r);
            u.rect(g, -0.05 * r, -1.9 * r, 0.1 * r, 0.6 * r, '#ffd700');
        }
    },
    {
        id: 'royal_mitre', name: 'Bishop Mitre', rarity: 'common', tags: ['bishop', 'white'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.65 * r, -1.0 * r], [-0.45 * r, -2.3 * r], [0, -2.5 * r], [0.45 * r, -2.3 * r], [0.65 * r, -1.0 * r]], '#fafafa', '#b0bec5', 0.03 * r);
            u.rect(g, -0.65 * r, -1.25 * r, 1.3 * r, 0.2 * r, '#ffc107');
            u.rect(g, -0.05 * r, -2.1 * r, 0.1 * r, 0.5 * r, '#ffc107');
            u.rect(g, -0.2 * r, -1.85 * r, 0.4 * r, 0.1 * r, '#ffc107');
        }
    },
    {
        id: 'royal_pharaoh', name: 'Pharaoh', rarity: 'rare', tags: ['pharaoh', 'blue'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.85 * r, -1.0 * r], [-0.95 * r, -1.8 * r], [-0.6 * r, -2.1 * r], [0.6 * r, -2.1 * r], [0.95 * r, -1.8 * r], [0.85 * r, -1.0 * r]], '#1e88e5', '#0d47a1', 0.03 * r);
            u.line(g, [[-0.9 * r, -1.6 * r], [0.9 * r, -1.6 * r]], '#ffca28', 0.08 * r);
            u.line(g, [[-0.9 * r, -1.35 * r], [0.9 * r, -1.35 * r]], '#ffca28', 0.08 * r);
            u.ellipse(g, 0, -2.25 * r, 0.2 * r, 0.28 * r, 0, '#ffca28', '#b8860b', 0.02 * r);
            u.poly(g, [[-0.15 * r, -2.1 * r], [0, -2.6 * r], [0.15 * r, -2.1 * r]], '#ffca28', '#b8860b', 0.02 * r);
        }
    },
    {
        id: 'royal_admiral', name: 'Admiral', rarity: 'common', tags: ['admiral', 'navy'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.3 * r, -1.1 * r], [-0.7 * r, -1.9 * r], [0, -2.0 * r], [0.7 * r, -1.9 * r], [1.3 * r, -1.1 * r], [0.8 * r, -1.0 * r], [-0.8 * r, -1.0 * r]], '#1a237e', '#0d1452', 0.04 * r);
            u.line(g, [[-1.25 * r, -1.1 * r], [-0.7 * r, -1.85 * r], [0, -1.95 * r], [0.7 * r, -1.85 * r], [1.25 * r, -1.1 * r]], '#ffc107', 0.06 * r);
            u.circle(g, 0, -1.9 * r, 0.14 * r, '#e53935', '#ffc107', 0.03 * r);
        }
    },
    {
        id: 'royal_emperor', name: 'Emperor Crown', rarity: 'legendary', tags: ['emperor', 'gold'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.0 * r, -1.3 * r], [-1.0 * r, -2.2 * r], [-0.7 * r, -1.75 * r], [-0.45 * r, -2.6 * r], [-0.2 * r, -1.8 * r], [0, -2.9 * r], [0.2 * r, -1.8 * r], [0.45 * r, -2.6 * r], [0.7 * r, -1.75 * r], [1.0 * r, -2.2 * r], [1.0 * r, -1.3 * r]], '#ffd700', '#b8860b', 0.04 * r);
            u.rect(g, -1.0 * r, -1.3 * r, 2.0 * r, 0.3 * r, '#ffc107', '#b8860b', 0.04 * r);
            u.circle(g, 0, -1.65 * r, 0.12 * r, '#d50000', '#7f0000', 0.02 * r);
            u.circle(g, -0.6 * r, -1.15 * r, 0.09 * r, '#d50000', '#7f0000', 0.02 * r);
            u.circle(g, 0.6 * r, -1.15 * r, 0.09 * r, '#d50000', '#7f0000', 0.02 * r);
            const a = 0.3 + 0.3 * Math.sin(c.t / 300);
            u.circle(g, 0, -2.0 * r, 0.9 * r, `rgba(255,255,255,${a.toFixed(3)})`);
        }
    },
]);
