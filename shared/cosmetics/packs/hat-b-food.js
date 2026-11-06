Cosmetics.define({ pack: 'hat-b-food', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'food_chef', name: 'Chef Toque', rarity: 'common', tags: ['chef', 'white', 'kitchen'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, -0.5 * r, -1.85 * r, 0.6 * r, '#ffffff', '#bdbdbd', 0.05 * r);
            u.circle(g, 0.5 * r, -1.85 * r, 0.6 * r, '#ffffff', '#bdbdbd', 0.05 * r);
            u.circle(g, 0, -2.25 * r, 0.6 * r, '#ffffff', '#bdbdbd', 0.05 * r);
            u.rect(g, -0.6 * r, -1.95 * r, 1.2 * r, 0.9 * r, '#ffffff');
            u.rect(g, -0.55 * r, -1.25 * r, 1.1 * r, 0.25 * r, '#eeeeee', '#bdbdbd', 0.05 * r);
        }
    },
    {
        id: 'food_pizza', name: 'Pizza Slice', rarity: 'common', tags: ['pizza', 'cheese', 'red'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.0 * r, -2.0 * r], [1.0 * r, -2.0 * r], [0, -1.0 * r]], '#ffd54f', '#f9a825', 0.06 * r);
            u.rect(g, -1.05 * r, -2.1 * r, 2.1 * r, 0.2 * r, '#d7a24a', '#a1672a', 0.04 * r);
            u.circle(g, -0.4 * r, -1.7 * r, 0.16 * r, '#c62828');
            u.circle(g, 0.3 * r, -1.6 * r, 0.16 * r, '#c62828');
            u.circle(g, 0, -1.3 * r, 0.13 * r, '#c62828');
        }
    },
    {
        id: 'food_burger', name: 'Burger Bun', rarity: 'common', tags: ['burger', 'bun', 'lettuce'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.95 * r, 0.95 * r, 0.5 * r, 0, '#d98e3a');
            u.circle(g, -0.35 * r, -2.1 * r, 0.06 * r, '#ffffff');
            u.circle(g, 0.1 * r, -2.2 * r, 0.06 * r, '#ffffff');
            u.circle(g, 0.4 * r, -2.05 * r, 0.06 * r, '#ffffff');
            u.poly(g, [[-1.0 * r, -1.5 * r], [-0.6 * r, -1.6 * r], [-0.2 * r, -1.45 * r], [0.2 * r, -1.6 * r], [0.6 * r, -1.45 * r], [1.0 * r, -1.5 * r], [1.0 * r, -1.35 * r], [-1.0 * r, -1.35 * r]], '#66bb6a');
            u.rect(g, -0.9 * r, -1.35 * r, 1.8 * r, 0.22 * r, '#6d4c41');
            u.rect(g, -0.9 * r, -1.13 * r, 1.8 * r, 0.2 * r, '#d98e3a', '#a1672a', 0.04 * r);
        }
    },
    {
        id: 'food_donut', name: 'Donut Ring', rarity: 'rare', tags: ['donut', 'pink', 'sprinkles'], clearTop: true,
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.35 * r, 0.75 * r, 0.35 * r, 0, '#f8bbd0', '#ad1457', 0.1 * r);
            u.ellipse(g, 0, -1.35 * r, 0.25 * r, 0.12 * r, 0, null, '#ad1457', 0.06 * r);
            u.rect(g, -0.55 * r, -1.6 * r, 0.12 * r, 0.05 * r, '#42a5f5');
            u.rect(g, 0.4 * r, -1.6 * r, 0.12 * r, 0.05 * r, '#ffee58');
            u.rect(g, -0.1 * r, -1.7 * r, 0.12 * r, 0.05 * r, '#66bb6a');
            u.rect(g, 0.3 * r, -1.2 * r, 0.12 * r, 0.05 * r, '#ab47bc');
        }
    },
    {
        id: 'food_icecream', name: 'Ice Cream Cone', rarity: 'common', tags: ['icecream', 'waffle', 'strawberry'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.55 * r, -1.8 * r], [0.55 * r, -1.8 * r], [0, -1.0 * r]], '#d7a24a', '#a1672a', 0.05 * r);
            u.line(g, [[-0.4 * r, -1.75 * r], [0.15 * r, -1.3 * r]], '#a1672a', 0.04 * r);
            u.line(g, [[0.4 * r, -1.75 * r], [-0.15 * r, -1.3 * r]], '#a1672a', 0.04 * r);
            u.circle(g, 0, -2.1 * r, 0.55 * r, '#f06292', '#c2185b', 0.05 * r);
        }
    },
    {
        id: 'food_sushi', name: 'Sushi Roll', rarity: 'rare', tags: ['sushi', 'salmon', 'rice'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.7 * r, -1.45 * r, 1.4 * r, 0.45 * r, '#fafafa', '#bdbdbd', 0.05 * r);
            u.rect(g, -0.7 * r, -1.25 * r, 1.4 * r, 0.2 * r, '#2e7d32');
            u.ellipse(g, 0, -1.65 * r, 0.95 * r, 0.3 * r, 0, '#ff7043', '#e64a19', 0.05 * r);
            u.line(g, [[-0.5 * r, -1.7 * r], [-0.1 * r, -1.6 * r], [0.3 * r, -1.7 * r]], '#ffccbc', 0.05 * r, 'round');
        }
    },
    {
        id: 'food_taco', name: 'Taco Hat', rarity: 'common', tags: ['taco', 'yellow', 'lettuce'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.2 * r, -1.0 * r], [-0.9 * r, -1.9 * r], [0, -2.4 * r], [0.9 * r, -1.9 * r], [1.2 * r, -1.0 * r]], '#fdd835', '#f9a825', 0.06 * r);
            u.poly(g, [[-1.2 * r, -1.05 * r], [-0.8 * r, -0.8 * r], [-0.4 * r, -1.1 * r], [0, -0.8 * r], [0.4 * r, -1.1 * r], [0.8 * r, -0.8 * r], [1.2 * r, -1.05 * r], [1.2 * r, -0.95 * r], [-1.2 * r, -0.95 * r]], '#66bb6a');
            u.circle(g, -0.3 * r, -1.7 * r, 0.12 * r, '#e53935');
            u.circle(g, 0.4 * r, -1.9 * r, 0.12 * r, '#e53935');
        }
    },
    {
        id: 'food_egg', name: 'Fried Egg', rarity: 'common', tags: ['egg', 'breakfast', 'yolk'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.6 * r, 1.1 * r, 0.6 * r, 0, '#ffffff', '#e0e0e0', 0.05 * r);
            u.circle(g, 0.1 * r, -1.65 * r, 0.4 * r, '#ffb300', '#f57f17', 0.04 * r);
        }
    },
    {
        id: 'food_cake', name: 'Birthday Cake', rarity: 'epic', tags: ['cake', 'candles', 'pink', 'anim'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.75 * r, -1.35 * r, 1.5 * r, 0.35 * r, '#f8bbd0', '#ec407a', 0.04 * r);
            u.rect(g, -0.55 * r, -1.7 * r, 1.1 * r, 0.35 * r, '#f48fb1', '#ec407a', 0.04 * r);
            u.rect(g, -0.35 * r, -2.0 * r, 0.7 * r, 0.3 * r, '#ec407a', '#ad1457', 0.04 * r);
            u.rect(g, -0.2 * r, -2.3 * r, 0.08 * r, 0.3 * r, '#ffffff');
            u.rect(g, -0.04 * r, -2.3 * r, 0.08 * r, 0.3 * r, '#ffffff');
            u.rect(g, 0.12 * r, -2.3 * r, 0.08 * r, 0.3 * r, '#ffffff');
            const flick = 0.03 * r * Math.sin(c.t / 120);
            u.ellipse(g, -0.16 * r, -2.45 * r, 0.08 * r, 0.14 * r + flick, 0, '#ff9800');
            u.ellipse(g, 0, -2.5 * r, 0.09 * r, 0.16 * r - flick, 0, '#ffca28');
            u.ellipse(g, 0.16 * r, -2.45 * r, 0.08 * r, 0.14 * r + flick, 0, '#ff9800');
        }
    },
    {
        id: 'food_goldcrust', name: 'Golden Crust', rarity: 'legendary', tags: ['pie', 'gold', 'crown', 'anim'], anim: true,
        draw(g, c) {
            const r = c.r;
            const gold = u.linear(g, -1.2 * r, -2.5 * r, 1.2 * r, -1.1 * r, ['#ffe082', '#f9a825']);
            u.poly(g, [[-1.2 * r, -1.1 * r], [-1.3 * r, -2.2 * r], [-0.6 * r, -1.6 * r], [0, -2.5 * r], [0.6 * r, -1.6 * r], [1.3 * r, -2.2 * r], [1.2 * r, -1.1 * r]], gold, '#8d6e63', 0.06 * r);
            u.line(g, [[-0.9 * r, -1.25 * r], [0, -1.25 * r], [0.9 * r, -1.25 * r]], '#a1672a', 0.05 * r);
            u.circle(g, 0, -1.9 * r, 0.12 * r, '#e53935');
            const wob = 0.1 * r * Math.sin(c.t / 300);
            u.line(g, [[-0.4 * r, -2.7 * r], [-0.4 * r + wob, -2.9 * r], [-0.4 * r, -3.1 * r]], 'rgba(255,255,255,0.85)', 0.07 * r, 'round');
            u.line(g, [[0.4 * r, -2.7 * r], [0.4 * r - wob, -2.9 * r], [0.4 * r, -3.1 * r]], 'rgba(255,255,255,0.85)', 0.07 * r, 'round');
            const tw = 0.5 + 0.5 * Math.sin(c.t / 200);
            u.star(g, -1.3 * r, -2.6 * r, (0.15 + 0.08 * tw) * r, 0.05 * r, 4, '#fff59d');
            u.star(g, 1.3 * r, -2.8 * r, (0.12 + 0.08 * (1 - tw)) * r, 0.05 * r, 4, '#fff59d');
        }
    },
]);
