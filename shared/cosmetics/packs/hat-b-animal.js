Cosmetics.define({ pack: 'hat-b-animal', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'animal_cat', name: 'Cat Ears', rarity: 'common', tags: ['animal', 'cat'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.95 * r, -1.0 * r], [-0.9 * r, -2.1 * r], [-0.2 * r, -1.2 * r]], '#ff9800', '#e65100', 0.05 * r);
            u.poly(g, [[0.95 * r, -1.0 * r], [0.9 * r, -2.1 * r], [0.2 * r, -1.2 * r]], '#ff9800', '#e65100', 0.05 * r);
            u.poly(g, [[-0.8 * r, -1.1 * r], [-0.78 * r, -1.85 * r], [-0.35 * r, -1.25 * r]], '#f48fb1');
            u.poly(g, [[0.8 * r, -1.1 * r], [0.78 * r, -1.85 * r], [0.35 * r, -1.25 * r]], '#f48fb1');
        }
    },
    {
        id: 'animal_dog', name: 'Puppy Ears', rarity: 'common', tags: ['animal', 'dog'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -1.0 * r, -1.6 * r, 0.32 * r, 0.6 * r, 0.3, '#6d4c41', '#3e2723', 0.04 * r);
            u.ellipse(g, 1.0 * r, -1.6 * r, 0.32 * r, 0.6 * r, -0.3, '#6d4c41', '#3e2723', 0.04 * r);
            u.ellipse(g, -1.0 * r, -1.55 * r, 0.14 * r, 0.35 * r, 0.3, '#a1887f');
            u.ellipse(g, 1.0 * r, -1.55 * r, 0.14 * r, 0.35 * r, -0.3, '#a1887f');
        }
    },
    {
        id: 'animal_fox', name: 'Fox Ears', rarity: 'rare', tags: ['animal', 'fox'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.0 * r, -1.0 * r], [-1.0 * r, -2.5 * r], [-0.1 * r, -1.2 * r]], '#ef6c00', '#bf360c', 0.05 * r);
            u.poly(g, [[1.0 * r, -1.0 * r], [1.0 * r, -2.5 * r], [0.1 * r, -1.2 * r]], '#ef6c00', '#bf360c', 0.05 * r);
            u.poly(g, [[-1.0 * r, -2.5 * r], [-0.82 * r, -2.1 * r], [-1.15 * r, -2.1 * r]], '#ffffff');
            u.poly(g, [[1.0 * r, -2.5 * r], [0.82 * r, -2.1 * r], [1.15 * r, -2.1 * r]], '#ffffff');
        }
    },
    {
        id: 'animal_mouse', name: 'Mouse Ears', rarity: 'common', tags: ['animal', 'mouse'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, -0.9 * r, -1.5 * r, 0.5 * r, '#9e9e9e', '#616161', 0.05 * r);
            u.circle(g, 0.9 * r, -1.5 * r, 0.5 * r, '#9e9e9e', '#616161', 0.05 * r);
            u.circle(g, -0.9 * r, -1.5 * r, 0.27 * r, '#f8bbd0');
            u.circle(g, 0.9 * r, -1.5 * r, 0.27 * r, '#f8bbd0');
        }
    },
    {
        id: 'animal_bear', name: 'Bear Cap', rarity: 'common', tags: ['animal', 'bear'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.25 * r, 1.0 * r, 0.3 * r, 0, '#8d6e63', '#4e342e', 0.04 * r);
            u.circle(g, -0.85 * r, -1.45 * r, 0.4 * r, '#8d6e63', '#4e342e', 0.04 * r);
            u.circle(g, 0.85 * r, -1.45 * r, 0.4 * r, '#8d6e63', '#4e342e', 0.04 * r);
            u.ellipse(g, 0, -1.1 * r, 0.45 * r, 0.25 * r, 0, '#d7b58a');
        }
    },
    {
        id: 'animal_panda', name: 'Panda Ears', rarity: 'common', tags: ['animal', 'panda'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.9 * r, -1.2 * r, 1.8 * r, 0.2 * r, '#ffffff', '#212121', 0.04 * r);
            u.circle(g, -0.85 * r, -1.45 * r, 0.4 * r, '#212121');
            u.circle(g, 0.85 * r, -1.45 * r, 0.4 * r, '#212121');
        }
    },
    {
        id: 'animal_unicorn', name: 'Unicorn Horn', rarity: 'rare', tags: ['animal', 'unicorn'],
        draw(g, c) {
            const r = c.r;
            const L = c.look;
            u.poly(g, [[-0.22 * r, -1.2 * r], [0.22 * r, -1.2 * r], [0, -2.9 * r]], '#ffffff', '#b0bec5', 0.04 * r);
            u.poly(g, [[-0.09 * r, -2.5 * r], [0.09 * r, -2.5 * r], [0, -2.9 * r]], '#ffd54f');
            u.line(g, [[-0.2 * r, -1.6 * r], [0.2 * r, -1.8 * r]], '#b0bec5', 0.04 * r, 'round');
            u.line(g, [[-0.16 * r, -2.0 * r], [0.16 * r, -2.2 * r]], '#b0bec5', 0.04 * r, 'round');
            u.circle(g, -0.8 * L * r, -1.2 * r, 0.22 * r, '#e53935');
            u.circle(g, -1.0 * L * r, -1.0 * r, 0.22 * r, '#fdd835');
            u.circle(g, -0.6 * L * r, -1.0 * r, 0.22 * r, '#43a047');
        }
    },
    {
        id: 'animal_bee', name: 'Bee Antennae', rarity: 'common', tags: ['animal', 'bee'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.9 * r, -1.25 * r, 1.8 * r, 0.25 * r, '#fdd835');
            u.rect(g, -0.5 * r, -1.25 * r, 0.16 * r, 0.25 * r, '#212121');
            u.rect(g, -0.1 * r, -1.25 * r, 0.16 * r, 0.25 * r, '#212121');
            u.rect(g, 0.3 * r, -1.25 * r, 0.16 * r, 0.25 * r, '#212121');
            u.line(g, [[-0.4 * r, -1.25 * r], [-0.6 * r, -2.3 * r]], '#212121', 0.07 * r, 'round');
            u.line(g, [[0.4 * r, -1.25 * r], [0.6 * r, -2.3 * r]], '#212121', 0.07 * r, 'round');
            u.circle(g, -0.6 * r, -2.35 * r, 0.12 * r, '#fdd835', '#212121', 0.03 * r);
            u.circle(g, 0.6 * r, -2.35 * r, 0.12 * r, '#fdd835', '#212121', 0.03 * r);
        }
    },
    {
        id: 'animal_rooster', name: 'Rooster Comb', rarity: 'epic', tags: ['animal', 'rooster'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.5 * r, -1.3 * r, 1.0 * r, 0.3 * r, '#e53935', '#b71c1c', 0.04 * r);
            u.circle(g, -0.45 * r, -1.5 * r, 0.28 * r, '#e53935', '#b71c1c', 0.04 * r);
            u.circle(g, 0, -1.7 * r, 0.33 * r, '#e53935', '#b71c1c', 0.04 * r);
            u.circle(g, 0.45 * r, -1.5 * r, 0.28 * r, '#e53935', '#b71c1c', 0.04 * r);
            u.poly(g, [[0.5 * c.look * r, -1.0 * r], [0.7 * c.look * r, -0.8 * r], [0.45 * c.look * r, -0.75 * r]], '#ff5252');
        }
    },
    {
        id: 'animal_phoenix', name: 'Phoenix Crest', rarity: 'legendary', tags: ['animal', 'phoenix'], anim: true,
        draw(g, c) {
            const r = c.r;
            const L = c.look;
            const k = 1 + 0.12 * Math.sin(c.t / 120);
            u.poly(g, [[-1.1 * L * r, -1.0 * r], [-0.6 * L * r, -1.0 * r], [-1.1 * L * r, -2.0 * r * k], [-0.4 * L * r, -1.6 * r]], '#ff7043');
            u.poly(g, [[-0.85 * r, -1.0 * r], [0.85 * r, -1.0 * r], [0.5 * r, -2.2 * r * k], [0, -2.8 * r * k], [-0.5 * r, -2.2 * r * k]], '#e53935');
            u.poly(g, [[-0.6 * r, -1.0 * r], [0.6 * r, -1.0 * r], [0.25 * r, -2.1 * r * k], [0, -2.4 * r * k], [-0.3 * r, -2.0 * r * k]], '#fb8c00');
            u.poly(g, [[-0.35 * r, -1.0 * r], [0.35 * r, -1.0 * r], [0, -1.9 * r * k]], '#ffeb3b');
        }
    },
]);
