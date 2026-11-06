Cosmetics.define({ pack: 'hat-b-space', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'space_helmet', name: 'Space Helmet', rarity: 'common', tags: ['space', 'white'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, -1.6 * r, 0.6 * r, '#eeeeee', '#90a4ae', 0.06 * r);   // helmet shell
            u.circle(g, 0, -1.7 * r, 0.4 * r, 'rgba(129,212,250,0.85)', '#29b6f6', 0.05 * r); // glass dome
            u.rect(g, -0.7 * r, -1.1 * r, 1.4 * r, 0.18 * r, '#cfd8dc');          // neck ring
        }
    },
    {
        id: 'space_antenna', name: 'Antenna Cap', rarity: 'common', tags: ['space', 'green'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.6 * r, -1.6 * r, 1.2 * r, 0.55 * r, '#43a047', '#1b5e20', 0.05 * r); // cap
            u.rect(g, -0.75 * r, -1.1 * r, 1.5 * r, 0.14 * r, '#2e7d32');          // brim
            u.line(g, [[-0.3 * r, -1.6 * r], [-0.5 * r, -2.5 * r]], '#616161', 0.07 * r, 'round');
            u.line(g, [[0.3 * r, -1.6 * r], [0.5 * r, -2.5 * r]], '#616161', 0.07 * r, 'round');
            u.circle(g, -0.5 * r, -2.6 * r, 0.14 * r, '#ffeb3b', '#f9a825', 0.04 * r);
            u.circle(g, 0.5 * r, -2.6 * r, 0.14 * r, '#ffeb3b', '#f9a825', 0.04 * r);
        }
    },
    {
        id: 'space_alien', name: 'Alien Dome', rarity: 'rare', tags: ['space', 'green'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.45 * r, 0.95 * r, 0.5 * r, 0, '#66bb6a', '#2e7d32', 0.06 * r); // bulgy dome
            u.line(g, [[-0.5 * r, -1.85 * r], [0, -2.1 * r], [0.5 * r, -1.85 * r]], '#2e7d32', 0.12 * r, 'round'); // ridge
        }
    },
    {
        id: 'space_rocket', name: 'Rocket Nose', rarity: 'common', tags: ['space', 'red'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[0, -2.7 * r], [0.6 * r, -1.0 * r], [-0.6 * r, -1.0 * r]], '#ffffff', '#b0bec5', 0.05 * r); // white cone
            u.poly(g, [[0, -2.7 * r], [0.6 * r, -1.9 * r], [-0.6 * r, -1.9 * r]], '#e53935', null);            // red tip
        }
    },
    {
        id: 'space_ufo', name: 'Mini UFO', rarity: 'rare', tags: ['space', 'silver'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.35 * r, 0.55 * r, 0.35 * r, 0, 'rgba(179,229,255,0.9)', null);      // glass dome
            u.ellipse(g, 0, -1.2 * r, 1.2 * r, 0.22 * r, 0, '#cfd8dc', '#78909c', 0.05 * r);       // saucer
            u.circle(g, -0.6 * r, -1.2 * r, 0.08 * r, '#ff5252', null);                              // lights
            u.circle(g, 0, -1.15 * r, 0.08 * r, '#ffeb3b', null);
            u.circle(g, 0.6 * r, -1.2 * r, 0.08 * r, '#69f0ae', null);
        }
    },
    {
        id: 'space_comet', name: 'Comet Tail', rarity: 'common', tags: ['space', 'orange'],
        draw(g, c) {
            const r = c.r;
            const p = (x, y) => [x * c.look * r, y * r];
            u.poly(g, [p(0.6, -1.25), p(-1.7, -2.0), p(-1.2, -1.45), p(0.6, -1.05)], '#ffb74d', null); // streaking tail
            u.circle(g, -1.5 * c.look * r, -1.95 * r, 0.16 * r, '#fff3e0', null);                        // comet head
            u.rect(g, -0.85 * r, -1.2 * r, 1.7 * r, 0.22 * r, '#fb8c00');                                // headband
        }
    },
    {
        id: 'space_astro', name: 'Astro Visor', rarity: 'common', tags: ['space', 'blue'],
        draw(g, c) {
            const r = c.r;
            g.beginPath();
            g.ellipse(0, -1.05 * r, 1.0 * r, 0.6 * r, 0, Math.PI, 2 * Math.PI);                 // blue dome (top half)
            g.closePath();
            g.fillStyle = '#1e88e5';
            g.fill();
            g.strokeStyle = '#0d47a1';
            g.lineWidth = 0.05 * r;
            g.stroke();
            u.rect(g, -1.0 * r, -1.25 * r, 2.0 * r, 0.12 * r, '#ffc107');                       // gold stripe across dome
            u.poly(g, [[0.5 * c.look * r, -1.1 * r], [1.3 * c.look * r, -1.0 * r], [0.5 * c.look * r, -0.92 * r]], '#0d47a1', null); // peak
        }
    },
    {
        id: 'space_moon', name: 'Crescent Moon', rarity: 'rare', tags: ['space', 'yellow'],
        draw(g, c) {
            const r = c.r;
            const cx = 0, cy = -0.33 * r, R = 0.9 * r;
            g.beginPath();
            g.arc(cx, cy, R, -2.3, -0.84, false);                       // outer edge over the top
            g.quadraticCurveTo(cx, cy + 0.3 * r, -0.6 * r, -1.0 * r);   // inner edge back, lower tips at y -1.0r
            g.closePath();
            g.fillStyle = '#fdd835';
            g.fill();
            g.strokeStyle = '#f9a825';
            g.lineWidth = 0.05 * r;
            g.stroke();
        }
    },
    {
        id: 'space_nebula', name: 'Nebula Crown', rarity: 'epic', tags: ['space', 'purple'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.5 * r, -1.6 * r, 0.5 * r, 0.3 * r, 0, '#7b1fa2');       // purple cloud
            u.ellipse(g, 0.5 * r, -1.6 * r, 0.5 * r, 0.3 * r, 0, '#ec407a');        // pink cloud
            u.ellipse(g, 0, -1.95 * r, 0.55 * r, 0.3 * r, 0, '#ab47bc');            // top cloud
            u.rect(g, -0.9 * r, -1.45 * r, 1.8 * r, 0.22 * r, '#8e24aa');           // crown band
            const pts = [[-1.0, -2.25], [0.9, -2.4], [0.0, -2.65]];
            for (let i = 0; i < pts.length; i++) {
                g.globalAlpha = 0.5 + 0.5 * Math.sin(c.t / 250 + i * 2);            // twinkle
                u.star(g, pts[i][0] * r, pts[i][1] * r, 0.14 * r, 0.05 * r, 5, '#ffffff');
            }
            g.globalAlpha = 1;
        }
    },
    {
        id: 'space_blackhole', name: 'Black Hole', rarity: 'legendary', tags: ['space', 'dark'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.65 * r, 1.25 * r, 0.4 * r, 0, '#1a1a2e');                          // dark disc
            u.ellipse(g, 0, -1.65 * r, 1.25 * r, 0.4 * r, 0, null, '#ff9800', 0.12 * r);           // glowing ring
            for (let i = 0; i < 3; i++) {
                const rot = c.t / 600 + i * 2.1;                                                    // spinning swirl
                u.ellipse(g, 0, -1.65 * r, 0.9 * r, 0.25 * r, rot, null, 'rgba(255,255,255,0.25)', 0.05 * r);
            }
        }
    },
    // one object per item, in the order listed
]);
