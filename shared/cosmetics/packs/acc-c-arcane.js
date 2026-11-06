Cosmetics.define({ pack: 'acc-c-arcane', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'arcane_wand', name: 'Magic Wand', rarity: 'common', tags: ['magic', 'fantasy'],
        draw(g, c) {
            const r = c.r; const cx = 1.3 * r * c.look;
            u.line(g, [[cx, 1.3 * r], [cx - 0.2 * r * c.look, -0.6 * r]], '#5b3a1a', 5, 'round');
            u.star(g, cx, -0.9 * r, 0.32 * r, 0.14 * r, 5, '#fde047', '#713f12', 2);
        }
    },
    {
        id: 'arcane_amulet', name: 'Moon Amulet', rarity: 'common', tags: ['magic', 'jewel'],
        draw(g, c) {
            const r = c.r; const R = 0.3 * r;
            u.line(g, [[-0.55 * r, 0.1 * r], [0, 0.6 * r], [0.55 * r, 0.1 * r]], '#713f12', 2.5, 'round');
            g.beginPath();
            g.arc(0, 0.9 * r, R, Math.PI * 0.4, Math.PI * 1.6, false);
            g.arc(0.14 * r, 0.9 * r, R * 0.85, Math.PI * 1.5, Math.PI * 0.5, true);
            g.closePath();
            g.fillStyle = '#fde047'; g.fill();
            g.strokeStyle = '#713f12'; g.lineWidth = 2; g.stroke();
        }
    },
    {
        id: 'arcane_cloak', name: 'Wizard Cloak', rarity: 'common', tags: ['magic', 'clothing'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.05 * r, 0.3 * r], [1.05 * r, 0.3 * r], [1.25 * r, 1.1 * r], [0, 1.35 * r], [-1.25 * r, 1.1 * r]], '#7e22ce', '#3b0764', 2.5);
            u.line(g, [[-0.9 * r, 0.55 * r], [0.9 * r, 0.55 * r]], '#a855f7', 2);
            u.circle(g, 0, 0.42 * r, 0.17 * r, '#facc15', '#713f12', 2);
        }
    },
    {
        id: 'arcane_book', name: 'Spell Book', rarity: 'common', tags: ['magic', 'book'],
        draw(g, c) {
            const r = c.r; const cx = 1.3 * r * c.look;
            u.rect(g, cx - 0.35 * r, 0.1 * r, 0.7 * r, 0.95 * r, '#8d4e1f', '#3b1f0b', 2);
            u.rect(g, cx - 0.28 * r, 0.2 * r, 0.56 * r, 0.75 * r, '#f5e6c8', null, 0);
            u.star(g, cx, 0.5 * r, 0.2 * r, 0.09 * r, 5, '#facc15', '#713f12', 1.5);
        }
    },
    {
        id: 'arcane_potion', name: 'Potion Flask', rarity: 'common', tags: ['magic', 'potion'],
        draw(g, c) {
            const r = c.r; const cx = 1.3 * r * c.look;
            u.rect(g, cx - 0.1 * r, 0.1 * r, 0.2 * r, 0.3 * r, '#e5e7eb', '#374151', 2);
            u.rect(g, cx - 0.13 * r, -0.05 * r, 0.26 * r, 0.12 * r, '#92400e', '#3b1f0b', 1.5);
            u.circle(g, cx, 0.8 * r, 0.32 * r, u.radial(g, cx, 0.8 * r, 0.05 * r, cx, 0.8 * r, 0.32 * r, ['#bbf7d0', '#15803d']), '#14532d', 2);
            u.circle(g, cx - 0.1 * r, 0.7 * r, 0.07 * r, '#dcfce7', null, 0);
            u.circle(g, cx + 0.12 * r, 0.9 * r, 0.05 * r, '#dcfce7', null, 0);
        }
    },
    {
        id: 'arcane_wings', name: 'Fairy Wings', rarity: 'common', tags: ['magic', 'wings'],
        draw(g, c) {
            const r = c.r; const b = -c.look;
            const k = -c.look;
            u.poly(g, [[k * 0.8 * r, 0.1 * r], [k * 1.7 * r, -0.9 * r], [k * 1.9 * r, 0.1 * r], [k * 1.2 * r, 0.7 * r]], 'rgba(186,230,253,0.85)', '#0e7490', 2.5);
            u.poly(g, [[k * 0.8 * r, 0.5 * r], [k * 1.6 * r, 0.6 * r], [k * 1.4 * r, 1.4 * r], [k * 0.8 * r, 1.0 * r]], 'rgba(216,180,254,0.85)', '#6b21a8', 2.5);
        }
    },
    {
        id: 'arcane_orb', name: 'Crystal Orb', rarity: 'rare', tags: ['magic', 'crystal'],
        draw(g, c) {
            const r = c.r; const cx = 1.3 * r * c.look; const cy = 1.0 * r;
            u.rect(g, cx - 0.2 * r, cy + 0.3 * r, 0.4 * r, 0.12 * r, '#5b3a1a', '#2e1a0a', 2);
            u.circle(g, cx, cy, 0.34 * r, u.radial(g, cx - 0.1 * r, cy - 0.1 * r, 0.02 * r, cx, cy, 0.34 * r, ['#f5d0fe', '#7e22ce']), '#3b0764', 2.5);
            u.circle(g, cx - 0.12 * r, cy - 0.12 * r, 0.07 * r, 'rgba(255,255,255,0.8)', null, 0);
        }
    },
    {
        id: 'arcane_rune', name: 'Rune Brand', rarity: 'rare', tags: ['magic', 'rune'],
        draw(g, c) {
            const r = c.r;
            g.save();
            g.shadowColor = '#38bdf8'; g.shadowBlur = 14;
            u.circle(g, 0, 0.9 * r, 0.42 * r, 'rgba(14,30,100,0.55)', '#e0f2fe', 3);
            u.line(g, [[-0.28 * r, 0.6 * r], [0, 1.2 * r], [0.28 * r, 0.6 * r]], '#e0f2fe', 4, 'round');
            u.line(g, [[0, 1.2 * r], [0, 1.6 * r]], '#e0f2fe', 4, 'round');
            u.line(g, [[-0.16 * r, 1.4 * r], [0.16 * r, 1.4 * r]], '#e0f2fe', 4, 'round');
            g.restore();
        }
    },
    {
        id: 'arcane_staff', name: 'Dragon Staff', rarity: 'epic', tags: ['magic', 'staff'],
        draw(g, c) {
            const r = c.r; const cx = 1.4 * r * c.look;
            u.line(g, [[cx, 1.9 * r], [cx, -1.0 * r]], '#5b3a1a', 6, 'round');
            u.poly(g, [[cx - 0.14 * r, -0.9 * r], [cx + 0.14 * r, -0.9 * r], [cx + 0.1 * r, -0.6 * r], [cx - 0.1 * r, -0.6 * r]], '#facc15', '#713f12', 1.5);
            u.circle(g, cx, -1.2 * r, 0.22 * r, u.radial(g, cx - 0.06 * r, -1.26 * r, 0.02 * r, cx, -1.2 * r, 0.22 * r, ['#fca5a5', '#b91c1c']), '#7f1d1d', 2.5);
        }
    },
    {
        id: 'arcane_ring', name: 'Rune Ring', rarity: 'legendary', tags: ['magic', 'rune', 'animated'], anim: true,
        draw(g, c) {
            const r = c.r;
            const a = c.t / 600;
            u.ellipse(g, 0, 0.9 * r, 1.45 * r, 0.45 * r, 0, null, 'rgba(192,132,252,0.6)', 6);
            u.ellipse(g, 0, 0.9 * r, 1.45 * r, 0.45 * r, 0, null, '#e9d5ff', 2.5);
            for (let i = 0; i < 2; i++) {
                const t = a + i * Math.PI;
                const px = Math.cos(t) * 1.45 * r;
                const py = 0.9 * r + Math.sin(t) * 0.45 * r;
                u.circle(g, px, py, 0.16 * r, 'rgba(240,171,252,0.5)', null, 0);
                u.circle(g, px, py, 0.1 * r, '#f0abfc', '#581c87', 2);
            }
        }
    },
]);
