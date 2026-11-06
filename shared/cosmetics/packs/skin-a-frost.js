Cosmetics.define({ pack: 'skin-a-frost', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'frost_snowman', name: 'Snowman', rarity: 'common', tags: ['winter', 'white'],
        fill: '#ffffff',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -r, 0.9 * r, 2 * r, 0.25 * r, '#d32f2f');
            for (const y of [0.2, 0.6]) u.circle(g, 0, y * r, 0.09 * r, '#222222');
        },
    },
    {
        id: 'frost_ice', name: 'Ice Cube', rarity: 'common', tags: ['winter', 'cyan'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#e0f7fa', '#4dd0e1']),
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.7 * r, -0.9 * r], [-0.4 * r, -0.3 * r]], 'rgba(255,255,255,0.8)', 0.12 * r, 'round');
        },
    },
    {
        id: 'frost_penguin', name: 'Penguin', rarity: 'common', tags: ['winter', 'black'],
        fill: '#1b1b1b',
        pattern: [['belly', '#ffffff']],
        extras(g, c) {
            const r = c.r, l = c.look;
            u.poly(g, [[l * 0.9 * r, -0.1 * r], [l * 1.3 * r, 0.1 * r], [l * 0.9 * r, 0.3 * r]], '#ff9800');
        },
    },
    {
        id: 'frost_polar', name: 'Polar Bear', rarity: 'common', tags: ['winter', 'white', 'bear'],
        fill: '#ffffff',
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.circle(g, s * 0.8 * r, -1.3 * r, 0.35 * r, '#e0e7ee', '#cfd8dc', 0.05 * r);
                u.circle(g, s * 0.8 * r, -1.3 * r, 0.16 * r, '#b0bec5', null);
            }
        },
    },
    {
        id: 'frost_cocoa', name: 'Hot Cocoa', rarity: 'common', tags: ['winter', 'brown', 'drink'],
        fill: '#6d4c41',
        pattern: [['dots', '#ffffff', 0.12, 0.5]],
    },
    {
        id: 'frost_gingerbread', name: 'Gingerbread', rarity: 'common', tags: ['winter', 'tan', 'cookie'],
        fill: '#d7a86e',
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.8 * r, 0.3 * r], [-0.4 * r, 0.5 * r], [0, 0.3 * r], [0.4 * r, 0.5 * r], [0.8 * r, 0.3 * r]], '#ffffff', 0.12 * r, 'round');
            u.line(g, [[-0.8 * r, 0.9 * r], [-0.4 * r, 1.1 * r], [0, 0.9 * r], [0.4 * r, 1.1 * r], [0.8 * r, 0.9 * r]], '#ffffff', 0.12 * r, 'round');
        },
    },
    {
        id: 'frost_snowflake', name: 'Snowflake', rarity: 'rare', tags: ['winter', 'blue', 'star'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#81d4fa', '#1565c0']),
        draw(g, c) {
            const r = c.r;
            u.star(g, -0.5 * r, 0.3 * r, 0.3 * r, 0.12 * r, 6, '#ffffff');
            u.star(g, 0.5 * r, 0.9 * r, 0.3 * r, 0.12 * r, 6, '#ffffff');
            u.star(g, 0, 1.35 * r, 0.25 * r, 0.1 * r, 6, '#ffffff');
        },
    },
    {
        id: 'frost_aurora', name: 'Aurora', rarity: 'rare', tags: ['winter', 'green', 'purple', 'sky'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#69f0ae', '#7e57c2']),
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.3 * r, -0.8 * r, 0.9 * r, 0.12 * r, -0.2, 'rgba(255,255,255,0.35)');
            u.ellipse(g, 0.3 * r, 0.6 * r, 0.9 * r, 0.12 * r, 0.2, 'rgba(255,255,255,0.3)');
        },
    },
    {
        id: 'frost_yeti', name: 'Yeti', rarity: 'epic', tags: ['winter', 'white', 'blue', 'monster'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#f5fbff', '#90caf9']),
        draw(g, c) {
            const r = c.r;
            for (const [x, y] of [[-0.7, 0.2], [0.7, 0.2], [-0.5, 1.0], [0.5, 1.0], [0, 0.6]]) {
                u.circle(g, x * r, y * r, 0.14 * r, 'rgba(255,255,255,0.6)');
            }
        },
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.poly(g, [[s * 0.6 * r, -1.2 * r], [s * 0.9 * r, -1.9 * r], [s * 0.2 * r, -1.4 * r]], '#eceff1', '#90a4ae', 0.04 * r);
            }
        },
    },
    {
        id: 'frost_elf', name: 'Elf', rarity: 'common', tags: ['winter', 'green', 'red', 'elf'],
        fill: '#2e7d32',
        pattern: [['rows', ['#2e7d32', '#c62828']]],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.poly(g, [[s * 0.9 * r, -0.6 * r], [s * 1.5 * r, -0.9 * r], [s * 0.9 * r, -0.2 * r]], '#f2c6a0');
            }
        },
    },
]);
