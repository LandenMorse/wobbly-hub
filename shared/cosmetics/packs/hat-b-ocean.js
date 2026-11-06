Cosmetics.define({ pack: 'hat-b-ocean', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'ocean_snorkel', name: 'Snorkel Mask', rarity: 'common', tags: ['ocean', 'yellow'],
        draw(g, c) {
            const r = c.r;
            const b = -c.look;
            u.rect(g, -1.0 * r, -1.2 * r, 2.0 * r, 0.25 * r, '#ffd600', '#f9a825', 0.04 * r);      // yellow strap band
            u.line(g, [[0.8 * b * r, -1.2 * r], [1.2 * b * r, -1.6 * r], [1.1 * b * r, -2.1 * r], [0.8 * b * r, -2.4 * r]], '#ffd600', 0.16 * r, 'round'); // snorkel tube
            u.circle(g, 0.8 * b * r, -2.4 * r, 0.2 * r, '#e53935', '#b71c1c', 0.03 * r);            // red mouth cap
            u.rect(g, -0.75 * r, -1.725 * r, 1.5 * r, 0.55 * r, '#0d47a1', '#0a2a66', 0.03 * r);    // mask frame
            u.rect(g, -0.6 * r, -1.6 * r, 1.2 * r, 0.3 * r, '#81d4fa', null, 0);                    // mask glass
        }
    },
    {
        id: 'ocean_shell', name: 'Seashell', rarity: 'common', tags: ['ocean', 'pink'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.9 * r, 1.1 * r, 0.9 * r, 0, '#f48fb1', '#c2185b', 0.05 * r);          // scallop fan
            u.line(g, [[0, -1.0 * r], [-0.7 * r, -2.4 * r]], '#c2185b', 0.05 * r, 'round');          // ribs
            u.line(g, [[0, -1.0 * r], [0, -2.8 * r]], '#c2185b', 0.05 * r, 'round');
            u.line(g, [[0, -1.0 * r], [0.7 * r, -2.4 * r]], '#c2185b', 0.05 * r, 'round');
        }
    },
    {
        id: 'ocean_fin', name: 'Shark Fin', rarity: 'common', tags: ['ocean', 'grey'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.5 * c.look * r, -1.0 * r], [0.25 * c.look * r, -2.7 * r], [0.8 * c.look * r, -1.0 * r]], '#78909c', '#37474f', 0.05 * r);
        }
    },
    {
        id: 'ocean_octopus', name: 'Octopus', rarity: 'rare', tags: ['ocean', 'purple'],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.7 * r, -1.3 * r], [-1.25 * r, -1.0 * r], [-1.1 * r, -0.6 * r], [-1.45 * r, -0.3 * r]], '#8e24aa', 0.22 * r, 'round');
            u.line(g, [[0.7 * r, -1.3 * r], [1.25 * r, -1.0 * r], [1.1 * r, -0.6 * r], [1.45 * r, -0.3 * r]], '#8e24aa', 0.22 * r, 'round');
            u.ellipse(g, 0, -1.75 * r, 0.95 * r, 0.75 * r, 0, '#8e24aa', '#4a148c', 0.06 * r);      // head
        }
    },
    {
        id: 'ocean_crab', name: 'Crab Claws', rarity: 'common', tags: ['ocean', 'red'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.35 * r, 1.0 * r, 0.35 * r, 0, '#e53935', '#b71c1c', 0.06 * r);      // shell
            for (const s of [-1, 1]) {
                u.line(g, [[s * 0.8 * r, -1.35 * r], [s * 1.2 * r, -2.2 * r]], '#e53935', 0.2 * r, 'round'); // arm
                u.circle(g, s * 1.35 * r, -2.45 * r, 0.32 * r, '#ef5350', '#b71c1c', 0.05 * r);             // claw
            }
        }
    },
    {
        id: 'ocean_jelly', name: 'Jellyfish', rarity: 'rare', tags: ['ocean', 'pink'], anim: true,
        draw(g, c) {
            const r = c.r;
            const sway = Math.sin(c.t / 300) * 0.15 * r;
            [-1.2, -0.9, 0.9, 1.2].forEach((k, i) => {
                const x0 = k * r;
                const dx = (i % 2 ? sway : -sway);
                u.line(g, [[x0, -1.7 * r], [x0 + dx, -1.0 * r], [x0 - dx, -0.5 * r]], 'rgba(236,64,122,0.85)', 0.08 * r, 'round');
            });
            u.ellipse(g, 0, -1.8 * r, 1.25 * r, 0.8 * r, 0, 'rgba(255,128,171,0.7)', '#ec407a', 0.05 * r); // bell
        }
    },
    {
        id: 'ocean_captain', name: 'Sea Captain', rarity: 'common', tags: ['ocean', 'navy'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.8 * r, -1.9 * r, 1.6 * r, 0.9 * r, '#1a237e', '#0d1450', 0.04 * r);        // crown
            u.rect(g, -1.05 * r, -1.12 * r, 2.1 * r, 0.14 * r, '#1a237e', '#0d1450', 0.04 * r);     // brim
            u.circle(g, 0, -1.45 * r, 0.25 * r, '#ffd54f', '#1a237e', 0.04 * r);                    // anchor badge
        }
    },
    {
        id: 'ocean_coral', name: 'Coral Crown', rarity: 'epic', tags: ['ocean', 'orange'],
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.line(g, [[s * 0.6 * r, -1.0 * r], [s * 1.0 * r, -1.9 * r], [s * 1.25 * r, -2.4 * r]], '#ff7043', 0.24 * r, 'round');
                u.line(g, [[s * 1.0 * r, -1.9 * r], [s * 0.6 * r, -2.5 * r]], '#f06292', 0.14 * r, 'round');
                u.circle(g, s * 1.25 * r, -2.4 * r, 0.12 * r, '#ff8a65', null, 0);
            }
            u.line(g, [[0, -1.0 * r], [0, -2.7 * r]], '#ff7043', 0.3 * r, 'round');
            u.line(g, [[0, -2.0 * r], [-0.35 * r, -2.6 * r]], '#f06292', 0.14 * r, 'round');
            u.line(g, [[0, -2.1 * r], [0.35 * r, -2.6 * r]], '#f06292', 0.14 * r, 'round');
        }
    },
    {
        id: 'ocean_pearl', name: 'Pearl Clam', rarity: 'rare', tags: ['ocean', 'pearl'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, -1.75 * r, 0.6 * r, 'rgba(255,255,255,0.35)', null, 0);                 // glow
            u.ellipse(g, 0, -1.5 * r, 1.2 * r, 0.5 * r, 0, '#b0bec5', '#546e7a', 0.05 * r);        // shell
            u.line(g, [[-0.6 * r, -1.9 * r], [-0.4 * r, -1.0 * r]], '#546e7a', 0.05 * r, 'round');
            u.line(g, [[0.6 * r, -1.9 * r], [0.4 * r, -1.0 * r]], '#546e7a', 0.05 * r, 'round');
            u.circle(g, 0, -1.75 * r, 0.4 * r, u.radial(g, -0.1 * r, -1.85 * r, 0.05 * r, 0, -1.75 * r, 0.4 * r, ['#ffffff', '#b3e5fc']), '#81d4fa', 0.03 * r); // pearl
        }
    },
    {
        id: 'ocean_trident', name: 'Poseidon Crown', rarity: 'legendary', tags: ['ocean', 'gold'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.0 * r, -1.2 * r], [-0.8 * r, -1.9 * r], [-0.4 * r, -1.45 * r], [0.4 * r, -1.45 * r], [0.8 * r, -1.9 * r], [1.0 * r, -1.2 * r]], '#ffd54f', '#ff8f00', 0.05 * r); // gold crown
            u.rect(g, -1.0 * r, -1.2 * r, 2.0 * r, 0.2 * r, '#26a69a', '#ffd54f', 0.05 * r);       // sea-green band
            u.line(g, [[0, -1.2 * r], [0, -2.9 * r]], '#26a69a', 0.1 * r, 'round');                 // trident shaft
            u.line(g, [[-0.25 * r, -3.0 * r], [-0.25 * r, -2.6 * r], [0, -2.4 * r], [0.25 * r, -2.6 * r], [0.25 * r, -3.0 * r]], '#26a69a', 0.08 * r, 'round');
            const rnd = u.rng(5);
            for (let i = 0; i < 5; i++) {
                const bx = (rnd() * 2 - 1) * 1.4 * r;
                const ph = rnd();
                const t = (c.t / 1200 + ph) % 1;
                const by = -1.0 * r - t * 1.8 * r;
                u.circle(g, bx, by, (0.1 + 0.05 * ph) * r, 'rgba(255,255,255,0.6)', '#b2ebf2', 0.03 * r); // rising bubble
            }
        }
    },
]);
