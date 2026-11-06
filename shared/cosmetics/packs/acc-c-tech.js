Cosmetics.define({ pack: 'acc-c-tech', category: 'acc', author: 'helper' }, (u) => [
    {
        id: 'tech_headset', name: 'Gamer Headset', rarity: 'common', tags: ['gaming', 'tech'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.95 * r, -0.5 * r], [0, -1.25 * r], [0.95 * r, -0.5 * r]], '#263238', 3.5, 'round');
            u.circle(g, -0.95 * r, -0.5 * r, 0.28 * r, '#263238', '#111827', 2);
            u.circle(g, 0.95 * r, -0.5 * r, 0.28 * r, '#263238', '#111827', 2);
            u.line(g, [[-0.95 * r, -0.2 * r], [-0.7 * r, 0.3 * r], [-0.35 * r, 0.45 * r]], '#263238', 2.5, 'round');
            u.circle(g, -0.35 * r, 0.45 * r, 0.1 * r, '#263238');
        }
    },
    {
        id: 'tech_vr', name: 'VR Visor', rarity: 'rare', tags: ['vr', 'eyewear'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-1.25 * r, -0.5 * r], [-1.6 * r, -0.5 * r]], '#111827', 4, 'round');
            u.line(g, [[1.25 * r, -0.5 * r], [1.6 * r, -0.5 * r]], '#111827', 4, 'round');
            u.poly(g, [[-1.2 * r, -0.75 * r], [1.2 * r, -0.75 * r], [1.05 * r, -0.12 * r], [-1.05 * r, -0.12 * r]], '#111827', '#374151', 2);
            u.line(g, [[-0.95 * r, -0.45 * r], [0.95 * r, -0.45 * r]], '#22d3ee', 3, 'round');
        }
    },
    {
        id: 'tech_watch', name: 'Smart Watch', rarity: 'common', tags: ['tech', 'wrist'],
        draw(g, c) {
            const r = c.r;
            const x = 1.1 * r * c.look, y = 1.0 * r;
            u.poly(g, [[x - 0.22 * r, y - 0.9 * r], [x + 0.22 * r, y - 0.9 * r], [x + 0.22 * r, y + 0.9 * r], [x - 0.22 * r, y + 0.9 * r]], '#374151', null);
            u.circle(g, x, y, 0.3 * r, '#1f2937', '#9ca3af', 2);
            u.circle(g, x, y, 0.18 * r, '#22d3ee');
        }
    },
    {
        id: 'tech_earbuds', name: 'Earbuds', rarity: 'common', tags: ['music', 'tech'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.95 * r, 0.05 * r], [-0.8 * r, 0.7 * r], [-0.55 * r, 1.2 * r]], '#e2e8f0', 2, 'round');
            u.line(g, [[0.95 * r, 0.05 * r], [0.8 * r, 0.7 * r], [0.55 * r, 1.2 * r]], '#e2e8f0', 2, 'round');
            u.circle(g, -1.0 * r, -0.1 * r, 0.16 * r, '#f8fafc', '#94a3b8', 1.5);
            u.circle(g, 1.0 * r, -0.1 * r, 0.16 * r, '#f8fafc', '#94a3b8', 1.5);
        }
    },
    {
        id: 'tech_badge', name: 'ID Badge', rarity: 'common', tags: ['work', 'tech'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.45 * r, 0.5 * r], [0, 1.1 * r], [0.45 * r, 0.5 * r]], '#2563eb', 3, 'round');
            u.poly(g, [[-0.25 * r, 1.05 * r], [0.25 * r, 1.05 * r], [0.25 * r, 1.55 * r], [-0.25 * r, 1.55 * r]], '#ffffff', '#94a3b8', 1.5);
            u.rect(g, -0.15 * r, 1.2 * r, 0.3 * r, 0.1 * r, '#2563eb', null);
        }
    },
    {
        id: 'tech_cyberscar', name: 'Cyber Eye', rarity: 'common', tags: ['cyber', 'tech'],
        draw(g, c) {
            const r = c.r;
            const x = 0.9 * r * c.look, y = -0.55 * r;
            u.line(g, [[0.6 * r * c.look, y], [0.7 * r * c.look, y]], '#374151', 2, 'round');
            u.circle(g, x, y, 0.2 * r, '#1f2937', '#7f1d1d', 2);
            u.circle(g, x, y, 0.11 * r, '#ef4444');
        }
    },
    {
        id: 'tech_jetpack', name: 'Jet Pack', rarity: 'rare', tags: ['flight', 'tech'],
        draw(g, c) {
            const r = c.r;
            const bx = (v) => v * c.look * r;
            u.poly(g, [[bx(-1.1), -0.4 * r], [bx(-0.5), -0.4 * r], [bx(-0.5), 1.2 * r], [bx(-1.1), 1.2 * r]], '#9ca3af', '#4b5563', 2);
            u.circle(g, bx(-0.95), 1.3 * r, 0.14 * r, '#f97316', '#7c2d12', 1.5);
            u.circle(g, bx(-0.65), 1.3 * r, 0.14 * r, '#f97316', '#7c2d12', 1.5);
        }
    },
    {
        id: 'tech_hologram', name: 'Hologram Halo', rarity: 'epic', tags: ['magic', 'tech'], anim: true,
        draw(g, c) {
            const r = c.r;
            const bob = 0.05 * r * Math.sin(c.t / 300);
            const pulse = 0.5 + 0.5 * Math.sin(c.t / 400);
            u.ellipse(g, 0, 1.7 * r + bob, 1.0 * r, 0.25 * r, 0, null, `rgba(34,211,238,${(0.5 + 0.5 * pulse).toFixed(3)})`, 2.5);
            u.ellipse(g, 0, 1.7 * r + bob, 0.7 * r, 0.17 * r, 0, null, `rgba(34,211,238,${(0.3 + 0.4 * pulse).toFixed(3)})`, 1.5);
        }
    },
    {
        id: 'tech_antenna', name: 'Antenna Pins', rarity: 'common', tags: ['radio', 'tech'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.8 * r, -0.7 * r], [-1.05 * r, -1.4 * r]], '#475569', 3, 'round');
            u.circle(g, -1.05 * r, -1.4 * r, 0.1 * r, '#ef4444');
            u.line(g, [[0.8 * r, -0.7 * r], [1.05 * r, -1.4 * r]], '#475569', 3, 'round');
            u.circle(g, 1.05 * r, -1.4 * r, 0.1 * r, '#ef4444');
        }
    },
    {
        id: 'tech_circuit', name: 'Circuit Tattoo', rarity: 'rare', tags: ['cyber', 'glow'],
        draw(g, c) {
            const r = c.r;
            g.shadowColor = '#4ade80';
            g.shadowBlur = 6;
            u.line(g, [[-0.85 * r, 0.0 * r], [-0.6 * r, 0.0 * r], [-0.6 * r, 0.25 * r], [-0.4 * r, 0.25 * r]], '#4ade80', 2.5, 'round');
            u.line(g, [[0.85 * r, 0.0 * r], [0.6 * r, 0.0 * r], [0.6 * r, 0.25 * r], [0.4 * r, 0.25 * r]], '#4ade80', 2.5, 'round');
            u.line(g, [[-0.3 * r, 0.9 * r], [-0.3 * r, 1.2 * r], [0.1 * r, 1.2 * r], [0.1 * r, 1.5 * r]], '#4ade80', 2.5, 'round');
            u.circle(g, 0.1 * r, 1.5 * r, 0.07 * r, '#4ade80');
            g.shadowBlur = 0;
            g.shadowColor = 'transparent';
        }
    },
]);
