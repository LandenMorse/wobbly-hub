// Base boots (the originals). Most boots only need colors: [body, sole].
Cosmetics.define({ pack: 'boots-base', category: 'boots', author: 'core' }, (u) => [
    { id: 'none',   name: 'None' },
    { id: 'cleats', name: 'Cleats',     colors: ['#dfe6e9', '#2d3436'] },
    { id: 'sneaks', name: 'Sneakers',   colors: ['#ecf0f1', '#e74c3c'] },
    { id: 'rain',   name: 'Rain Boots', colors: ['#f1c40f', '#7f6000'] },
    {
        id: 'rocket', name: 'Rocket Boots', colors: ['#e84393', '#ffeaa7'], anim: true, rarity: 'rare',
        under(g, c, x) {   // exhaust flame under each foot
            const r = c.r, flick = Math.sin(c.t * 0.03 + x) * 0.08 * r;
            u.poly(g, [[x - 0.12 * r, 1.9 * r], [x + 0.12 * r, 1.9 * r], [x, 2.25 * r + flick]], '#ff7675');
        }
    },
    { id: 'gold',   name: 'Gold Boots', colors: ['#f9ca24', '#a67c00'], rarity: 'epic' }
]);
