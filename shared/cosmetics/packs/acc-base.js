// Base accessories (the originals). Drawn over the face, after the eyes.
Cosmetics.define({ pack: 'acc-base', category: 'acc', author: 'core' }, (u) => [
    { id: 'none', name: 'None' },
    {
        id: 'shades', name: 'Shades',
        draw(g, c) {
            const e = u.eyes(c);
            u.circle(g, e.x, e.y, 10, '#111111');
            u.circle(g, e.other, e.y, 10, '#111111');
            u.line(g, [[e.other, e.y], [e.x, e.y]], '#111111', 3, 'butt');
        }
    },
    {
        id: 'mustache', name: 'Mustache',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.22 * r, 0.12 * r, 0.3 * r, 0.1 * r, 0.35, '#3d2314');
            u.ellipse(g, 0.22 * r, 0.12 * r, 0.3 * r, 0.1 * r, -0.35, '#3d2314');
        }
    },
    {
        id: 'bowtie', name: 'Bow Tie',
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[0, 0.95 * r], [-0.3 * r, 0.75 * r], [-0.3 * r, 1.15 * r]], '#e74c3c');
            u.poly(g, [[0, 0.95 * r], [0.3 * r, 0.75 * r], [0.3 * r, 1.15 * r]], '#e74c3c');
            u.circle(g, 0, 0.95 * r, 0.09 * r, '#c0392b');
        }
    },
    {
        id: 'scarf', name: 'Scarf', anim: true,
        draw(g, c) {
            const r = c.r, look = c.look;
            g.fillStyle = '#e17055';
            g.fillRect(-1.0 * r, -0.2 * r, 2.0 * r, 0.22 * r);
            u.poly(g, [[look * 0.35 * r, 0.02 * r], [look * 0.7 * r, 0.02 * r], [look * 0.6 * r, 0.9 * r + Math.sin(c.t * 0.008) * 3], [look * 0.3 * r, 0.8 * r]], '#e17055');
        }
    },
    {
        id: 'medal', name: 'Medal', rarity: 'rare',
        draw(g, c) {
            const r = c.r, look = c.look;
            u.line(g, [[-0.3 * r, 0.1 * r], [look * 0.4 * r, 0.6 * r]], '#2980b9', 3, 'butt');
            u.circle(g, look * 0.4 * r, 0.7 * r, 0.2 * r, '#f1c40f', '#b7950b', 2);
        }
    }
]);
