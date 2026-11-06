Cosmetics.define({ pack: 'skin-a-safari', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'safari_lion', name: 'Lion', rarity: 'common', tags: ['safari', 'golden'],
        fill: '#e8b130',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 0.3 * r, 0.5 * r, 0.35 * r, 0, '#f7d774');
        },
        extras(g, c) {
            const r = c.r;
            u.circle(g, 0, -0.5 * r, 1.45 * r, '#b5651d');
        },
    },
    {
        id: 'safari_zebra', name: 'Zebra', rarity: 'common', tags: ['safari', 'stripes'],
        fill: '#ffffff',
        pattern: ['stripes', '#1b1b1b'],
    },
    {
        id: 'safari_giraffe', name: 'Giraffe', rarity: 'common', tags: ['safari', 'yellow'],
        fill: '#ffe066',
        pattern: ['blobs', ['#8d5524'], 7, 3],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.line(g, [[s * 0.35 * r, -1.2 * r], [s * 0.35 * r, -1.6 * r]], '#8d5524', 0.14 * r, 'round');
                u.circle(g, s * 0.35 * r, -1.65 * r, 0.14 * r, '#5d3a1a');
            }
        },
    },
    {
        id: 'safari_elephant', name: 'Elephant', rarity: 'common', tags: ['safari', 'grey'],
        fill: '#9e9e9e',
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.ellipse(g, s * 1.1 * r, -0.1 * r, 0.7 * r, 0.9 * r, 0, '#bdbdbd');
            u.line(g, [[0, 0.4 * r], [0.5 * r * c.look, 0.9 * r], [0.4 * r * c.look, 1.4 * r]], '#9e9e9e', 0.25 * r, 'round');
        },
    },
    {
        id: 'safari_leopard', name: 'Leopard', rarity: 'common', tags: ['safari', 'spotted'],
        fill: '#d9a441',
        pattern: ['dots', '#3e2723', 0.12, 0.5],
    },
    {
        id: 'safari_flamingo', name: 'Flamingo', rarity: 'common', tags: ['safari', 'pink'],
        fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#ffc1e3', '#ff4fa3']),
        extras(g, c) {
            const r = c.r;
            u.poly(g, [[0.3 * r * c.look, -0.5 * r], [1.0 * r * c.look, -0.3 * r], [0.3 * r * c.look, -0.1 * r]], '#ff8a00');
        },
    },
    {
        id: 'safari_panda', name: 'Panda', rarity: 'rare', tags: ['safari', 'black', 'white'],
        fill: '#ffffff',
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.ellipse(g, s * 0.45 * r, -0.4 * r, 0.35 * r, 0.3 * r, 0, '#1b1b1b');
        },
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.circle(g, s * 0.8 * r, -1.25 * r, 0.4 * r, '#1b1b1b');
        },
    },
    {
        id: 'safari_cheetah', name: 'Cheetah', rarity: 'rare', tags: ['safari', 'dots', 'fast'],
        fill: '#e0a458',
        pattern: ['dots', '#5d3a1a', 0.08, 0.4],
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) u.line(g, [[s * 0.45 * r, -0.2 * r], [s * 0.55 * r, 0.5 * r]], '#3e2723', 0.08 * r, 'round');
        },
    },
    {
        id: 'safari_chameleon', name: 'Chameleon', rarity: 'epic', tags: ['safari', 'shift', 'colour'], anim: true,
        fill: (g, c) => {
            const h = (c.t / 20) % 360;
            return u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, [`hsl(${h},80%,55%)`, `hsl(${(h + 90) % 360},80%,45%)`]);
        },
        extras(g, c) {
            const r = c.r;
            const h = (c.t / 20) % 360;
            for (const s of [-1, 1]) u.circle(g, s * 1.0 * r, -0.9 * r, 0.35 * r, '#7cb342');
            u.line(g, [[-0.6 * c.look * r, 1.2 * r], [-1.5 * c.look * r, 1.5 * r], [-1.2 * c.look * r, 0.9 * r]], `hsl(${(h + 180) % 360},80%,50%)`, 0.15 * r, 'round');
        },
    },
    {
        id: 'safari_parrot', name: 'Parrot', rarity: 'common', tags: ['safari', 'bird', 'colourful'],
        fill: '#e53935',
        pattern: ['rows', ['#e53935', '#fdd835', '#1e88e5']],
        extras(g, c) {
            const r = c.r;
            u.poly(g, [[0.9 * r * c.look, -0.4 * r], [1.4 * r * c.look, -0.1 * r], [0.9 * r * c.look, 0.2 * r]], '#ff9800');
        },
    },
]);
