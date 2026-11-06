Cosmetics.define({ pack: 'ball-d-critter', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'critter_cat', name: 'Cat Face', rarity: 'common', tags: ['animal', 'cute'], trail: '255,152,0',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ff9800', null);
            u.poly(g, [[-0.75 * r, -0.2 * r], [-0.55 * r, -0.75 * r], [-0.15 * r, -0.45 * r]], '#e65100', null);
            u.poly(g, [[0.15 * r, -0.45 * r], [0.55 * r, -0.75 * r], [0.75 * r, -0.2 * r]], '#e65100', null);
            u.ellipse(g, 0, 0.15 * r, 0.5 * r, 0.4 * r, 0, '#ffe0b2', null);
            u.circle(g, -0.2 * r, 0, 0.08 * r, '#1b1b1b', null);
            u.circle(g, 0.2 * r, 0, 0.08 * r, '#1b1b1b', null);
            u.poly(g, [[-0.05 * r, 0.25 * r], [0.05 * r, 0.25 * r], [0, 0.33 * r]], '#e91e63', null);
            u.line(g, [[-0.85 * r, 0.25 * r], [-0.4 * r, 0.3 * r]], '#3e2723', 0.06 * r, 'round');
            u.line(g, [[0.4 * r, 0.3 * r], [0.85 * r, 0.25 * r]], '#3e2723', 0.06 * r, 'round');
            u.circle(g, 0, 0, r, null, '#e65100', 2);
        }
    },
    {
        id: 'critter_panda', name: 'Panda', rarity: 'common', tags: ['animal', 'black'], trail: '158,158,158',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', null);
            u.circle(g, -0.45 * r, -0.5 * r, 0.22 * r, '#212121', null);
            u.circle(g, 0.45 * r, -0.5 * r, 0.22 * r, '#212121', null);
            u.ellipse(g, -0.3 * r, -0.05 * r, 0.2 * r, 0.26 * r, 0, '#212121', null);
            u.ellipse(g, 0.3 * r, -0.05 * r, 0.2 * r, 0.26 * r, 0, '#212121', null);
            u.circle(g, -0.3 * r, -0.05 * r, 0.08 * r, '#ffffff', null);
            u.circle(g, 0.3 * r, -0.05 * r, 0.08 * r, '#ffffff', null);
            u.ellipse(g, 0, 0.25 * r, 0.1 * r, 0.07 * r, 0, '#212121', null);
            u.line(g, [[-0.1 * r, 0.4 * r], [0, 0.45 * r], [0.1 * r, 0.4 * r]], '#212121', 0.05 * r, 'round');
            u.circle(g, 0, 0, r, null, '#9e9e9e', 2);
        }
    },
    {
        id: 'critter_frog', name: 'Frog', rarity: 'common', tags: ['animal', 'green'], trail: '124,179,66',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#7cb342', null);
            u.circle(g, -0.4 * r, -0.45 * r, 0.28 * r, '#8bc34a', null);
            u.circle(g, 0.4 * r, -0.45 * r, 0.28 * r, '#8bc34a', null);
            u.circle(g, -0.4 * r, -0.5 * r, 0.14 * r, '#ffffff', null);
            u.circle(g, 0.4 * r, -0.5 * r, 0.14 * r, '#ffffff', null);
            u.circle(g, -0.38 * r, -0.5 * r, 0.06 * r, '#111111', null);
            u.circle(g, 0.38 * r, -0.5 * r, 0.06 * r, '#111111', null);
            u.line(g, [[-0.55 * r, 0.2 * r], [-0.2 * r, 0.45 * r], [0.2 * r, 0.45 * r], [0.55 * r, 0.2 * r]], '#1b5e20', 0.07 * r, 'round');
            u.circle(g, 0, 0, r, null, '#558b2f', 2);
        }
    },
    {
        id: 'critter_chick', name: 'Chick', rarity: 'common', tags: ['animal', 'yellow'], trail: '253,216,53',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#fdd835', null);
            u.circle(g, -0.25 * r, -0.1 * r, 0.09 * r, '#111111', null);
            u.circle(g, 0.25 * r, -0.1 * r, 0.09 * r, '#111111', null);
            u.circle(g, -0.45 * r, 0.15 * r, 0.1 * r, 'rgba(255,87,34,0.35)', null);
            u.circle(g, 0.45 * r, 0.15 * r, 0.1 * r, 'rgba(255,87,34,0.35)', null);
            u.poly(g, [[-0.15 * r, 0.05 * r], [0.15 * r, 0.05 * r], [0, 0.3 * r]], '#ff6f00', null);
            u.circle(g, 0, 0, r, null, '#f9a825', 2);
        }
    },
    {
        id: 'critter_pig', name: 'Piggy', rarity: 'common', tags: ['animal', 'pink'], trail: '244,143,177',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#f48fb1', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [-0.3 * r, -0.8 * r], [-0.15 * r, -0.45 * r]], '#ec407a', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0.3 * r, -0.8 * r], [0.15 * r, -0.45 * r]], '#ec407a', null);
            u.ellipse(g, 0, 0.15 * r, 0.32 * r, 0.25 * r, 0, '#f8bbd0', '#ad1457', 1.5);
            u.circle(g, -0.12 * r, 0.15 * r, 0.05 * r, '#ad1457', null);
            u.circle(g, 0.12 * r, 0.15 * r, 0.05 * r, '#ad1457', null);
            u.circle(g, -0.35 * r, -0.3 * r, 0.09 * r, '#111111', null);
            u.circle(g, 0.35 * r, -0.3 * r, 0.09 * r, '#111111', null);
            u.circle(g, 0, 0, r, null, '#ec407a', 2);
        }
    },
    {
        id: 'critter_bee', name: 'Bee', rarity: 'common', tags: ['insect', 'stripes'], trail: '253,216,53',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#fdd835', null);
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            u.rect(g, -r, -0.45 * r, 2 * r, 0.25 * r, '#212121', null);
            u.rect(g, -r, 0.1 * r, 2 * r, 0.25 * r, '#212121', null);
            g.restore();
            u.circle(g, 0, 0, r, null, '#212121', 2);
        }
    },
    {
        id: 'critter_ladybug', name: 'Ladybug', rarity: 'rare', tags: ['insect', 'spots'], trail: '229,57,53',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#e53935', null);
            u.line(g, [[0, -r], [0, r]], '#111111', 0.07 * r, 'butt');
            u.circle(g, -0.45 * r, -0.3 * r, 0.16 * r, '#111111', null);
            u.circle(g, 0.45 * r, -0.3 * r, 0.16 * r, '#111111', null);
            u.circle(g, -0.45 * r, 0.35 * r, 0.16 * r, '#111111', null);
            u.circle(g, 0.45 * r, 0.35 * r, 0.16 * r, '#111111', null);
            u.circle(g, 0, 0, r, null, '#111111', 2);
        }
    },
    {
        id: 'critter_owl', name: 'Owl', rarity: 'rare', tags: ['bird', 'feathers'], trail: '141,110,99',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#8d6e63', null);
            u.ellipse(g, -0.3 * r, 0.5 * r, 0.22 * r, 0.14 * r, 0.5, '#a1887f', null);
            u.ellipse(g, 0.3 * r, 0.5 * r, 0.22 * r, 0.14 * r, -0.5, '#a1887f', null);
            u.line(g, [[-0.5 * r, 0.7 * r], [-0.2 * r, 0.5 * r], [0, 0.7 * r], [0.2 * r, 0.5 * r], [0.5 * r, 0.7 * r]], '#5d4037', 0.05 * r, 'round');
            u.circle(g, -0.25 * r, -0.2 * r, 0.27 * r, '#ffffff', '#3e2723', 0.04 * r);
            u.circle(g, 0.25 * r, -0.2 * r, 0.27 * r, '#ffffff', '#3e2723', 0.04 * r);
            u.circle(g, -0.25 * r, -0.2 * r, 0.12 * r, '#111111', null);
            u.circle(g, 0.25 * r, -0.2 * r, 0.12 * r, '#111111', null);
            u.poly(g, [[-0.07 * r, 0.1 * r], [0.07 * r, 0.1 * r], [0, 0.25 * r]], '#ffb300', null);
            u.circle(g, 0, 0, r, null, '#5d4037', 2);
        }
    },
    {
        id: 'critter_dragon', name: 'Dragon Egg', rarity: 'epic', tags: ['dragon', 'fire'], trail: '255,145,0', fx: 'fire',
        draw(g, c) {
            const r = c.r;
            const rnd = u.rng(5);
            u.circle(g, 0, 0, r, '#1b5e20', null);
            for (let i = 0; i < 9; i++) {
                const a = rnd() * Math.PI * 2;
                const d = (0.2 + rnd() * 0.6) * r;
                u.circle(g, Math.cos(a) * d, Math.sin(a) * d, 0.14 * r, '#2e7d32', '#143d18', 1);
            }
            g.save();
            g.shadowColor = '#ff9100';
            g.shadowBlur = 0.35 * r;
            u.line(g, [[-0.5 * r, -0.1 * r], [-0.2 * r, 0.1 * r], [0, -0.05 * r], [0.2 * r, 0.15 * r], [0.5 * r, 0]], '#ff6d00', 0.09 * r, 'round');
            g.restore();
            u.line(g, [[-0.5 * r, -0.1 * r], [-0.2 * r, 0.1 * r], [0, -0.05 * r], [0.2 * r, 0.15 * r], [0.5 * r, 0]], '#ffd180', 0.03 * r, 'round');
            u.circle(g, 0, 0, r, null, '#0d3311', 2);
        }
    },
    {
        id: 'critter_unicorn', name: 'Unicorn', rarity: 'rare', tags: ['magic', 'rainbow'], trail: '224,64,251',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#fafafa', null);
            const grad = u.linear(g, -r, 0, r, 0, ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb']);
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            g.beginPath();
            g.moveTo(-0.8 * r, -0.1 * r);
            g.quadraticCurveTo(-0.3 * r, -0.9 * r, 0.5 * r, -0.7 * r);
            g.lineCap = 'round';
            g.lineWidth = 0.25 * r;
            g.strokeStyle = grad;
            g.stroke();
            g.restore();
            u.circle(g, 0.25 * r, 0.05 * r, 0.07 * r, '#111111', null);
            u.circle(g, 0.15 * r, -0.2 * r, 0.1 * r, '#ffd54f', '#f9a825', 1);
            u.circle(g, 0, 0, r, null, '#90a4ae', 2);
        }
    },
]);
