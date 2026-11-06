Cosmetics.define({ pack: 'hat-b-western', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'western_stetson', name: 'Stetson', rarity: 'common', tags: ['western', 'brown'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.25 * r, 0.22 * r, 0, '#8d6e63');
            u.rect(g, -0.55 * r, -1.75 * r, 1.1 * r, 0.75 * r, '#a1887f');
            u.rect(g, -0.55 * r, -1.12 * r, 1.1 * r, 0.12 * r, c.team);
        }
    },
    {
        id: 'western_sheriff', name: 'Sheriff Hat', rarity: 'rare', tags: ['western', 'black', 'badge'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.4 * r, 0.25 * r, 0, '#212121');
            u.rect(g, -0.55 * r, -1.75 * r, 1.1 * r, 0.75 * r, '#263238');
            u.star(g, 0, -1.45 * r, 0.22 * r, 0.09 * r, 5, '#ffc107', '#8d6e00', 1);
        }
    },
    {
        id: 'western_bandit', name: 'Bandit Hat', rarity: 'common', tags: ['western', 'grey', 'red'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.02 * r, 1.15 * r, 0.2 * r, 0, '#455a64');
            u.rect(g, -0.5 * r, -1.45 * r, 1.0 * r, 0.42 * r, '#546e7a');
            u.rect(g, -0.5 * r, -1.3 * r, 1.0 * r, 0.16 * r, '#d32f2f');
            u.poly(g, [[0.45 * r, -1.3 * r], [0.75 * r, -1.22 * r], [0.6 * r, -1.1 * r]], '#d32f2f');
        }
    },
    {
        id: 'western_ranch', name: 'Ranch Straw', rarity: 'common', tags: ['western', 'straw', 'yellow'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.3 * r, 0.24 * r, 0, '#fff176', '#c0a800', 1);
            u.ellipse(g, -1.1 * r, -1.02 * r, 0.22 * r, 0.14 * r, 0, '#fff59d');
            u.ellipse(g, 1.1 * r, -1.02 * r, 0.22 * r, 0.14 * r, 0, '#fff59d');
            u.rect(g, -0.55 * r, -1.6 * r, 1.1 * r, 0.6 * r, '#fff9c4');
            u.rect(g, -0.55 * r, -1.2 * r, 1.1 * r, 0.1 * r, '#c0a800');
        }
    },
    {
        id: 'western_poncho', name: 'Sombrero', rarity: 'rare', tags: ['western', 'red', 'yellow'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.85 * r, 0.3 * r, 0, '#e53935', '#fdd835', 2);
            u.poly(g, [[-0.5 * r, -1.1 * r], [-0.45 * r, -2.2 * r], [0, -2.9 * r], [0.45 * r, -2.2 * r], [0.5 * r, -1.1 * r]], '#fdd835');
            u.rect(g, -0.5 * r, -1.3 * r, 1.0 * r, 0.16 * r, '#e53935');
        }
    },
    {
        id: 'western_coonskin', name: 'Coonskin', rarity: 'common', tags: ['western', 'fur', 'brown'],
        draw(g, c) {
            const r = c.r;
            const tx = -0.7 * c.look * r;
            u.line(g, [[tx * 0.6, -1.3 * r], [tx, -0.9 * r], [tx * 1.1, -0.4 * r], [tx * 1.2, 0.1 * r]], '#6d4c41', 0.22 * r, 'round');
            u.line(g, [[tx * 0.9, -0.8 * r], [tx * 1.15, -0.8 * r]], '#eeeeee', 0.06 * r, 'butt');
            u.line(g, [[tx * 1.1, -0.35 * r], [tx * 1.2, -0.35 * r]], '#eeeeee', 0.06 * r, 'butt');
            u.circle(g, 0, -1.4 * r, 0.7 * r, '#8d6e63', '#4e342e', 1);
            u.ellipse(g, 0, -1.05 * r, 0.55 * r, 0.2 * r, 0, '#5d4037');
        }
    },
    {
        id: 'western_gambler', name: 'Gambler', rarity: 'common', tags: ['western', 'green', 'card'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.2 * r, 0.2 * r, 0, '#2e7d32');
            u.rect(g, -0.5 * r, -1.55 * r, 1.0 * r, 0.6 * r, '#1b5e20');
            u.rect(g, -0.5 * r, -1.2 * r, 1.0 * r, 0.22 * r, '#43a047');
            u.poly(g, [[0.2 * r, -1.55 * r], [0.45 * r, -1.6 * r], [0.5 * r, -1.25 * r], [0.25 * r, -1.2 * r]], '#ffffff', '#9e9e9e', 1);
        }
    },
    {
        id: 'western_cavalry', name: 'Cavalry Hat', rarity: 'rare', tags: ['western', 'navy', 'gold'],
        draw(g, c) {
            const r = c.r;
            const s = c.look;
            u.ellipse(g, 0, -1.0 * r, 1.25 * r, 0.22 * r, 0, '#1a237e');
            u.poly(g, [[-0.6 * r, -1.0 * r], [0.6 * r, -1.0 * r], [0.9 * r, -1.35 * r], [0.2 * r, -1.25 * r], [-0.6 * r, -1.25 * r]], '#283593');
            u.rect(g, -0.5 * r, -1.8 * r, 1.0 * r, 0.8 * r, '#1a237e');
            u.line(g, [[-0.5 * s * r, -1.2 * r], [0.5 * s * r, -1.15 * r]], '#ffc107', 0.1 * r, 'round');
        }
    },
    {
        id: 'western_desperado', name: 'Desperado', rarity: 'epic', tags: ['western', 'black', 'silver'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.3 * r, 0.22 * r, 0, '#101010');
            u.rect(g, -0.5 * r, -2.5 * r, 1.0 * r, 1.5 * r, '#1c1c1c');
            u.rect(g, -0.5 * r, -1.2 * r, 1.0 * r, 0.16 * r, '#37474f');
            const xs = [-0.4, -0.2, 0, 0.2, 0.4];
            for (const x of xs) u.circle(g, x * r, -1.12 * r, 0.05 * r, '#eceff1');
            u.ellipse(g, 0.45 * c.look * r, -2.2 * r, 0.12 * r, 0.5 * r, 0.5 * c.look, '#e53935');
        }
    },
    {
        id: 'western_goldrush', name: 'Gold Rush', rarity: 'legendary', tags: ['western', 'gold', 'shiny'], anim: true,
        draw(g, c) {
            const r = c.r;
            const pulse = 0.6 + 0.4 * Math.sin(c.t / 200);
            u.ellipse(g, 0, -1.0 * r, 1.3 * r, 0.24 * r, 0, '#ffd54f', '#b8860b', 1);
            u.rect(g, -0.55 * r, -1.75 * r, 1.1 * r, 0.75 * r, '#ffca28', '#b8860b', 1);
            u.rect(g, -0.55 * r, -1.12 * r, 1.1 * r, 0.12 * r, '#fff176');
            g.globalAlpha = pulse;
            u.star(g, -0.9 * r, -1.9 * r, 0.22 * r, 0.09 * r, 4, '#ffffff');
            u.star(g, 0.85 * r, -2.2 * r, 0.18 * r, 0.08 * r, 4, '#fffde7');
            g.globalAlpha = 1;
        }
    },
    // one object per item, in the order listed
]);
