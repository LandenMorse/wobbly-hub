Cosmetics.define({ pack: 'boots-c-knight', category: 'boots', author: 'helper' }, (u) => [
    {
        id: 'knight_iron', name: 'Iron Greaves', rarity: 'common', tags: ['knight', 'adventure'],
        colors: ['#94a3b8', '#334155'],
    },
    {
        id: 'knight_leather', name: 'Leather Boots', rarity: 'common', tags: ['knight', 'adventure'],
        colors: ['#8d6e63', '#4e342e'],
    },
    {
        id: 'knight_ranger', name: 'Ranger', rarity: 'common', tags: ['knight', 'adventure'],
        colors: ['#166534', '#78350f'],
    },
    {
        id: 'knight_pirate', name: 'Buccaneer', rarity: 'common', tags: ['knight', 'adventure'],
        colors: ['#111111', '#d2b48c'],
    },
    {
        id: 'knight_cowboy', name: 'Rodeo', rarity: 'common', tags: ['knight', 'western'],
        colors: ['#8b5a2b', '#fef3c7'],
    },
    {
        id: 'knight_ninja', name: 'Shadow Steps', rarity: 'common', tags: ['knight', 'adventure'],
        colors: ['#1e293b', '#0a0a0a'],
    },
    {
        id: 'knight_spur', name: 'Spurs', rarity: 'rare', tags: ['knight', 'western'],
        colors: ['#8d6e63', '#cbd5e1'],
        over(g, c, x) { const r = c.r; u.star(g, x - c.look * 0.36 * r, 1.82 * r, 0.12 * r, 0.06 * r, 5, '#cbd5e1', '#64748b', 0.02 * r); },
    },
    {
        id: 'knight_wizard', name: 'Wizard Shoes', rarity: 'rare', tags: ['knight', 'fantasy'],
        colors: ['#7e22ce', '#facc15'],
        over(g, c, x) { const r = c.r; u.star(g, x, 1.8 * r, 0.13 * r, 0.055 * r, 5, '#facc15', null); },
    },
    {
        id: 'knight_royal', name: 'Royal Boots', rarity: 'epic', tags: ['knight', 'fantasy'],
        colors: ['#9b1c1c', '#facc15'],
        over(g, c, x) {
            const r = c.r;
            u.rect(g, x - 0.35 * r, 1.45 * r, 0.7 * r, 0.08 * r, '#facc15', null);
            u.circle(g, x, 1.5 * r, 0.06 * r, '#38bdf8', null);
        },
    },
    {
        id: 'knight_dragonscale', name: 'Dragonscale', rarity: 'legendary', tags: ['knight', 'fantasy'],
        colors: ['#047857', '#facc15'], anim: true,
        over(g, c, x) {
            const r = c.r;
            const sweep = (((c.t / 1000) % 2) - 1) * 0.28 * r;
            u.ellipse(g, x + sweep, 1.66 * r, 0.06 * r, 0.14 * r, 0.4, 'rgba(255,255,255,0.6)', null);
        },
    },
]);
