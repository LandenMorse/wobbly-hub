Cosmetics.define({ pack: 'skin-a-arcade', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'arcade_pixel', name: 'Pixel Man', rarity: 'common', tags: ['arcade', 'checker', 'retro'],
        fill: '#e53935',
        pattern: ['checker', '#fdd835', 0.3],
    },
    {
        id: 'arcade_ghost', name: 'Pac Ghost', rarity: 'common', tags: ['arcade', 'ghost', 'lilac'],
        fill: '#b39ddb',
        draw(g, c) {
            const r = c.r;
            u.poly(g, [
                [-1.2 * r, 1.3 * r], [-0.8 * r, 1.9 * r], [-0.4 * r, 1.3 * r], [0, 1.9 * r],
                [0.4 * r, 1.3 * r], [0.8 * r, 1.9 * r], [1.2 * r, 1.3 * r], [1.2 * r, 2.2 * r], [-1.2 * r, 2.2 * r],
            ], '#f3e5f5');
        },
    },
    {
        id: 'arcade_invader', name: 'Invader', rarity: 'common', tags: ['arcade', 'green', 'pixel'],
        fill: '#66bb6a',
        draw(g, c) {
            const r = c.r;
            const rows = [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0],
            ];
            for (let j = 0; j < rows.length; j++) {
                for (let i = 0; i < 5; i++) {
                    if (rows[j][i]) u.rect(g, (-0.8 + i * 0.4) * r, (-0.6 + j * 0.4) * r, 0.3 * r, 0.3 * r, '#1b5e20');
                }
            }
        },
    },
    {
        id: 'arcade_joystick', name: 'Joystick', rarity: 'common', tags: ['arcade', 'red', 'bands'],
        fill: '#e53935',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -r, -0.7 * r, 2 * r, 0.3 * r, '#111111');
            u.rect(g, -r, 0.3 * r, 2 * r, 0.3 * r, '#111111');
        },
    },
    {
        id: 'arcade_coin', name: 'Coin Op', rarity: 'common', tags: ['arcade', 'gold', 'dots'],
        fill: '#ffc107',
        pattern: ['dots', '#b8860b', 0.12, 0.45],
    },
    {
        id: 'arcade_8bit', name: '8-Bit Hero', rarity: 'common', tags: ['arcade', 'blue', 'red'],
        fill: '#1e40af',
        pattern: ['rows', ['#1e40af', '#dc2626']],
    },
    {
        id: 'arcade_neonrun', name: 'Neon Racer', rarity: 'rare', tags: ['arcade', 'neon', 'black'],
        fill: '#111111',
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-r, -0.4 * r], [r, -0.4 * r]], '#ff2fd2', 0.18 * r, 'butt');
            u.line(g, [[-r, 0.4 * r], [r, 0.4 * r]], '#ff2fd2', 0.18 * r, 'butt');
            u.line(g, [[-r, -0.1 * r], [r, -0.1 * r]], '#22d3ee', 0.14 * r, 'butt');
            u.line(g, [[-r, 0.9 * r], [r, 0.9 * r]], '#22d3ee', 0.14 * r, 'butt');
        },
    },
    {
        id: 'arcade_glitch', name: 'Glitch', rarity: 'rare', tags: ['arcade', 'glitch', 'bands'],
        fill: '#7c3aed',
        draw(g, c) {
            const r = c.r;
            const slices = [[-0.9, 0.22], [-0.2, 0.16], [0.4, 0.26], [1.0, 0.14]];
            for (const [y, h] of slices) {
                u.rect(g, -0.85 * r, y * r, 1.7 * r, h * r, '#22d3ee');
                u.rect(g, -0.7 * r, (y + 0.06) * r, 1.7 * r, h * r * 0.5, '#f43f5e');
            }
        },
    },
    {
        id: 'arcade_highscore', name: 'High Score', rarity: 'epic', tags: ['arcade', 'rainbow', 'animated'], anim: true,
        fill: (g, c) => {
            const h = (c.t * 0.12) % 360;
            return u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, [`hsl(${h}, 90%, 60%)`, `hsl(${(h + 120) % 360}, 90%, 55%)`]);
        },
        draw(g, c) {
            const r = c.r;
            const h = (c.t * 0.25) % 360;
            const alpha = 0.5 + 0.5 * Math.sin(c.t / 80);
            u.star(g, 0, 0.2 * r, 0.6 * r, 0.25 * r, 5, `hsla(${h}, 100%, 70%, ${alpha})`, null);
        },
    },
    {
        id: 'arcade_cartridge', name: 'Cartridge', rarity: 'common', tags: ['arcade', 'grey', 'label'],
        fill: '#9e9e9e',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.7 * r, -0.6 * r, 1.4 * r, 1.0 * r, '#ffffff', '#424242', 0.06 * r);
        },
    },
]);
