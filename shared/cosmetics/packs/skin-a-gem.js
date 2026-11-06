Cosmetics.define({ pack: 'skin-a-gem', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'gem_ruby', name: 'Ruby', rarity: 'common', tags: ['gem', 'red'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#e53935', '#7f0000']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, -0.9 * r], [0.7 * r, -0.4 * r], [0, 0.2 * r]], '#ff5252');
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [-0.2 * r, 0.9 * r]], '#b71c1c');
            u.poly(g, [[0.7 * r, -0.4 * r], [0, 0.2 * r], [0.2 * r, 0.9 * r]], '#c62828');
            u.line(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [0.7 * r, -0.4 * r]], '#ffcdd2', 0.08 * r);
        },
    },
    {
        id: 'gem_sapphire', name: 'Sapphire', rarity: 'common', tags: ['gem', 'blue'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#1e88e5', '#0d2a6b']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, -0.9 * r], [0.7 * r, -0.4 * r], [0, 0.2 * r]], '#42a5f5');
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [-0.2 * r, 0.9 * r]], '#0d47a1');
            u.poly(g, [[0.7 * r, -0.4 * r], [0, 0.2 * r], [0.2 * r, 0.9 * r]], '#1565c0');
            u.line(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [0.7 * r, -0.4 * r]], '#bbdefb', 0.08 * r);
        },
    },
    {
        id: 'gem_emerald', name: 'Emerald', rarity: 'common', tags: ['gem', 'green'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#43a047', '#1b5e20']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.6 * r, -0.6 * r], [0.6 * r, -0.6 * r], [0.5 * r, 0.6 * r], [-0.5 * r, 0.6 * r]], '#81c784');
            u.poly(g, [[-0.35 * r, -0.3 * r], [0.35 * r, -0.3 * r], [0.3 * r, 0.3 * r], [-0.3 * r, 0.3 * r]], '#66bb6a');
            u.line(g, [[-0.6 * r, -0.6 * r], [0.6 * r, -0.6 * r], [0.5 * r, 0.6 * r], [-0.5 * r, 0.6 * r], [-0.6 * r, -0.6 * r]], '#c8e6c9', 0.07 * r);
        },
    },
    {
        id: 'gem_amber', name: 'Amber', rarity: 'common', tags: ['gem', 'orange'],
        fill: (g, c) => u.radial(g, -0.4 * c.r, -0.6 * c.r, 0.1 * c.r, 0, 0, 1.6 * c.r, ['#ffe082', '#ff8f00', '#8a4b00']),
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.45 * r, -0.7 * r, 0.3 * r, 0.18 * r, -0.5, 'rgba(255,255,255,0.7)');
        },
    },
    {
        id: 'gem_amethyst', name: 'Amethyst', rarity: 'common', tags: ['gem', 'purple'],
        fill: (g, c) => u.linear(g, -c.r, -c.r, c.r, c.r, ['#ce93d8', '#8e24aa', '#38006b']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[0, -1.0 * r], [0.5 * r, -0.4 * r], [0.35 * r, 0.5 * r], [0, 0.9 * r]], 'rgba(255,255,255,0.18)');
            u.line(g, [[0, -1.0 * r], [0, 0.9 * r]], 'rgba(255,255,255,0.35)', 0.06 * r);
        },
    },
    {
        id: 'gem_opal', name: 'Opal', rarity: 'rare', tags: ['gem', 'pearl'],
        fill: '#f7f4ff',
        pattern: ['blobs', ['#ffccf9', '#b9fbc0', '#a0e7ff', '#fff5ba'], 6, 7],
    },
    {
        id: 'gem_topaz', name: 'Topaz', rarity: 'rare', tags: ['gem', 'yellow'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#fdd835', '#f9a825']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, -0.9 * r], [0.7 * r, -0.4 * r], [0, 0.2 * r]], '#fff59d');
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [-0.2 * r, 0.9 * r]], '#f57f17');
            u.poly(g, [[0.7 * r, -0.4 * r], [0, 0.2 * r], [0.2 * r, 0.9 * r]], '#fbc02d');
            u.line(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [0.7 * r, -0.4 * r]], '#fffde7', 0.08 * r);
        },
    },
    {
        id: 'gem_diamond', name: 'Diamond', rarity: 'epic', tags: ['gem', 'white', 'sparkle'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#e0f7fa', '#80deea']),
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, -0.9 * r], [0.7 * r, -0.4 * r], [0, 0.2 * r]], '#ffffff');
            u.poly(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [-0.2 * r, 0.9 * r]], '#4dd0e1');
            u.poly(g, [[0.7 * r, -0.4 * r], [0, 0.2 * r], [0.2 * r, 0.9 * r]], '#00acc1');
            u.line(g, [[-0.7 * r, -0.4 * r], [0, 0.2 * r], [0.7 * r, -0.4 * r]], '#ffffff', 0.08 * r);
            u.star(g, 0.5 * r, -0.8 * r, 0.3 * r, 0.08 * r, 4, '#ffffff');
        },
    },
    {
        id: 'gem_obsidian', name: 'Obsidian', rarity: 'common', tags: ['gem', 'black'],
        fill: (g, c) => u.linear(g, 0, -1.3 * c.r, 0, 1.7 * c.r, ['#3a3a3a', '#0a0a0a']),
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.3 * r, -0.6 * r, 0.45 * r, 0.12 * r, -0.6, 'rgba(255,255,255,0.4)');
            u.line(g, [[0.2 * r, -0.2 * r], [0.6 * r, 0.6 * r]], 'rgba(255,255,255,0.15)', 0.1 * r);
        },
    },
    {
        id: 'gem_rainbow', name: 'Prism', rarity: 'legendary', tags: ['gem', 'rainbow', 'animated'], anim: true,
        fill: '#ffffff',
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 8; i++) {
                g.fillStyle = `hsl(${(i * 45 + c.t / 15) % 360}, 90%, 60%)`;
                g.fillRect(-r + i * 0.25 * r, -1.3 * r, 0.25 * r, 3 * r);
            }
            u.ellipse(g, -0.3 * r, -0.7 * r, 0.3 * r, 0.12 * r, -0.6, 'rgba(255,255,255,0.7)');
        },
    },
]);
