Cosmetics.define({ pack: 'boots-c-critter', category: 'boots', author: 'helper' }, (u) => [
    {
        id: 'critter_kitty', name: 'Kitty Paws', rarity: 'common', tags: ['animal', 'kitty'],
        colors: ['#cfd3d8', '#f9a8d4'],
    },
    {
        id: 'critter_pup', name: 'Puppy Paws', rarity: 'common', tags: ['animal', 'puppy'],
        colors: ['#d2a679', '#6b4423'],
    },
    {
        id: 'critter_bunny', name: 'Bunny Hops', rarity: 'common', tags: ['animal', 'bunny'],
        colors: ['#ffffff', '#f9a8d4'],
    },
    {
        id: 'critter_frog', name: 'Froggy', rarity: 'common', tags: ['animal', 'frog'],
        colors: ['#4caf50', '#cddc39'],
    },
    {
        id: 'critter_duck', name: 'Duck Feet', rarity: 'common', tags: ['animal', 'duck'],
        colors: ['#ff9800', '#e65100'],
    },
    {
        id: 'critter_panda', name: 'Panda Paws', rarity: 'common', tags: ['animal', 'panda'],
        colors: ['#ffffff', '#1a1a1a'],
    },
    {
        id: 'critter_tiger', name: 'Tiger Toes', rarity: 'rare', tags: ['animal', 'tiger'],
        colors: ['#ff8c1a', '#111111'],
        over(g, c, x) {
            const r = c.r;
            for (const dx of [-0.2, 0.2]) u.line(g, [[x + dx * r, 1.45 * r], [x + (dx + 0.05) * r, 1.85 * r]], '#111111', 0.09 * r);
        },
    },
    {
        id: 'critter_dino', name: 'Dino Claws', rarity: 'rare', tags: ['animal', 'dino'],
        colors: ['#4caf50', '#fff8e1'],
        over(g, c, x) {
            const r = c.r;
            const tx = x + c.look * 0.32 * r;
            for (const by of [1.62, 1.72, 1.82]) {
                u.poly(g, [
                    [tx - c.look * 0.15 * r, (by - 0.07) * r],
                    [tx - c.look * 0.15 * r, (by + 0.07) * r],
                    [tx + c.look * 0.1 * r, by * r],
                ], '#fff8e1', null);
            }
        },
    },
    {
        id: 'critter_dragon', name: 'Dragon Feet', rarity: 'epic', tags: ['animal', 'dragon'],
        colors: ['#c62828', '#ffc107'],
        over(g, c, x) {
            const r = c.r;
            g.save();
            g.strokeStyle = '#ffc107';
            g.lineWidth = 0.06 * r;
            for (const dx of [-0.25, 0.1]) {
                for (const dy of [1.62, 1.78]) {
                    g.beginPath();
                    g.arc(x + dx * r, dy * r, 0.09 * r, 0, Math.PI);
                    g.stroke();
                }
            }
            g.restore();
        },
    },
    {
        id: 'critter_unicorn', name: 'Unicorn Hooves', rarity: 'legendary', tags: ['animal', 'unicorn'],
        colors: ['#ffffff', '#d946ef'], anim: true,
        over(g, c, x) {
            const r = c.r;
            const hue = (c.t / 8) % 360;
            u.rect(g, x - 0.34 * r, 1.84 * r, 0.68 * r, 0.1 * r, 'hsl(' + hue + ',90%,65%)', null);
            const tw = 0.5 + 0.5 * Math.sin(c.t / 200);
            u.star(g, x + 0.25 * r * c.look, 1.45 * r, 0.22 * r * tw, 0.09 * r * tw, 5, '#fde047', null);
        },
    },
]);
