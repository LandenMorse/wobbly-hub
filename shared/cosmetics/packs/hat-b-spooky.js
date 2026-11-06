Cosmetics.define({ pack: 'hat-b-spooky', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'spooky_pumpkin', name: 'Pumpkin', rarity: 'common', tags: ['spooky', 'orange'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.07 * r, -2.5 * r, 0.14 * r, 0.3 * r, '#558b2f');                       // stem
            u.ellipse(g, 0, -1.65 * r, 0.8 * r, 0.65 * r, 0, '#ff7a18', '#c25e00', 0.05 * r);   // body
            u.poly(g, [[-0.45 * r, -1.9 * r], [-0.22 * r, -1.75 * r], [-0.45 * r, -1.6 * r]], '#3e1f00'); // eye L
            u.poly(g, [[0.45 * r, -1.9 * r], [0.22 * r, -1.75 * r], [0.45 * r, -1.6 * r]], '#3e1f00');    // eye R
            u.poly(g, [[-0.5 * r, -1.35 * r], [0.5 * r, -1.35 * r], [0.3 * r, -1.15 * r], [-0.3 * r, -1.15 * r]], '#3e1f00'); // mouth
        }
    },
    {
        id: 'spooky_ghost', name: 'Ghost Sheet', rarity: 'common', tags: ['spooky', 'white'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [
                [-0.95 * r, -1.0 * r], [-0.95 * r, -1.7 * r], [-0.6 * r, -2.4 * r], [0, -2.6 * r],
                [0.6 * r, -2.4 * r], [0.95 * r, -1.7 * r], [0.95 * r, -1.0 * r],
                [0.6 * r, -1.15 * r], [0.3 * r, -1.0 * r], [0, -1.15 * r], [-0.3 * r, -1.0 * r], [-0.6 * r, -1.15 * r]
            ], '#f5f5f5', '#bdbdbd', 0.04 * r);
            u.circle(g, -0.35 * r, -1.9 * r, 0.1 * r, '#9e9e9e');
            u.circle(g, 0.35 * r, -1.9 * r, 0.1 * r, '#9e9e9e');
        }
    },
    {
        id: 'spooky_bat', name: 'Bat Wings', rarity: 'common', tags: ['spooky', 'black'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.5 * r, -1.3 * r], [-1.6 * r, -1.9 * r], [-1.3 * r, -1.5 * r], [-1.7 * r, -1.6 * r], [-1.1 * r, -1.1 * r], [-0.5 * r, -1.1 * r]], '#151515');
            u.poly(g, [[0.5 * r, -1.3 * r], [1.6 * r, -1.9 * r], [1.3 * r, -1.5 * r], [1.7 * r, -1.6 * r], [1.1 * r, -1.1 * r], [0.5 * r, -1.1 * r]], '#151515');
        }
    },
    {
        id: 'spooky_vamp', name: 'Vampire Collar', rarity: 'rare', tags: ['spooky', 'black', 'red'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-1.2 * r, -1.0 * r], [-1.35 * r, -1.9 * r], [-0.9 * r, -1.65 * r], [-0.7 * r, -1.0 * r]], '#c62828');
            u.poly(g, [[1.2 * r, -1.0 * r], [1.35 * r, -1.9 * r], [0.9 * r, -1.65 * r], [0.7 * r, -1.0 * r]], '#c62828');
            u.poly(g, [[-0.75 * r, -1.0 * r], [-0.55 * r, -2.0 * r], [0, -2.3 * r], [0.55 * r, -2.0 * r], [0.75 * r, -1.0 * r]], '#1a1a1a');
        }
    },
    {
        id: 'spooky_zombie', name: 'Zombie Brain', rarity: 'common', tags: ['spooky', 'green'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.5 * r, 0.9 * r, 0.5 * r, 0, '#9ccc65', '#558b2f', 0.05 * r);
            u.line(g, [[-0.5 * r, -1.6 * r], [-0.2 * r, -1.35 * r], [0.1 * r, -1.6 * r], [0.45 * r, -1.35 * r]], '#33691e', 0.06 * r);
            u.line(g, [[-0.6 * r, -1.2 * r], [-0.3 * r, -1.2 * r]], '#1b1b1b', 0.05 * r);
            u.line(g, [[0.1 * r, -1.2 * r], [0.4 * r, -1.2 * r]], '#1b1b1b', 0.05 * r);
        }
    },
    {
        id: 'spooky_skull', name: 'Skull Cap', rarity: 'common', tags: ['spooky', 'bone'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.7 * r, 0.95 * r, 0.7 * r, 0, '#f5f5dc', '#bdbdbd', 0.04 * r);
            u.circle(g, -0.35 * r, -1.85 * r, 0.2 * r, '#1a1a1a');
            u.circle(g, 0.35 * r, -1.85 * r, 0.2 * r, '#1a1a1a');
            u.poly(g, [[-0.1 * r, -2.1 * r], [0.1 * r, -2.1 * r], [0, -1.95 * r]], '#1a1a1a');
        }
    },
    {
        id: 'spooky_cauldron', name: 'Cauldron', rarity: 'rare', tags: ['spooky', 'black', 'green'], anim: true,
        draw(g, c) {
            const r = c.r;
            const t = c.t / 800;
            u.rect(g, -0.6 * r, -1.8 * r, 1.2 * r, 0.5 * r, '#212121');
            u.ellipse(g, 0, -1.3 * r, 0.6 * r, 0.3 * r, 0, '#212121');
            u.ellipse(g, 0, -1.8 * r, 0.8 * r, 0.18 * r, 0, '#424242');
            u.ellipse(g, 0, -1.82 * r, 0.7 * r, 0.1 * r, 0, '#76ff03');
            for (let i = 0; i < 3; i++) {
                const p = (t + i * 0.33) % 1;
                u.circle(g, (i - 1) * 0.4 * r, (-1.9 - p * 0.5) * r, (0.1 - p * 0.04) * r, '#b9f6ca');
            }
        }
    },
    {
        id: 'spooky_mummy', name: 'Mummy Wrap', rarity: 'common', tags: ['spooky', 'white'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.95 * r, -1.55 * r, 1.9 * r, 0.22 * r, '#efe8d2', '#bcae8f', 0.03 * r);
            u.rect(g, -0.95 * r, -1.3 * r, 1.9 * r, 0.3 * r, '#efe8d2', '#bcae8f', 0.03 * r);
            u.line(g, [[-0.95 * r, -1.44 * r], [0.95 * r, -1.44 * r]], '#bcae8f', 0.03 * r);
        }
    },
    {
        id: 'spooky_reaper', name: 'Reaper Hood', rarity: 'epic', tags: ['spooky', 'black', 'purple'],
        draw(g, c) {
            const r = c.r;
            const hood = [[-0.95 * r, -1.0 * r], [-0.85 * r, -1.9 * r], [-0.3 * r, -2.7 * r], [0.3 * r, -2.7 * r], [0.85 * r, -1.9 * r], [0.95 * r, -1.0 * r]];
            u.poly(g, hood, '#0d0d0d', 'rgba(156,39,176,0.7)', 0.08 * r);
            u.ellipse(g, 0, -1.5 * r, 0.45 * r, 0.5 * r, 0, '#000000');
            u.poly(g, hood, null, 'rgba(206,147,216,0.5)', 0.14 * r);
        }
    },
    {
        id: 'spooky_eclipse', name: 'Blood Moon', rarity: 'legendary', tags: ['spooky', 'dark', 'red'], anim: true,
        draw(g, c) {
            const r = c.r;
            const pulse = 0.9 + 0.08 * Math.sin(c.t / 300);
            g.save();
            g.shadowColor = '#ff1744';
            g.shadowBlur = 0.4 * r;
            g.strokeStyle = '#ff1744';
            g.lineWidth = 0.12 * r;
            g.beginPath();
            g.arc(0, -2.0 * r, pulse * r, 0, Math.PI * 2);
            g.stroke();
            g.restore();
            u.rect(g, -0.8 * r, -1.45 * r, 1.6 * r, 0.45 * r, '#1c1c1c', '#4a0000', 0.04 * r);
            u.poly(g, [[-0.8 * r, -1.45 * r], [-0.8 * r, -2.2 * r], [-0.4 * r, -1.8 * r], [0, -2.35 * r], [0.4 * r, -1.8 * r], [0.8 * r, -2.2 * r], [0.8 * r, -1.45 * r]], '#212121', '#4a0000', 0.04 * r);
            u.circle(g, 0, -1.7 * r, 0.12 * r, '#ff1744');
        }
    },
]);
