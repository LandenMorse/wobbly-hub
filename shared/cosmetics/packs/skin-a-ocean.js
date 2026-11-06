Cosmetics.define({ pack: 'skin-a-ocean', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'ocean_wave', name: 'Wave', rarity: 'common', tags: ['ocean', 'blue'],
        fill: '#1e88e5',
        draw(g, c) {
            const r = c.r;
            for (const y of [-0.2, 0.4, 1.0]) {
                const pts = [];
                for (let i = 0; i <= 8; i++) pts.push([(-0.9 + i * 0.225) * r, (y + Math.sin(i * Math.PI / 2) * 0.12) * r]);
                u.line(g, pts, '#ffffff', 0.09 * r, 'round');
            }
        },
    },
    {
        id: 'ocean_coral', name: 'Coral', rarity: 'common', tags: ['ocean', 'pink'],
        fill: '#ff7f7f',
        pattern: [['blobs', ['#ff4f79', '#ffc1b8'], 7, 4]],
    },
    {
        id: 'ocean_clownfish', name: 'Clownfish', rarity: 'common', tags: ['ocean', 'orange'],
        fill: '#ff7a1a',
        pattern: [['band', '#ffffff', -0.1, 0.35], ['band', '#ffffff', 0.9, 0.35]],
    },
    {
        id: 'ocean_jelly', name: 'Jellyfish', rarity: 'common', tags: ['ocean', 'lilac'],
        fill: 'rgba(200,162,255,0.85)',
        extras(g, c) {
            const r = c.r;
            for (const x of [-0.6, -0.2, 0.2, 0.6]) u.line(g, [[x * r, 1.4 * r], [(x + 0.12) * r, 1.8 * r], [x * r, 2.05 * r]], '#b388ff', 0.07 * r, 'round');
        },
    },
    {
        id: 'ocean_seaweed', name: 'Kelp', rarity: 'common', tags: ['ocean', 'green'],
        fill: '#2e7d32',
        draw(g, c) {
            const r = c.r;
            for (const y of [-0.2, 0.4, 1.0]) {
                const pts = [];
                for (let i = 0; i <= 8; i++) pts.push([(-0.9 + i * 0.225) * r, (y + Math.sin(i * Math.PI / 2 + 1) * 0.12) * r]);
                u.line(g, pts, '#81c784', 0.09 * r, 'round');
            }
        },
    },
    {
        id: 'ocean_pearl', name: 'Pearl', rarity: 'common', tags: ['ocean', 'white'],
        fill: (g, c) => u.radial(g, -0.3 * c.r, -0.5 * c.r, 0.1 * c.r, 0, 0, 1.6 * c.r, ['#ffffff', '#f8bbd0', '#f3e5f5']),
    },
    {
        id: 'ocean_shark', name: 'Shark', rarity: 'rare', tags: ['ocean', 'grey'],
        fill: '#78909c',
        pattern: [['belly', '#eceff1']],
        extras(g, c) {
            const r = c.r;
            u.poly(g, [[-0.1 * r, -1.1 * r], [0.45 * r, -1.1 * r], [0.15 * r, -2.1 * r]], '#607d8b');
        },
    },
    {
        id: 'ocean_octopus', name: 'Octopus', rarity: 'rare', tags: ['ocean', 'purple'],
        fill: '#8e24aa',
        pattern: [['dots', '#e1bee7', 0.1, 0.45]],
        extras(g, c) {
            const r = c.r;
            for (const x of [-0.7, -0.25, 0.25, 0.7]) u.line(g, [[x * r, 1.3 * r], [(x + 0.15) * r, 1.8 * r], [x * r, 2.05 * r]], '#8e24aa', 0.22 * r, 'round');
        },
    },
    {
        id: 'ocean_anglerfish', name: 'Anglerfish', rarity: 'epic', tags: ['ocean', 'dark', 'glow'], anim: true,
        fill: '#1a1a2e',
        extras(g, c) {
            const r = c.r, s = c.look;
            const p = 0.5 + 0.5 * Math.sin(c.t / 300);
            const lx = 0.6 * r * s, ly = -2.1 * r;
            u.line(g, [[0.2 * r * s, -1.2 * r], [lx, ly]], '#2a2a40', 0.07 * r, 'round');
            u.circle(g, lx, ly, (0.22 + 0.06 * p) * r, 'rgba(255,235,59,' + (0.3 + 0.3 * p) + ')');
            u.circle(g, lx, ly, 0.12 * r, '#fff59d');
        },
    },
    {
        id: 'ocean_poseidon', name: 'Poseidon', rarity: 'legendary', tags: ['ocean', 'teal', 'gold'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#00695c', '#004d40']),
        draw(g, c) {
            const r = c.r, gold = '#ffd54f';
            u.line(g, [[0, 0.3 * r], [0, 1.5 * r]], gold, 0.12 * r, 'round');
            u.line(g, [[-0.3 * r, -0.1 * r], [-0.3 * r, 0.25 * r], [0, 0.45 * r], [0.3 * r, 0.25 * r], [0.3 * r, -0.1 * r]], gold, 0.1 * r, 'round');
            u.line(g, [[-0.4 * r, 0.25 * r], [0.4 * r, 0.25 * r]], gold, 0.1 * r, 'round');
            u.poly(g, [[-0.75 * r, -0.9 * r], [-0.5 * r, -0.9 * r], [-0.8 * r, 0.7 * r], [-1.0 * r, 0.7 * r]], 'rgba(255,255,255,0.18)', null);
        },
    },
]);
