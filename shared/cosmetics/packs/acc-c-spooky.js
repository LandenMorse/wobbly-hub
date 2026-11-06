Cosmetics.define({ pack: 'acc-c-spooky', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'spooky_fangs', name: 'Vampire Fangs', rarity: 'common', tags: ['spooky', 'vampire'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.3 * r, 0.05 * r], [-0.1 * r, 0.05 * r], [-0.2 * r, 0.42 * r]], '#ffffff', '#263238', 2);
            u.poly(g, [[0.1 * r, 0.05 * r], [0.3 * r, 0.05 * r], [0.2 * r, 0.42 * r]], '#ffffff', '#263238', 2);
        }
    },
    {
        id: 'spooky_stitch', name: 'Stitches', rarity: 'common', tags: ['spooky', 'scar'],
        draw(g, c) {
            const r = c.r;
            const s = c.look;
            const x0 = 0.6 * r * s, y0 = -0.15 * r, x1 = 1.1 * r * s, y1 = 0.15 * r;
            u.line(g, [[x0, y0], [x1, y1]], '#3e2723', 2.5, 'round');
            for (let i = 0; i < 4; i++) {
                const t = (i + 0.5) / 4;
                const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
                u.line(g, [[px - 0.06 * r, py - 0.06 * r], [px + 0.06 * r, py + 0.06 * r]], '#3e2723', 2);
            }
        }
    },
    {
        id: 'spooky_bats', name: 'Bat Pin', rarity: 'common', tags: ['spooky', 'bat'],
        draw(g, c) {
            const r = c.r;
            const cy = 0.9 * r;
            g.save(); g.translate(0, cy); g.scale(1.9, 1.9); g.translate(0, -cy);
            u.poly(g, [[0, cy], [-0.2 * r, cy - 0.12 * r], [-0.24 * r, cy + 0.04 * r], [-0.12 * r, cy + 0.02 * r]], '#111111', null);
            u.poly(g, [[0, cy], [0.2 * r, cy - 0.12 * r], [0.24 * r, cy + 0.04 * r], [0.12 * r, cy + 0.02 * r]], '#111111', null);
            u.ellipse(g, 0, cy, 0.1 * r, 0.08 * r, 0, '#111111', null);
            u.circle(g, 0, cy - 0.08 * r, 0.05 * r, '#111111', null);
            u.circle(g, -0.03 * r, cy - 0.09 * r, 0.012 * r, '#ff5252', null);
            u.circle(g, 0.03 * r, cy - 0.09 * r, 0.012 * r, '#ff5252', null);
            g.restore();
        }
    },
    {
        id: 'spooky_cobweb', name: 'Cobweb', rarity: 'common', tags: ['spooky', 'web'],
        draw(g, c) {
            const r = c.r;
            const ax = -1.55 * r, ay = 1.9 * r;
            const angles = [0, 22.5, 45, 67.5, 90];
            for (const deg of angles) {
                const a = deg * Math.PI / 180;
                u.line(g, [[ax, ay], [ax + Math.cos(a) * 0.9 * r, ay - Math.sin(a) * 0.9 * r]], '#9e9e9e', 1.5);
            }
            for (const rad of [0.35, 0.65, 0.9]) {
                g.save();
                g.strokeStyle = '#9e9e9e';
                g.lineWidth = 1.5;
                g.beginPath();
                g.arc(ax, ay, rad * r, -Math.PI / 2, 0);
                g.stroke();
                g.restore();
            }
        }
    },
    {
        id: 'spooky_bolt', name: 'Neck Bolts', rarity: 'common', tags: ['spooky', 'monster'],
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                const x = s * 0.98 * r;
                u.rect(g, x - 0.14 * r, 0.24 * r, 0.28 * r, 0.12 * r, '#9e9e9e', '#263238', 2);
                u.circle(g, x, 0.3 * r, 0.12 * r, '#bdbdbd', '#263238', 2);
            }
        }
    },
    {
        id: 'spooky_cape', name: 'Count Collar', rarity: 'common', tags: ['spooky', 'vampire'],
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.poly(g, [[s * 0.6 * r, 0.9 * r], [s * 0.85 * r, -0.2 * r], [s * 0.4 * r, 0.4 * r]], '#111111', null);
                u.poly(g, [[s * 0.6 * r, 0.8 * r], [s * 0.76 * r, -0.05 * r], [s * 0.45 * r, 0.4 * r]], '#c62828', null);
            }
            u.line(g, [[-0.6 * r, 0.6 * r], [0.6 * r, 0.6 * r]], '#111111', 3, 'round');
        }
    },
    {
        id: 'spooky_pumpkin', name: 'Pumpkin Charm', rarity: 'rare', tags: ['spooky', 'harvest'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[0, 0.5 * r], [0, 0.9 * r]], '#5d4037', 1.5);
            u.ellipse(g, 0, 1.12 * r, 0.24 * r, 0.2 * r, 0, '#ff8f00', '#e65100', 1.5);
            u.ellipse(g, -0.11 * r, 1.12 * r, 0.1 * r, 0.19 * r, 0, null, '#e65100', 1.2);
            u.ellipse(g, 0.11 * r, 1.12 * r, 0.1 * r, 0.19 * r, 0, null, '#e65100', 1.2);
            u.rect(g, -0.03 * r, 0.86 * r, 0.06 * r, 0.1 * r, '#5d4037', null);
        }
    },
    {
        id: 'spooky_ghostbuddy', name: 'Ghost Buddy', rarity: 'rare', tags: ['spooky', 'ghost'],
        draw(g, c) {
            const r = c.r;
            const gx = 1.3 * r * c.look, gy = 0.8 * r;
            u.poly(g, [
                [gx - 0.22 * r, gy], [gx + 0.22 * r, gy], [gx + 0.22 * r, gy + 0.3 * r],
                [gx + 0.11 * r, gy + 0.2 * r], [gx, gy + 0.3 * r], [gx - 0.11 * r, gy + 0.2 * r],
                [gx - 0.22 * r, gy + 0.3 * r]
            ], '#ffffff', '#90a4ae', 1.5);
            u.circle(g, gx, gy, 0.22 * r, '#ffffff', '#90a4ae', 1.5);
            u.circle(g, gx - 0.08 * r, gy - 0.04 * r, 0.04 * r, '#263238', null);
            u.circle(g, gx + 0.08 * r, gy - 0.04 * r, 0.04 * r, '#263238', null);
        }
    },
    {
        id: 'spooky_skullmask', name: 'Skull Paint', rarity: 'epic', tags: ['spooky', 'skull'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [
                [-0.9 * r, 0.0], [0.9 * r, 0.0], [0.7 * r, 0.6 * r],
                [0.4 * r, 0.9 * r], [-0.4 * r, 0.9 * r], [-0.7 * r, 0.6 * r]
            ], '#f5f5f5', '#212121', 2);
            u.poly(g, [[0, -0.1 * r], [-0.1 * r, 0.05 * r], [0.1 * r, 0.05 * r]], '#212121', null);
            for (let i = -2; i <= 2; i++) {
                const x = i * 0.15 * r;
                u.line(g, [[x, 0.0], [x, 0.25 * r]], '#212121', 1.5);
            }
            u.line(g, [[-0.45 * r, 0.25 * r], [0.45 * r, 0.25 * r]], '#212121', 1.5);
        }
    },
    {
        id: 'spooky_wisp', name: 'Soul Wisp', rarity: 'legendary', tags: ['spooky', 'glow'], anim: true,
        draw(g, c) {
            const r = c.r;
            const a = c.t / 800;
            const x = Math.cos(a) * 1.25 * r;
            const y = 0.2 * r + Math.sin(a) * 0.6 * r;
            const glow = u.radial(g, x, y, 0, x, y, 0.3 * r, ['rgba(180,255,180,0.9)', 'rgba(0,255,100,0)']);
            u.circle(g, x, y, 0.3 * r, glow, null);
            u.circle(g, x, y, 0.09 * r, '#b9ffb9', null);
        }
    },
]);
