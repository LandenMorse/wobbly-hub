Cosmetics.define({ pack: 'skin-a-knight', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'knight_iron', name: 'Iron Knight', rarity: 'common', tags: ['knight', 'silver', 'armor'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#eceff1', '#90a4ae']),
        pattern: [['band', '#607d8b', -0.3, 0.12]],
        draw(g, c) {
            const r = c.r;
            for (const x of [-0.6, -0.2, 0.2, 0.6]) for (const y of [-0.6, 0.1, 0.8]) u.circle(g, x * r, y * r, 0.06 * r, '#455a64');
        },
    },
    {
        id: 'knight_bronze', name: 'Bronze Armor', rarity: 'common', tags: ['knight', 'bronze', 'armor'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#d08a4e', '#a0612a']),
        pattern: [['band', '#6d3b1a', -0.2, 0.16], ['band', '#6d3b1a', 0.5, 0.16]],
    },
    {
        id: 'knight_squire', name: 'Squire', rarity: 'common', tags: ['knight', 'blue', 'tabard'],
        fill: '#1e5fb4',
        pattern: [['sash', '#f5c542'], ['collar', '#e8eaf6']],
    },
    {
        id: 'knight_archer', name: 'Archer', rarity: 'common', tags: ['knight', 'green', 'tunic'],
        fill: '#2e7d32',
        pattern: [['collar', '#a5d6a7']],
    },
    {
        id: 'knight_peasant', name: 'Peasant', rarity: 'common', tags: ['knight', 'cloth', 'rough'],
        fill: '#d7c4a0',
        pattern: [['blobs', ['#8d6e63', '#a1887f', '#6d4c41'], 7, 11]],
    },
    {
        id: 'knight_banner', name: 'Banner', rarity: 'common', tags: ['knight', 'heraldic', 'team'],
        fill: '#f5f5f5',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -r, -1.5 * r, r, 3.5 * r, c.team, null);
        },
    },
    {
        id: 'knight_dragonscale', name: 'Dragon Scale', rarity: 'rare', tags: ['knight', 'red', 'scale'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#c62828', '#7f0000']),
        pattern: [['rows', ['#b71c1c', '#e53935']]],
    },
    {
        id: 'knight_royal', name: 'Royal Guard', rarity: 'rare', tags: ['knight', 'red', 'gold', 'royal'],
        fill: '#c62828',
        pattern: [['checker', '#ffd54f', 0.4]],
    },
    {
        id: 'knight_paladin', name: 'Paladin', rarity: 'epic', tags: ['knight', 'white', 'gold', 'holy'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#ffffff', '#ffe082']),
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0.1 * r, 0.9 * r, u.radial(g, 0, 0.1 * r, 0, 0, 0.1 * r, 0.9 * r, ['rgba(255,235,59,0.8)', 'rgba(255,235,59,0)']));
            u.rect(g, -0.12 * r, -0.7 * r, 0.24 * r, 1.2 * r, '#ffca28', null);
            u.rect(g, -0.45 * r, -0.3 * r, 0.9 * r, 0.24 * r, '#ffca28', null);
        },
    },
    {
        id: 'knight_mage', name: 'Court Mage', rarity: 'common', tags: ['knight', 'indigo', 'gold', 'magic'],
        fill: '#283593',
        draw(g, c) {
            const r = c.r, rnd = u.rng(4);
            for (let i = 0; i < 6; i++) u.star(g, (rnd() * 1.4 - 0.7) * r, (rnd() * 2.4 - 0.8) * r, 0.1 * r, 0.04 * r, 5, '#ffd54f', null);
        },
    },
]);
