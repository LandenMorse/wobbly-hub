Cosmetics.define({ pack: 'acc-c-glam', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'glam_chain', name: 'Gold Chain', rarity: 'common', tags: ['glam', 'bling'],
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 12; i++) {
                const t = i / 11;
                const x = -0.9 * r + 1.8 * r * t;
                const y = 0.5 * r + Math.sin(Math.PI * t) * 0.7 * r;
                u.circle(g, x, y, 0.1 * r, null, '#d4af37', 3);
            }
        }
    },
    {
        id: 'glam_heartshades', name: 'Heart Shades', rarity: 'rare', tags: ['glam', 'eyewear'],
        draw(g, c) {
            const r = c.r;
            const heart = (cx, cy, s) => {
                g.beginPath();
                g.moveTo(cx, cy + s * 0.35);
                g.bezierCurveTo(cx - s * 1.1, cy - s * 0.3, cx - s * 0.5, cy - s * 1.0, cx, cy - s * 0.4);
                g.bezierCurveTo(cx + s * 0.5, cy - s * 1.0, cx + s * 1.1, cy - s * 0.3, cx, cy + s * 0.35);
                g.closePath();
                g.fillStyle = '#ff5fa2';
                g.fill();
                g.strokeStyle = '#8a1f4f';
                g.lineWidth = 2;
                g.stroke();
            };
            u.line(g, [[-0.12 * r, -0.5 * r], [0.12 * r, -0.5 * r]], '#8a1f4f', 2.5);
            heart(-0.4 * r, -0.35 * r, 0.32 * r);
            heart(0.4 * r, -0.35 * r, 0.32 * r);
        }
    },
    {
        id: 'glam_bowtie_dot', name: 'Polka Bow', rarity: 'common', tags: ['party', 'bow'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.08 * r, 0.6 * r], [-0.75 * r, 0.35 * r], [-0.75 * r, 0.85 * r]], '#dc2626', '#7f1d1d', 1.5);
            u.poly(g, [[0.08 * r, 0.6 * r], [0.75 * r, 0.35 * r], [0.75 * r, 0.85 * r]], '#dc2626', '#7f1d1d', 1.5);
            u.rect(g, -0.1 * r, 0.48 * r, 0.2 * r, 0.24 * r, '#b91c1c', '#7f1d1d', 1.5);
            u.circle(g, -0.45 * r, 0.5 * r, 0.07 * r, '#ffffff');
            u.circle(g, -0.45 * r, 0.72 * r, 0.07 * r, '#ffffff');
            u.circle(g, 0.45 * r, 0.5 * r, 0.07 * r, '#ffffff');
            u.circle(g, 0.45 * r, 0.72 * r, 0.07 * r, '#ffffff');
        }
    },
    {
        id: 'glam_pearls', name: 'Pearl String', rarity: 'common', tags: ['glam', 'neck'],
        draw(g, c) {
            const r = c.r;
            const pts = [];
            for (let i = 0; i < 9; i++) {
                const t = i / 8;
                pts.push([-0.85 * r + 1.7 * r * t, 0.1 * r + Math.sin(Math.PI * t) * 0.5 * r]);
            }
            u.line(g, pts, '#c9c3b5', 1.5);
            for (const p of pts) {
                u.circle(g, p[0], p[1], 0.1 * r, '#fdfcf7', '#b8b3a6', 1);
            }
        }
    },
    {
        id: 'glam_tie', name: 'Power Tie', rarity: 'common', tags: ['office', 'tie'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.15 * r, 0.5 * r], [0.15 * r, 0.5 * r], [0.25 * r, 0.6 * r], [0.2 * r, 1.6 * r], [0, 1.8 * r], [-0.2 * r, 1.6 * r], [-0.25 * r, 0.6 * r]], c.team, '#222222', 1.5);
            u.line(g, [[-0.22 * r, 1.0 * r], [0.22 * r, 1.1 * r]], '#ffffff', 3);
            u.poly(g, [[-0.18 * r, 0.45 * r], [0.18 * r, 0.45 * r], [0.14 * r, 0.72 * r], [-0.14 * r, 0.72 * r]], c.team, '#222222', 1.5);
        }
    },
    {
        id: 'glam_cape', name: 'Hero Cape', rarity: 'common', tags: ['hero', 'cape'],
        draw(g, c) {
            const r = c.r;
            const b = -c.look;
            u.poly(g, [[b * 0.2 * r, -0.6 * r], [b * 0.9 * r, -0.1 * r], [b * 1.5 * r, 1.6 * r], [b * 0.7 * r, 1.9 * r], [b * 0.2 * r, 0.9 * r]], c.team, 'rgba(0,0,0,0.3)', 1.5);
        }
    },
    {
        id: 'glam_monoc', name: 'Gem Monocle', rarity: 'common', tags: ['fancy', 'eyewear'],
        draw(g, c) {
            const r = c.r;
            const e = u.eyes(c);
            u.circle(g, e.x, e.y, 0.35 * r, null, '#d4af37', 2.5);
            u.line(g, [[e.x, e.y + 0.35 * r], [e.x + 0.12 * r * c.look, 0.6 * r]], '#d4af37', 1.5);
            u.circle(g, e.x, e.y - 0.35 * r, 0.08 * r, '#2563eb', '#1e3a8a', 1);
        }
    },
    {
        id: 'glam_sash', name: 'Winner Sash', rarity: 'common', tags: ['winner', 'sash'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.95 * r, 0.1 * r], [-0.7 * r, 0.0 * r], [0.95 * r, 1.55 * r], [0.75 * r, 1.8 * r]], '#d4af37', '#8a6d12', 2);
        }
    },
    {
        id: 'glam_diamond', name: 'Diamond Pendant', rarity: 'epic', tags: ['glam', 'jewel'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.8 * r, 0.25 * r], [0, 0.85 * r], [0.8 * r, 0.25 * r]], '#d4af37', 2.5);
            u.poly(g, [[0, 0.85 * r], [0.3 * r, 1.1 * r], [0, 1.55 * r], [-0.3 * r, 1.1 * r]],
                u.linear(g, -0.3 * r, 0.85 * r, 0.3 * r, 1.55 * r, ['#e0f7ff', '#38bdf8', '#0ea5e9']), '#0369a1', 1.5);
            u.line(g, [[-0.3 * r, 1.1 * r], [0.3 * r, 1.1 * r]], '#bae6fd', 1.5);
            u.line(g, [[-0.12 * r, 1.1 * r], [0, 0.85 * r], [0.12 * r, 1.1 * r]], '#bae6fd', 1.5);
            u.star(g, 0.3 * r, 0.9 * r, 0.14 * r, 0.04 * r, 4, '#ffffff', null);
            u.star(g, -0.35 * r, 1.45 * r, 0.09 * r, 0.03 * r, 4, '#ffffff', null);
        }
    },
    {
        id: 'glam_aura', name: 'Star Aura', rarity: 'legendary', tags: ['magic', 'stars'], anim: true,
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 6; i++) {
                const a = c.t / 1000 * 0.8 + i * Math.PI / 3;
                const x = Math.cos(a) * 1.3 * r;
                const y = 0.25 * r + Math.sin(a) * 0.85 * r;
                const size = (0.11 + 0.04 * Math.sin(c.t / 200 + i)) * r;
                u.star(g, x, y, size, size * 0.45, 5, '#fcd34d', '#b45309', 1);
            }
        }
    },
]);
