Cosmetics.define({ pack: 'skin-a-spooky', category: 'skin', author: 'helper' }, (u) => [
    {
        id: 'spooky_ghost', name: 'Boo', rarity: 'common', tags: ['spooky', 'ghost', 'white'],
        fill: '#f5f5f5',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, -0.45 * r, -0.4 * r, 0.38 * r, 0.3 * r, 0, 'rgba(0,0,0,0.25)');
            u.ellipse(g, 0.45 * r, -0.4 * r, 0.38 * r, 0.3 * r, 0, 'rgba(0,0,0,0.25)');
            for (let i = 0; i < 4; i++) u.circle(g, (-0.75 + i * 0.5) * r, 1.7 * r, 0.22 * r, '#f5f5f5');
        },
    },
    {
        id: 'spooky_pumpkin', name: 'Pumpkin', rarity: 'common', tags: ['spooky', 'pumpkin', 'orange'],
        fill: '#ff7a1a',
        draw(g, c) {
            const r = c.r;
            for (const x of [-0.5, 0, 0.5]) u.line(g, [[x * r, -1.0 * r], [x * r, 1.5 * r]], 'rgba(120,50,0,0.5)', 0.08 * r);
        },
        extras(g, c) {
            const r = c.r;
            u.rect(g, -0.12 * r, -1.6 * r, 0.24 * r, 0.45 * r, '#2e7d32');
        },
    },
    {
        id: 'spooky_bat', name: 'Bat', rarity: 'common', tags: ['spooky', 'bat', 'purple'],
        fill: '#3b1f4f',
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.poly(g, [[s * 0.9 * r, -0.2 * r], [s * 2.2 * r, -0.9 * r], [s * 2.0 * r, 0.5 * r], [s * 1.2 * r, 0.2 * r]], '#2a1239');
                u.poly(g, [[s * 0.9 * r, -1.2 * r], [s * 0.6 * r, -1.7 * r], [s * 0.2 * r, -1.2 * r]], '#2a1239');
            }
        },
    },
    {
        id: 'spooky_witch', name: 'Witch', rarity: 'common', tags: ['spooky', 'witch', 'green'],
        fill: '#4caf50',
        pattern: [['collar', '#7b1fa2']],
        extras(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.25 * r, 1.4 * r, 0.3 * r, 0, '#1a1a2e');
            u.poly(g, [[-0.8 * r, -1.3 * r], [0.8 * r, -1.3 * r], [0.1 * r, -2.5 * r]], '#1a1a2e');
        },
    },
    {
        id: 'spooky_skeleton', name: 'Skeleton', rarity: 'common', tags: ['spooky', 'skeleton', 'black'],
        fill: '#111111',
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 4; i++) {
                const y = (-0.2 + i * 0.4) * r;
                u.line(g, [[-0.6 * r, y], [0.6 * r, y]], '#ffffff', 0.08 * r);
            }
        },
    },
    {
        id: 'spooky_mummy', name: 'Mummy', rarity: 'common', tags: ['spooky', 'mummy', 'bandage'],
        fill: '#efe6cf',
        draw(g, c) {
            const r = c.r;
            for (let i = 0; i < 4; i++) u.rect(g, -r, (-1.0 + i * 0.6) * r, 2 * r, 0.18 * r, '#d9cdb0');
        },
    },
    {
        id: 'spooky_zombie', name: 'Zombie', rarity: 'rare', tags: ['spooky', 'zombie', 'green', 'stitches'],
        fill: '#7cb342',
        pattern: [['blobs', ['#558b2f', '#9ccc65'], 6, 3]],
        draw(g, c) {
            const r = c.r;
            u.line(g, [[-0.7 * r, 0.1 * r], [0.7 * r, 0.1 * r]], '#222222', 0.05 * r);
            for (let i = 0; i < 5; i++) {
                const x = (-0.6 + i * 0.3) * r;
                u.line(g, [[x, 0.0 * r], [x, 0.25 * r]], '#222222', 0.05 * r);
            }
        },
    },
    {
        id: 'spooky_vampire', name: 'Vampire', rarity: 'rare', tags: ['spooky', 'vampire', 'pale', 'red'],
        fill: '#eceff1',
        pattern: [['collar', '#b71c1c']],
        extras(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.poly(g, [[s * 0.9 * r, -0.6 * r], [s * 1.9 * r, -0.2 * r], [s * 1.7 * r, 0.6 * r], [s * 0.7 * r, 0.1 * r]], '#880e0e');
                u.poly(g, [[s * 1.1 * r, -0.4 * r], [s * 1.6 * r, -0.2 * r], [s * 1.5 * r, 0.4 * r], [s * 0.9 * r, 0.0 * r]], '#b71c1c');
            }
        },
    },
    {
        id: 'spooky_candle', name: 'Candle Ghost', rarity: 'epic', tags: ['spooky', 'candle', 'glow', 'wax'], anim: true,
        fill: '#f3ead2',
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.6 * r, -0.9 * r, 0.2 * r, 0.4 * r, '#e4d7b5');
            u.rect(g, 0.45 * r, -0.7 * r, 0.2 * r, 0.5 * r, '#e4d7b5');
        },
        extras(g, c) {
            const r = c.r;
            const tip = -2.3 * r + Math.sin(c.t / 110) * 0.12 * r;
            const sway = Math.sin(c.t / 170) * 0.06 * r;
            u.circle(g, 0, -1.7 * r, 0.9 * r, u.radial(g, 0, -1.7 * r, 0.1 * r, 0, -1.7 * r, 0.9 * r, ['rgba(255,200,60,0.55)', 'rgba(255,200,60,0)']));
            u.poly(g, [[-0.2 * r, -1.3 * r], [0.2 * r, -1.3 * r], [0.1 * r, -1.8 * r], [sway, tip], [-0.1 * r, -1.8 * r]], '#ffb300');
            u.poly(g, [[-0.08 * r, -1.35 * r], [0.08 * r, -1.35 * r], [sway * 0.5, -1.85 * r]], '#fff59d');
        },
    },
    {
        id: 'spooky_reaper', name: 'Reaper', rarity: 'legendary', tags: ['spooky', 'reaper', 'black', 'mist'], anim: true,
        fill: '#0d0d12',
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -0.9 * r, 0.8 * r, 0.7 * r, 0, '#000000');
        },
        extras(g, c) {
            const r = c.r;
            for (let i = 0; i < 3; i++) {
                const off = Math.sin(c.t / 400 + i) * 0.1 * r;
                u.ellipse(g, (i - 1) * 0.9 * r + off, 1.7 * r, 0.6 * r, 0.3 * r, 0, 'rgba(150,80,255,0.45)');
            }
        },
    },
]);
