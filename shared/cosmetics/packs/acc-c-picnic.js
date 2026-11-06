Cosmetics.define({ pack: 'acc-c-picnic', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'picnic_bib', name: 'Lobster Bib', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(-0.55, 0.4), P(0.55, 0.4), P(0.7, 1.5), P(-0.7, 1.5)], '#ffffff', '#333333', 2);
            u.ellipse(g, 0, 0.95 * r, 0.3 * r, 0.25 * r, 0, '#e53935', '#333333', 2);
            u.circle(g, -0.36 * r, 0.72 * r, 0.12 * r, '#e53935', '#333333', 2);
            u.circle(g, 0.36 * r, 0.72 * r, 0.12 * r, '#e53935', '#333333', 2);
        }
    },
    {
        id: 'picnic_pizza', name: 'Pizza Slice', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(1.0, 0.3), P(1.7, 0.3), P(1.35, 1.5)], '#ffc84a', '#333333', 2);
            u.line(g, [P(1.0, 0.3), P(1.7, 0.3)], '#c97a2b', 6, 'round');
            u.circle(g, 1.35 * r, 0.7 * r, 0.1 * r, '#c62828', '#333333', 1.5);
            u.circle(g, 1.25 * r, 1.1 * r, 0.09 * r, '#c62828', '#333333', 1.5);
        }
    },
    {
        id: 'picnic_burger', name: 'Burger Pin', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.ellipse(g, 0, 0.5 * r, 0.6 * r, 0.28 * r, 0, '#e8a33d', '#333333', 2);
            u.circle(g, -0.25 * r, 0.42 * r, 0.05 * r, '#ffffff', null);
            u.circle(g, 0.05 * r, 0.36 * r, 0.05 * r, '#ffffff', null);
            u.circle(g, 0.3 * r, 0.44 * r, 0.05 * r, '#ffffff', null);
            u.poly(g, [P(-0.55, 0.72), P(0.55, 0.72), P(0.55, 0.84), P(-0.55, 0.84)], '#66bb6a', '#333333', 2);
            u.poly(g, [P(-0.5, 0.84), P(0.5, 0.84), P(0.5, 1.02), P(-0.5, 1.02)], '#6d4c41', '#333333', 2);
            u.poly(g, [P(-0.5, 1.02), P(0.5, 1.02), P(0.5, 1.12), P(-0.5, 1.12)], '#e53935', '#333333', 2);
            u.poly(g, [P(-0.6, 1.12), P(0.6, 1.12), P(0.5, 1.36), P(-0.5, 1.36)], '#e8a33d', '#333333', 2);
        }
    },
    {
        id: 'picnic_cone', name: 'Ice Cream Cone', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(1.1, 0.3), P(1.5, 0.3), P(1.3, 1.5)], '#d4a056', '#333333', 2);
            u.line(g, [P(1.2, 0.6), P(1.4, 0.6)], '#8d5a2b', 2);
            u.line(g, [P(1.15, 0.9), P(1.45, 0.9)], '#8d5a2b', 2);
            u.circle(g, 1.3 * r, 0.2 * r, 0.28 * r, '#f48fb1', '#333333', 2);
        }
    },
    {
        id: 'picnic_napkin', name: 'Napkin Tuck', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(-0.6, 0.45), P(0.6, 0.45), P(0, 1.3)], '#ffffff', '#333333', 2);
            u.line(g, [P(-0.4, 0.62), P(0.4, 0.62)], '#e53935', 3);
        }
    },
    {
        id: 'picnic_fries', name: 'Fry Box', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(1.02, -0.05), P(1.18, -0.05), P(1.18, 0.4), P(1.02, 0.4)], '#ffd54f', '#8a6d00', 1.5);
            u.poly(g, [P(1.22, -0.25), P(1.38, -0.25), P(1.38, 0.4), P(1.22, 0.4)], '#ffd54f', '#8a6d00', 1.5);
            u.poly(g, [P(1.42, -0.05), P(1.58, -0.05), P(1.58, 0.4), P(1.42, 0.4)], '#ffd54f', '#8a6d00', 1.5);
            u.poly(g, [P(1.0, 0.3), P(1.6, 0.3), P(1.5, 1.5), P(1.1, 1.5)], '#e53935', '#333333', 2);
            u.line(g, [P(1.04, 0.75), P(1.56, 0.75)], '#ffffff', 4);
        }
    },
    {
        id: 'picnic_chef', name: 'Chef Scarf', rarity: 'common', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            u.poly(g, [P(-0.65, 0.4), P(0.65, 0.4), P(0.6, 0.7), P(-0.6, 0.7)], '#e53935', '#333333', 2);
            u.poly(g, [P(0.1, 0.7), P(0.5, 0.7), P(0.35, 1.45)], '#c62828', '#333333', 2);
            u.circle(g, -0.3 * r, 0.55 * r, 0.08 * r, '#ffffff', null);
            u.circle(g, 0.05 * r, 0.6 * r, 0.08 * r, '#ffffff', null);
        }
    },
    {
        id: 'picnic_sushi', name: 'Sushi Charm', rarity: 'rare', tags: ['food', 'picnic'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 1.05 * r, 0.45 * r, '#263238', '#333333', 2);
            u.circle(g, 0, 1.05 * r, 0.3 * r, '#fafafa', '#333333', 1.5);
            u.ellipse(g, 0, 0.9 * r, 0.3 * r, 0.15 * r, 0, '#ff7043', '#333333', 2);
        }
    },
    {
        id: 'picnic_cake', name: 'Birthday Cake', rarity: 'epic', tags: ['food', 'party'], anim: true,
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            const fl = Math.sin(c.t / 120);
            u.poly(g, [P(1.0, 0.9), P(1.6, 0.9), P(1.6, 1.5), P(1.0, 1.5)], '#f8bbd0', '#333333', 2);
            u.poly(g, [P(0.95, 0.85), P(1.65, 0.85), P(1.65, 1.0), P(0.95, 1.0)], '#ffffff', '#333333', 2);
            u.poly(g, [P(1.24, 0.45), P(1.36, 0.45), P(1.36, 0.9), P(1.24, 0.9)], '#42a5f5', '#333333', 1.5);
            u.ellipse(g, 1.3 * r, (0.3 - 0.02 * fl) * r, (0.1 + 0.015 * fl) * r, (0.16 + 0.03 * fl) * r, 0, '#ff9800', '#333333', 1.5);
            u.circle(g, 1.3 * r, 0.36 * r, 0.06 * r, '#ffeb3b', null);
        }
    },
    {
        id: 'picnic_golden', name: 'Golden Fork', rarity: 'legendary', tags: ['food', 'fancy'], anim: true,
        draw(g, c) {
            const r = c.r; const P = (x, y) => [x * r, y * r];
            const tw = 0.5 + 0.5 * Math.sin(c.t / 200);
            const tw2 = 0.5 + 0.5 * Math.sin(c.t / 200 + 2);
            u.poly(g, [P(1.25, 0.3), P(1.45, 0.3), P(1.4, 1.6), P(1.3, 1.6)], '#ffd700', '#8a6d00', 2);
            u.poly(g, [P(1.0, -0.45), P(1.14, -0.45), P(1.14, 0.1), P(1.0, 0.1)], '#ffd700', '#8a6d00', 2);
            u.poly(g, [P(1.28, -0.45), P(1.42, -0.45), P(1.42, 0.1), P(1.28, 0.1)], '#ffd700', '#8a6d00', 2);
            u.poly(g, [P(1.56, -0.45), P(1.7, -0.45), P(1.7, 0.1), P(1.56, 0.1)], '#ffd700', '#8a6d00', 2);
            u.poly(g, [P(1.0, 0.0), P(1.7, 0.0), P(1.66, 0.3), P(1.04, 0.3)], '#ffd700', '#8a6d00', 2);
            u.star(g, -1.2 * r, -0.8 * r, (0.2 + 0.1 * tw) * r, 0.1 * r, 4, '#fffde7', '#d4a017', 1.5);
            u.star(g, -0.8 * r, -1.3 * r, (0.15 + 0.1 * tw2) * r, 0.08 * r, 4, '#fffde7', '#d4a017', 1.5);
        }
    }
]);
