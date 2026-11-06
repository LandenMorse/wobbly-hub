Cosmetics.define({ pack: 'acc-c-ocean', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'ocean_snorkel', name: 'Snorkel Mask', rarity: 'common', tags: ['ocean', 'beach', 'eyewear'],
        draw(g, c) {
            const r = c.r;
            const ex = 0.4 * r, ey = -0.4 * r, rr = 0.3 * r;
            // goggle lenses over both eyes
            u.circle(g, -ex, ey, rr, 'rgba(56,189,248,0.35)', '#0f172a', 2.5);
            u.circle(g, ex, ey, rr, 'rgba(56,189,248,0.35)', '#0f172a', 2.5);
            // bridge between lenses
            u.line(g, [[-ex + rr, ey], [ex - rr, ey]], '#0f172a', 2.5, 'round');
            // curved snorkel tube on the side the player faces
            u.line(g, [[0.85 * r * c.look, -0.2 * r], [1.2 * r * c.look, -0.9 * r], [1.05 * r * c.look, -1.3 * r], [0.8 * r * c.look, -1.35 * r]], '#ef4444', 4, 'round');
        }
    },
    {
        id: 'ocean_shell', name: 'Shell Necklace', rarity: 'common', tags: ['ocean', 'beach', 'necklace'],
        draw(g, c) {
            const r = c.r;
            // string of small shells sagging across the chest
            u.line(g, [[-0.9 * r, 0.45 * r], [0, 0.7 * r], [0.9 * r, 0.45 * r]], '#a16207', 1.5, 'round');
            const xs = [-0.8, -0.5, -0.2, 0.2, 0.5, 0.8];
            for (let i = 0; i < xs.length; i++) {
                const x = xs[i] * r;
                const y = (0.45 + 0.25 * (1 - (xs[i] / 0.9) * (xs[i] / 0.9))) * r;
                u.circle(g, x, y, 0.1 * r, i % 2 ? '#ffffff' : '#fbcfe8', '#f9a8d4', 1.5);
            }
        }
    },
    {
        id: 'ocean_lei', name: 'Flower Lei', rarity: 'common', tags: ['ocean', 'beach', 'flowers'],
        draw(g, c) {
            const r = c.r;
            // green string of the lei around the neck
            u.ellipse(g, 0, 0.5 * r, 0.85 * r, 0.22 * r, 0, null, '#65a30d', 2);
            const cols = ['#f43f5e', '#facc15', '#a855f7', '#fb923c', '#ec4899'];
            for (let i = 0; i < 10; i++) {
                const a = i * Math.PI * 2 / 10;
                const x = Math.cos(a) * 0.85 * r;
                const y = 0.5 * r + Math.sin(a) * 0.22 * r;
                u.circle(g, x, y, 0.11 * r, cols[i % cols.length], '#9f1239', 1);
            }
        }
    },
    {
        id: 'ocean_lifering', name: 'Life Ring', rarity: 'common', tags: ['ocean', 'beach', 'float'],
        draw(g, c) {
            const r = c.r;
            // red ring
            u.ellipse(g, 0, 1.0 * r, 1.3 * r, 0.45 * r, 0, null, '#dc2626', 0.3 * r);
            // white stripes over the red ring
            g.save();
            g.setLineDash([0.45 * r, 0.45 * r]);
            u.ellipse(g, 0, 1.0 * r, 1.3 * r, 0.45 * r, 0, null, '#ffffff', 0.3 * r);
            g.restore();
            u.ellipse(g, 0, 1.0 * r, 1.3 * r, 0.45 * r, 0, null, '#7f1d1d', 1);
        }
    },
    {
        id: 'ocean_starfish', name: 'Starfish Pin', rarity: 'common', tags: ['ocean', 'beach', 'pin'],
        draw(g, c) {
            const r = c.r;
            u.star(g, 0.5 * r * c.look, 0.95 * r, 0.24 * r, 0.11 * r, 5, '#fb923c', '#c2410c', 1.5);
        }
    },
    {
        id: 'ocean_pearl', name: 'Pearl Earring', rarity: 'common', tags: ['ocean', 'jewelry'],
        draw(g, c) {
            const r = c.r;
            const x = 1.0 * r * c.look;
            // hook/post line
            u.line(g, [[x, -0.1 * r], [x, 0.18 * r]], '#d4af37', 1.5, 'round');
            // glossy pearl
            const px = x, py = 0.3 * r, pr = 0.12 * r;
            u.circle(g, px, py, pr, u.radial(g, px - pr * 0.3, py - pr * 0.3, 1, px, py, pr, ['#ffffff', '#bae6fd']), '#7dd3fc', 1);
        }
    },
    {
        id: 'ocean_anchor', name: 'Anchor Charm', rarity: 'rare', tags: ['ocean', 'sailor', 'necklace'],
        draw(g, c) {
            const r = c.r;
            const navy = '#1e3a8a';
            // chain
            u.line(g, [[-0.6 * r, 0.2 * r], [0, 0.7 * r], [0.6 * r, 0.2 * r]], '#cbd5e1', 2.5, 'round');
            // anchor ring at top
            u.circle(g, 0, 0.8 * r, 0.1 * r, null, navy, 3);
            // shaft
            u.line(g, [[0, 0.9 * r], [0, 1.6 * r]], navy, 4, 'round');
            // crossbar
            u.line(g, [[-0.2 * r, 1.0 * r], [0.2 * r, 1.0 * r]], navy, 4, 'round');
            // curved flukes
            u.line(g, [[-0.4 * r, 1.15 * r], [-0.3 * r, 1.45 * r], [0, 1.6 * r], [0.3 * r, 1.45 * r], [0.4 * r, 1.15 * r]], navy, 4, 'round');
        }
    },
    {
        id: 'ocean_crab', name: 'Crab Buddy', rarity: 'rare', tags: ['ocean', 'beach', 'pet'],
        draw(g, c) {
            const r = c.r;
            const cx = 0.9 * r * c.look, cy = 0.3 * r;
            const red = '#dc2626', dark = '#7f1d1d';
            // legs
            u.line(g, [[cx - 0.15 * r, cy + 0.12 * r], [cx - 0.25 * r, cy + 0.3 * r]], dark, 2, 'round');
            u.line(g, [[cx + 0.15 * r, cy + 0.12 * r], [cx + 0.25 * r, cy + 0.3 * r]], dark, 2, 'round');
            // claws
            u.line(g, [[cx - 0.2 * r, cy - 0.02 * r], [cx - 0.3 * r, cy - 0.12 * r]], dark, 2.5, 'round');
            u.line(g, [[cx + 0.2 * r, cy - 0.02 * r], [cx + 0.3 * r, cy - 0.12 * r]], dark, 2.5, 'round');
            u.circle(g, cx - 0.32 * r, cy - 0.16 * r, 0.09 * r, red, dark, 1.5);
            u.circle(g, cx + 0.32 * r, cy - 0.16 * r, 0.09 * r, red, dark, 1.5);
            // body
            u.ellipse(g, cx, cy, 0.25 * r, 0.16 * r, 0, red, dark, 1.5);
            // eyes on stalks
            u.circle(g, cx - 0.08 * r, cy - 0.16 * r, 0.05 * r, '#ffffff', dark, 1);
            u.circle(g, cx + 0.08 * r, cy - 0.16 * r, 0.05 * r, '#ffffff', dark, 1);
        }
    },
    {
        id: 'ocean_trident', name: 'Trident', rarity: 'epic', tags: ['ocean', 'sea', 'weapon'],
        draw(g, c) {
            const r = c.r;
            const cx = 1.4 * r * c.look;
            const gold = '#facc15', dark = '#a16207';
            // shaft
            u.line(g, [[cx, 0.4 * r], [cx, 1.9 * r]], dark, 6, 'round');
            u.line(g, [[cx, 0.4 * r], [cx, 1.9 * r]], gold, 3, 'round');
            // three prongs
            u.line(g, [[cx - 0.22 * r, 0], [cx - 0.12 * r, 0.3 * r], [cx, 0.42 * r]], gold, 4, 'round');
            u.line(g, [[cx + 0.22 * r, 0], [cx + 0.12 * r, 0.3 * r], [cx, 0.42 * r]], gold, 4, 'round');
            u.line(g, [[cx, 0], [cx, 0.42 * r]], gold, 4, 'round');
            // crossguard
            u.line(g, [[cx - 0.2 * r, 0.55 * r], [cx + 0.2 * r, 0.55 * r]], dark, 3, 'round');
        }
    },
    {
        id: 'ocean_bubbles', name: 'Bubble Trail', rarity: 'legendary', tags: ['ocean', 'bubbles', 'animated'], anim: true,
        draw(g, c) {
            const r = c.r;
            const xs = [-1.35, -0.95, 0.95, 1.3, 1.5];
            const sizes = [0.12, 0.09, 0.11, 0.1, 0.08];
            for (let i = 0; i < xs.length; i++) {
                // each bubble rises on a repeating loop, staggered by index
                const ph = (c.t / 1800 + i * 0.2) % 1;
                const x = xs[i] * r;
                const y = (1.6 - ph * 2.6) * r;
                const br = sizes[i] * r;
                u.circle(g, x, y, br, 'rgba(125,211,252,0.35)', 'rgba(255,255,255,0.85)', 1.5);
                u.circle(g, x - br * 0.35, y - br * 0.35, br * 0.25, 'rgba(255,255,255,0.8)', null);
            }
        }
    },
]);
