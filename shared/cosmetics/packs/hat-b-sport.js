Cosmetics.define({ pack: 'hat-b-sport', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'sport_helmet', name: 'Football Helmet', rarity: 'common', tags: ['football', 'team'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.7 * r, 0.95 * r, 0.7 * r, 0, c.team, '#263238', 0.06 * r);
            u.rect(g, -0.1 * r, -2.4 * r, 0.2 * r, 1.4 * r, '#ffffff');
        }
    },
    {
        id: 'sport_baseball', name: 'Baseball Cap', rarity: 'common', tags: ['baseball', 'team'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.55 * r, 0.8 * r, 0.55 * r, 0, c.team);
            u.ellipse(g, 0.5 * c.look * r, -1.02 * r, 0.6 * r, 0.14 * r, -0.15 * c.look, c.team, '#263238', 0.04 * r);
            u.circle(g, 0, -2.08 * r, 0.08 * r, '#ffffff');
        }
    },
    {
        id: 'sport_bike', name: 'Cycling Helmet', rarity: 'common', tags: ['cycling', 'yellow'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.62 * r, 0.92 * r, 0.62 * r, 0, '#fdd835', '#f9a825', 0.05 * r);
            u.rect(g, -0.5 * r, -1.85 * r, 0.22 * r, 0.12 * r, '#f57f17');
            u.rect(g, -0.15 * r, -1.85 * r, 0.22 * r, 0.12 * r, '#f57f17');
            u.rect(g, 0.2 * r, -1.85 * r, 0.22 * r, 0.12 * r, '#f57f17');
        }
    },
    {
        id: 'sport_swim', name: 'Swim Cap', rarity: 'common', tags: ['swim', 'blue'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.65 * r, 0.9 * r, 0.66 * r, 0, '#81d4fa');
            u.rect(g, -0.7 * r, -1.98 * r, 1.4 * r, 0.12 * r, '#ffffff');
        }
    },
    {
        id: 'sport_sweat', name: 'Sweatband', rarity: 'common', tags: ['sweat', 'headband'], clearTop: true,
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.95 * r, -1.25 * r, 1.9 * r, 0.25 * r, '#ffffff');
            u.rect(g, -0.95 * r, -1.12 * r, 1.9 * r, 0.06 * r, '#e53935');
        }
    },
    {
        id: 'sport_boxer', name: 'Boxing Headgear', rarity: 'rare', tags: ['boxing', 'red'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.65 * r, 1.0 * r, 0.65 * r, 0, '#d32f2f');
            u.ellipse(g, -0.85 * r, -1.15 * r, 0.2 * r, 0.25 * r, 0, '#d32f2f');
            u.ellipse(g, 0.85 * r, -1.15 * r, 0.2 * r, 0.25 * r, 0, '#d32f2f');
            u.line(g, [[-0.2 * r, -2.0 * r], [0.2 * r, -1.7 * r]], '#ffffff', 0.08 * r, 'round');
            u.line(g, [[0.2 * r, -2.0 * r], [-0.2 * r, -1.7 * r]], '#ffffff', 0.08 * r, 'round');
        }
    },
    {
        id: 'sport_hockey', name: 'Hockey Mask', rarity: 'rare', tags: ['hockey', 'white'],
        draw(g, c) {
            const r = c.r;
            g.save();
            g.beginPath();
            g.rect(-2 * r, -3 * r, 4 * r, 2.05 * r);
            g.clip();
            u.ellipse(g, 0, -0.95 * r, 0.9 * r, 0.5 * r, 0, '#ffffff', '#9e9e9e', 0.03 * r);
            g.restore();
            for (const x of [-0.45, 0, 0.45]) {
                u.rect(g, (x - 0.04) * r, -1.36 * r, 0.08 * r, 0.41 * r, '#212121');
            }
        }
    },
    {
        id: 'sport_laurel', name: 'Laurel Wreath', rarity: 'epic', tags: ['laurel', 'gold'],
        draw(g, c) {
            const r = c.r;
            const arcs = [[1.0, 0.4, 0], [1.08, 0.46, 0.15]];
            for (const [rx, ry, tilt] of arcs) {
                for (let i = 0; i <= 6; i++) {
                    const a = Math.PI * (1 + i / 6);
                    const px = rx * r * Math.cos(a);
                    const py = -0.95 * r + ry * r * Math.sin(a);
                    u.ellipse(g, px, py, 0.18 * r, 0.08 * r, a + Math.PI / 2 + tilt, i % 2 ? '#f9a825' : '#fdd835', '#b8860b', 0.02 * r);
                }
            }
            const bx = -1.05 * c.look * r;
            u.ellipse(g, bx - 0.12 * r, -0.9 * r, 0.14 * r, 0.1 * r, 0.4, '#fdd835', '#b8860b', 0.02 * r);
            u.ellipse(g, bx + 0.12 * r, -0.9 * r, 0.14 * r, 0.1 * r, -0.4, '#fdd835', '#b8860b', 0.02 * r);
            u.circle(g, bx, -0.9 * r, 0.07 * r, '#b8860b');
        }
    },
    {
        id: 'sport_trophy', name: 'Trophy Cup', rarity: 'epic', tags: ['trophy', 'gold'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.4375 * r, -1.15 * r, 0.875 * r, 0.15 * r, '#b8860b');
            u.rect(g, -0.1125 * r, -1.5625 * r, 0.225 * r, 0.4375 * r, '#ffc107');
            u.ellipse(g, -0.6875 * r, -2.5 * r, 0.175 * r, 0.225 * r, 0, null, '#b8860b', 0.0875 * r);
            u.ellipse(g, 0.6875 * r, -2.5 * r, 0.175 * r, 0.225 * r, 0, null, '#b8860b', 0.0875 * r);
            u.poly(g, [[-0.625 * r, -2.875 * r], [0.625 * r, -2.875 * r], [0.525 * r, -2.1875 * r], [0.1875 * r, -1.6875 * r], [-0.1875 * r, -1.6875 * r], [-0.525 * r, -2.1875 * r]], '#ffc107', '#b8860b', 0.075 * r);
            u.rect(g, -0.4 * r, -2.75 * r, 0.125 * r, 0.375 * r, 'rgba(255,255,255,0.6)');
        }
    },
    {
        id: 'sport_champion', name: 'Champion Belt', rarity: 'legendary', tags: ['champion', 'gold', 'crown'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, -1.8 * r, 1.1 * r, u.radial(g, 0, -1.8 * r, 0.4 * r, 0, -1.8 * r, 1.1 * r, ['rgba(255,215,0,0.5)', 'rgba(255,215,0,0)']), null);
            const gold = u.linear(g, -1 * r, -2.4 * r, 1 * r, -1 * r, ['#fff3a0', '#ffb300', '#b8860b']);
            u.poly(g, [[-0.9 * r, -1.25 * r], [-0.95 * r, -2.0 * r], [-0.45 * r, -1.6 * r], [0, -2.4 * r], [0.45 * r, -1.6 * r], [0.95 * r, -2.0 * r], [0.9 * r, -1.25 * r]], gold, '#b8860b', 0.05 * r);
            u.rect(g, -0.9 * r, -1.25 * r, 1.8 * r, 0.25 * r, '#ffb300', '#b8860b', 0.05 * r);
            u.circle(g, -0.5 * r, -1.12 * r, 0.08 * r, '#e53935');
            u.circle(g, 0, -1.12 * r, 0.08 * r, '#29b6f6');
            u.circle(g, 0.5 * r, -1.12 * r, 0.08 * r, '#e53935');
            u.circle(g, 0, -2.3 * r, 0.1 * r, '#29b6f6');
            const f = (c.t % 2000) / 2000;
            const sx = (-0.8 + 1.6 * f) * r;
            u.ellipse(g, sx, -1.75 * r, 0.1 * r, 0.45 * r, 0.3, 'rgba(255,255,255,0.7)');
        }
    },
]);
