Cosmetics.define({ pack: 'ball-d-food', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'food_pizza', name: 'Pizza', rarity: 'common', tags: ['food', 'pizza'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffd54f', '#f9a825', 2);
            u.circle(g, -0.4 * r, -0.2 * r, 0.22 * r, '#e53935', null);
            u.circle(g, 0.3 * r, -0.4 * r, 0.22 * r, '#e53935', null);
            u.circle(g, 0.1 * r, 0.35 * r, 0.22 * r, '#e53935', null);
            u.circle(g, 0.55 * r, 0.2 * r, 0.2 * r, '#e53935', null);
        }
    },
    {
        id: 'food_donut', name: 'Donut', rarity: 'common', tags: ['food', 'donut'],
        draw(g, c) {
            const r = c.r;
            const rnd = u.rng(5);
            const cols = ['#ffffff', '#42a5f5', '#ffee58', '#66bb6a'];
            u.circle(g, 0, 0, r, '#f48fb1', '#c2185b', 2);
            for (let i = 0; i < 10; i++) {
                const a = rnd() * Math.PI * 2;
                const d = (0.55 + rnd() * 0.25) * r;
                const x = Math.cos(a) * d;
                const y = Math.sin(a) * d;
                u.line(g, [[x, y], [x + 0.08 * r * Math.cos(a + 1), y + 0.08 * r * Math.sin(a + 1)]], cols[i % 4], 0.1 * r, 'round');
            }
            u.circle(g, 0, 0, 0.3 * r, '#fff3e0', '#c2185b', 2);
        }
    },
    {
        id: 'food_cookie', name: 'Cookie', rarity: 'common', tags: ['food', 'cookie'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#d7a86e', '#8d5b2e', 2);
            const chips = [[-0.4, -0.3], [0.3, -0.45], [0.45, 0.1], [-0.1, 0.1], [-0.35, 0.45], [0.15, 0.5]];
            for (const [x, y] of chips) {
                u.circle(g, x * r, y * r, 0.14 * r, '#3e2723', null);
            }
        }
    },
    {
        id: 'food_orange', name: 'Orange', rarity: 'common', tags: ['food', 'orange', 'fruit'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ff9800', '#e65100', 2);
            u.line(g, [[0, -0.95 * r], [0.05 * r, -1.15 * r]], '#5d4037', 0.08 * r, 'round');
            u.ellipse(g, 0.2 * r, -1.0 * r, 0.3 * r, 0.14 * r, -0.4, '#43a047', null);
        }
    },
    {
        id: 'food_watermelon', name: 'Watermelon Slice', rarity: 'common', tags: ['food', 'watermelon', 'fruit'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#2e7d32', null);
            u.circle(g, 0, 0, 0.8 * r, '#ef5350', null);
            const seeds = [[-0.4, -0.3], [0.4, -0.3], [0, -0.15], [-0.45, 0.1], [0.45, 0.1], [-0.2, 0.3], [0.2, 0.3], [0, 0.5]];
            for (const [x, y] of seeds) {
                u.ellipse(g, x * r, y * r, 0.05 * r, 0.09 * r, 0, '#212121', null);
            }
        }
    },
    {
        id: 'food_egg', name: 'Fried Egg', rarity: 'common', tags: ['food', 'egg'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 0, 0.95 * r, 0.8 * r, 0, '#ffffff', '#e0e0e0', 2);
            u.circle(g, 0, 0, 0.35 * r, '#ffca28', '#f9a825', 2);
        }
    },
    {
        id: 'food_cheese', name: 'Cheese', rarity: 'rare', tags: ['food', 'cheese'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffee58', '#fbc02d', 2);
            u.circle(g, -0.45 * r, -0.25 * r, 0.2 * r, '#fbc02d', null);
            u.circle(g, 0.3 * r, -0.4 * r, 0.14 * r, '#fbc02d', null);
            u.circle(g, 0.4 * r, 0.3 * r, 0.2 * r, '#fbc02d', null);
            u.circle(g, -0.1 * r, 0.4 * r, 0.13 * r, '#fbc02d', null);
            u.circle(g, 0, -0.05 * r, 0.12 * r, '#fbc02d', null);
        }
    },
    {
        id: 'food_burger', name: 'Burger', rarity: 'rare', tags: ['food', 'burger'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#d7a05a', null);
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            u.rect(g, -r, -0.6 * r, 2 * r, 0.45 * r, '#d7a05a', null);
            u.rect(g, -r, -0.15 * r, 2 * r, 0.25 * r, '#43a047', null);
            u.rect(g, -r, 0.1 * r, 2 * r, 0.3 * r, '#5d4037', null);
            u.rect(g, -r, 0.4 * r, 2 * r, 0.6 * r, '#d7a05a', null);
            g.restore();
            u.circle(g, 0, 0, r, null, '#8d5524', 2);
        }
    },
    {
        id: 'food_sushi', name: 'Sushi Roll', rarity: 'rare', tags: ['food', 'sushi'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#1b1b1b', null);
            u.circle(g, 0, 0, 0.78 * r, '#ffffff', null);
            u.circle(g, 0, 0, 0.4 * r, '#ff7043', null);
        }
    },
    {
        id: 'food_goldegg', name: 'Golden Egg', rarity: 'epic', tags: ['food', 'egg', 'gold'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r,
                u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#fff9c4', '#ffd54f', '#b8860b']),
                '#8d6e00', 2);
            u.ellipse(g, -0.35 * r, -0.35 * r, 0.22 * r, 0.14 * r, -0.6, 'rgba(255,255,255,0.9)', null);
            u.circle(g, -0.2 * r, -0.5 * r, 0.07 * r, 'rgba(255,255,255,0.95)', null);
        }
    },
]);
