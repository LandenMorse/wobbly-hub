Cosmetics.define({ pack: 'skin-a-cosmic', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'cosmic_moon', name: 'Moon', rarity: 'common', tags: ['space', 'grey'],
        fill: '#b0bec5',
        draw(g, c) {
            const r = c.r;
            u.circle(g, -0.4 * r, 0.2 * r, 0.32 * r, '#78909c');
            u.circle(g, 0.45 * r, -0.5 * r, 0.22 * r, '#78909c');
            u.circle(g, 0.3 * r, 0.9 * r, 0.28 * r, '#78909c');
            u.circle(g, -0.5 * r, -0.6 * r, 0.15 * r, '#78909c');
        },
    },
    {
        id: 'cosmic_mars', name: 'Mars', rarity: 'common', tags: ['space', 'red'],
        fill: '#e65100',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.5 * r, 0.1 * r, 0.45 * r, 0.3 * r, 0.3, '#7f2704');
            u.ellipse(g, 0.5 * r, -0.4 * r, 0.35 * r, 0.25 * r, 0, '#7f2704');
            u.ellipse(g, 0.2 * r, 0.9 * r, 0.5 * r, 0.25 * r, -0.2, '#8d3a12');
            u.circle(g, -0.3 * r, -0.8 * r, 0.2 * r, '#8d3a12');
        },
    },
    {
        id: 'cosmic_saturn', name: 'Saturn', rarity: 'common', tags: ['space', 'tan'],
        fill: '#d7b98e',
        pattern: [['band', '#a67c52', 0.25, 0.3]],
        extras(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 0.25 * r, 1.9 * r, 0.32 * r, -0.15, null, '#c9a66b', 0.14 * r);
        },
    },
    {
        id: 'cosmic_comet', name: 'Comet', rarity: 'common', tags: ['space', 'ice'],
        fill: (g, c) => u.linear(g, 0, -c.r, 0, c.r * 1.7, ['#ffffff', '#81d4fa']),
        extras(g, c) {
            const r = c.r;
            u.poly(g, [[-c.look * 0.6 * r, -0.5 * r], [-c.look * 2.3 * r, 0], [-c.look * 0.6 * r, 0.5 * r]], 'rgba(179,229,252,0.8)');
            u.poly(g, [[-c.look * 0.6 * r, -0.2 * r], [-c.look * 1.9 * r, 0.1 * r], [-c.look * 0.6 * r, 0.3 * r]], '#ffffff');
        },
    },
    {
        id: 'cosmic_alien', name: 'Little Green', rarity: 'common', tags: ['space', 'alien'],
        fill: '#7cb342',
        draw(g, c) {
            const r = c.r;
            u.circle(g, -0.5 * r, -0.3 * r, 0.35 * r, '#33691e');
            u.circle(g, 0.55 * r, 0.3 * r, 0.4 * r, '#33691e');
            u.ellipse(g, -0.1 * r, 1.0 * r, 0.45 * r, 0.3 * r, 0, '#33691e');
        },
        extras(g, c) {
            const r = c.r;
            u.line(g, [[0, -1.2 * r], [0, -2.2 * r]], '#558b2f', 0.1 * r, 'round');
            u.circle(g, 0, -2.3 * r, 0.16 * r, '#c6ff00', '#33691e', 0.05 * r);
        },
    },
    {
        id: 'cosmic_astro', name: 'Astronaut', rarity: 'common', tags: ['space', 'suit'],
        fill: '#f5f5f5',
        pattern: [['collar', '#ff7043']],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -r, -1.0 * r, 2 * r, 0.3 * r, '#263238');
            u.rect(g, -r, -0.9 * r, 2 * r, 0.1 * r, '#90a4ae');
        },
    },
    {
        id: 'cosmic_nebula', name: 'Nebula', rarity: 'rare', tags: ['space', 'purple'],
        fill: (g, c) => u.radial(g, 0, 0.2 * c.r, 0.2 * c.r, 0, 0.2 * c.r, 1.6 * c.r, ['#f48fb1', '#6a1b9a']),
        draw(g, c) {
            const r = c.r, rnd = u.rng(7);
            u.circle(g, -0.5 * r, -0.2 * r, 0.55 * r, 'rgba(206,147,216,0.6)');
            u.circle(g, 0.5 * r, 0.5 * r, 0.6 * r, 'rgba(244,143,177,0.55)');
            u.circle(g, 0.1 * r, -0.7 * r, 0.4 * r, 'rgba(186,104,200,0.6)');
            for (let i = 0; i < 12; i++) u.circle(g, (rnd() * 1.8 - 0.9) * r, (rnd() * 2.6 - 1.0) * r, 0.05 * r, '#ffffff');
        },
    },
    {
        id: 'cosmic_blackhole', name: 'Black Hole', rarity: 'rare', tags: ['space', 'dark'],
        fill: '#0a0a0f',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, 0.2 * r, 1.1 * r, 0.45 * r, -0.3, null, '#9c27b0', 0.2 * r);
            u.ellipse(g, 0, 0.2 * r, 0.8 * r, 0.3 * r, -0.3, null, '#ce93d8', 0.08 * r);
            u.circle(g, 0, 0.2 * r, 0.3 * r, '#000000');
        },
    },
    {
        id: 'cosmic_supernova', name: 'Supernova', rarity: 'epic', tags: ['space', 'star'], anim: true,
        fill: (g, c) => u.linear(g, 0, -c.r, 0, c.r * 1.7, ['#ffb74d', '#ef6c00']),
        draw(g, c) {
            const r = c.r;
            const pulse = 1 + 0.15 * Math.sin(c.t / 200);
            u.star(g, 0, 0.2 * r, 1.4 * r * pulse, 0.55 * r, 10, '#fff176', '#ffeb3b', 0.05 * r);
            u.circle(g, 0, 0.2 * r, 0.35 * r, '#ffffff');
        },
    },
    {
        id: 'cosmic_quasar', name: 'Quasar', rarity: 'legendary', tags: ['space', 'rainbow'], anim: true,
        fill: (g, c) => u.radial(g, 0, 0.2 * c.r, 0.1 * c.r, 0, 0.2 * c.r, 1.5 * c.r, ['#303f9f', '#12124a']),
        draw(g, c) {
            const r = c.r;
            const cols = ['#ff1744', '#ff9100', '#ffea00', '#00e676', '#00b0ff', '#d500f9'];
            const off = Math.floor(c.t / 250);
            for (let i = 0; i < cols.length; i++) {
                u.circle(g, 0, 0.2 * r, (1.1 - i * 0.13) * r, null, cols[(i + off) % cols.length], 0.12 * r);
            }
            u.circle(g, 0, 0.2 * r, 0.2 * r, '#ffffff');
        },
    },
]);
