Cosmetics.define({ pack: 'boots-c-retro', category: 'boots', author: 'helper' }, (u) => [
    {
        id: 'retro_court', name: 'Court Classics', rarity: 'common', tags: ['retro', 'sport'],
        colors: ['#ffffff', '#d62828'],
    },
    {
        id: 'retro_high', name: 'High Tops', rarity: 'common', tags: ['retro', 'sport'],
        colors: ['#d62828', '#ffffff'],
    },
    {
        id: 'retro_skate', name: 'Skater', rarity: 'common', tags: ['retro', 'street'],
        colors: ['#111111', '#ffffff'],
    },
    {
        id: 'retro_jogger', name: 'Jogger', rarity: 'common', tags: ['retro', 'street'],
        colors: ['#8a8a8a', '#ff7f11'],
    },
    {
        id: 'retro_varsity', name: 'Varsity', rarity: 'common', tags: ['retro', 'team'],
        colors: ['#1d2d5c', '#d4a017'],
    },
    {
        id: 'retro_mint', name: 'Mint Runner', rarity: 'common', tags: ['retro', 'sport'],
        colors: ['#98ffd0', '#ffffff'],
    },
    {
        id: 'retro_stripe', name: 'Three Stripe', rarity: 'rare', tags: ['retro', 'sport'],
        colors: ['#ffffff', '#111111'],
        over(g, c, x) {
            const r = c.r;
            for (const dx of [-0.18, 0, 0.18]) {
                u.line(g, [[x + (dx - 0.12) * r, 1.9 * r], [x + (dx + 0.12) * r, 1.45 * r]], '#1b1b1b', 0.08 * r);
            }
        },
    },
    {
        id: 'retro_checker', name: 'Checker Kicks', rarity: 'rare', tags: ['retro', 'street'],
        colors: ['#ffffff', '#111111'],
        over(g, c, x) {
            const r = c.r;
            const s = 0.16 * r;
            const x0 = x + 0.1 * r;
            const y0 = 1.9 * r;
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 2; col++) {
                    u.rect(g, x0 + col * s, y0 + row * s, s, s, (row + col) % 2 === 0 ? '#111111' : '#ffffff', null);
                }
            }
        },
    },
    {
        id: 'retro_neon80', name: 'Neon 80s', rarity: 'epic', tags: ['retro', 'neon'],
        colors: ['#111111', '#ff1493'], anim: true,
        over(g, c, x) {
            const r = c.r;
            const pulse = 0.5 + 0.5 * Math.sin(c.t / 180);
            const alpha = (0.45 + 0.55 * pulse).toFixed(2);
            g.save();
            g.shadowColor = '#00ffff';
            g.shadowBlur = 4 + 6 * pulse;
            u.line(g, [[x - 0.3 * r, 1.78 * r], [x + 0.3 * r, 1.78 * r]], `rgba(0,255,255,${alpha})`, 0.08 * r, 'round');
            g.restore();
        },
    },
    {
        id: 'retro_champ', name: 'Champion Gold', rarity: 'rare', tags: ['retro', 'gold'],
        colors: ['#d4a017', '#ffffff'],
        over(g, c, x) {
            const r = c.r;
            u.star(g, x, 1.7 * r, 0.22 * r, 0.09 * r, 5, '#fff7cc', '#8a6100', 0.03 * r);
        },
    },
]);
