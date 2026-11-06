Cosmetics.define({ pack: 'boots-c-blaze', category: 'boots', author: 'helper' }, (u) => [
    {
        id: 'blaze_ember', name: 'Ember Kicks', rarity: 'common', tags: ['elemental', 'fire'],
        colors: ['#fb923c', '#7f1d1d'],
    },
    {
        id: 'blaze_frost', name: 'Frostbite', rarity: 'common', tags: ['elemental', 'ice'],
        colors: ['#e0f2fe', '#a5f3fc'],
    },
    {
        id: 'blaze_sprout', name: 'Sprout', rarity: 'common', tags: ['elemental', 'nature'],
        colors: ['#4ade80', '#78350f'],
    },
    {
        id: 'blaze_sand', name: 'Dune Walkers', rarity: 'common', tags: ['elemental', 'earth'],
        colors: ['#d6b48a', '#78350f'],
    },
    {
        id: 'blaze_storm', name: 'Stormers', rarity: 'common', tags: ['elemental', 'storm'],
        colors: ['#4b5563', '#facc15'],
    },
    {
        id: 'blaze_tidal', name: 'Tidal', rarity: 'common', tags: ['elemental', 'water'],
        colors: ['#14b8a6', '#1e3a8a'],
    },
    {
        id: 'blaze_magma', name: 'Magma Steps', rarity: 'rare', tags: ['elemental', 'fire', 'lava'],
        colors: ['#111111', '#ea580c'],
        over(g, c, x) {
            const r = c.r;
            u.line(g, [[x - 0.15 * r, 1.4 * r], [x - 0.05 * r, 1.6 * r], [x - 0.18 * r, 1.8 * r]], '#fb923c', 0.06 * r, 'round');
            u.line(g, [[x + 0.05 * r, 1.5 * r], [x + 0.2 * r, 1.7 * r], [x + 0.08 * r, 1.95 * r]], '#f97316', 0.06 * r, 'round');
            u.line(g, [[x - 0.02 * r, 2.0 * r], [x + 0.12 * r, 2.2 * r]], '#fdba74', 0.05 * r, 'round');
        },
    },
    {
        id: 'blaze_volt', name: 'Voltage', rarity: 'rare', tags: ['elemental', 'storm', 'electric'],
        colors: ['#facc15', '#111111'],
        over(g, c, x) {
            const r = c.r;
            u.line(g, [[x - 0.1 * r, 1.5 * r], [x + 0.06 * r, 1.8 * r], [x - 0.06 * r, 1.8 * r], [x + 0.1 * r, 2.1 * r]], '#000000', 0.08 * r, 'round');
        },
    },
    {
        id: 'blaze_inferno', name: 'Inferno', rarity: 'epic', tags: ['elemental', 'fire', 'flame'],
        colors: ['#dc2626', '#7c2d12'], anim: true,
        under(g, c, x) {
            const r = c.r;
            const f = 0.5 + 0.5 * Math.sin(c.t / 120);
            for (const dx of [-0.35, 0, 0.35]) {
                const h = (0.7 + 0.35 * f) * r;
                const cx = x + dx * r;
                u.poly(g, [[cx - 0.14 * r, 2.5 * r], [cx + 0.14 * r, 2.5 * r], [cx, 2.5 * r - h]], '#f97316', null);
                const h2 = (0.45 + 0.25 * (1 - f)) * r;
                u.poly(g, [[cx - 0.07 * r, 2.5 * r], [cx + 0.07 * r, 2.5 * r], [cx, 2.5 * r - h2]], '#facc15', null);
            }
        },
    },
    {
        id: 'blaze_aurora', name: 'Aurora Treads', rarity: 'legendary', tags: ['elemental', 'light', 'aurora'],
        colors: ['#7e22ce', '#2dd4bf'], anim: true,
        over(g, c, x) {
            const r = c.r;
            const p = (c.t / 1000) % 1;
            const sx = x + (-0.3 + 0.6 * p) * r;
            u.line(g, [[sx, 1.6 * r], [sx + 0.1 * r, 1.82 * r]], 'rgba(255,255,255,0.8)', 0.08 * r, 'round');
            u.line(g, [[x - 0.3 * r, 1.74 * r], [x + 0.3 * r, 1.74 * r]], 'rgba(45,212,191,0.7)', 0.05 * r, 'round');
        },
    },
]);
