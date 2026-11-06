Cosmetics.define({ pack: 'ball-d-gem', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'gem_ruby', name: 'Ruby', rarity: 'common', tags: ['gem', 'red'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ff6b7a', '#c4001f', '#5a0010']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.25)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(0,0,0,0.18)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.1)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(0,0,0,0.15)', null);
            u.circle(g, 0, 0, r, null, '#3a0009', 2);
        }
    },
    {
        id: 'gem_emerald', name: 'Emerald', rarity: 'common', tags: ['gem', 'green'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#6ee7a0', '#00a152', '#00421f']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.25)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(0,0,0,0.18)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.1)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(0,0,0,0.15)', null);
            u.circle(g, 0, 0, r, null, '#00291a', 2);
        }
    },
    {
        id: 'gem_sapphire', name: 'Sapphire', rarity: 'common', tags: ['gem', 'blue'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#6fb7ff', '#0747c4', '#031a4d']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.25)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(0,0,0,0.18)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.1)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(0,0,0,0.15)', null);
            u.circle(g, 0, 0, r, null, '#021033', 2);
        }
    },
    {
        id: 'gem_amber', name: 'Amber', rarity: 'common', tags: ['gem', 'orange'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ffd166', '#f08a00', '#8a4300']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.25)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(0,0,0,0.18)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.1)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(0,0,0,0.15)', null);
            u.circle(g, 0.2 * r, 0.25 * r, 0.22 * r, 'rgba(90,30,0,0.55)', null);
            u.circle(g, 0.15 * r, 0.2 * r, 0.08 * r, 'rgba(255,255,255,0.5)', null);
            u.circle(g, 0, 0, r, null, '#5a2b00', 2);
        }
    },
    {
        id: 'gem_amethyst', name: 'Amethyst', rarity: 'common', tags: ['gem', 'purple'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#c79bff', '#7b2fd1', '#2e0a5c']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.25)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(0,0,0,0.18)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.1)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(0,0,0,0.15)', null);
            u.circle(g, 0, 0, r, null, '#1c0538', 2);
        }
    },
    {
        id: 'gem_pearl', name: 'Pearl', rarity: 'common', tags: ['gem', 'white'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.35 * r, -0.35 * r, 0.1 * r, 0, 0, r, ['#ffffff', '#ffe4ec', '#e8b4c4']), null);
            u.ellipse(g, -0.35 * r, -0.4 * r, 0.3 * r, 0.18 * r, -0.6, 'rgba(255,255,255,0.9)', null);
            u.circle(g, 0, 0, r, null, '#c98aa0', 2);
        }
    },
    {
        id: 'gem_opal', name: 'Opal', rarity: 'rare', tags: ['gem', 'rainbow'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ffffff', '#f4f1f7', '#d9d4e3']), null);
            u.ellipse(g, -0.4 * r, -0.3 * r, 0.45 * r, 0.25 * r, -0.5, 'rgba(255,170,220,0.7)', null);
            u.ellipse(g, 0.3 * r, -0.4 * r, 0.4 * r, 0.22 * r, 0.4, 'rgba(160,220,255,0.7)', null);
            u.ellipse(g, 0.4 * r, 0.3 * r, 0.4 * r, 0.2 * r, -0.2, 'rgba(180,255,190,0.65)', null);
            u.ellipse(g, -0.3 * r, 0.4 * r, 0.35 * r, 0.2 * r, 0.3, 'rgba(255,230,150,0.7)', null);
            u.ellipse(g, 0.05 * r, 0.05 * r, 0.25 * r, 0.15 * r, 0.8, 'rgba(210,180,255,0.6)', null);
            u.circle(g, 0, 0, r, null, '#9a93ad', 2);
        }
    },
    {
        id: 'gem_diamond', name: 'Diamond', rarity: 'rare', tags: ['gem', 'white'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ffffff', '#cfe9ff', '#7fb3e0']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.7)', null);
            u.poly(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.7 * r, 0.3 * r]], 'rgba(120,170,220,0.35)', null);
            u.poly(g, [[0.6 * r, -0.4 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r]], 'rgba(255,255,255,0.2)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(90,140,200,0.3)', null);
            u.line(g, [[-0.6 * r, -0.4 * r], [0, -0.1 * r], [0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.9)', 2);
            u.star(g, -0.45 * r, -0.5 * r, 0.22 * r, 0.05 * r, 4, '#ffffff', null);
            u.circle(g, 0, 0, r, null, '#4f7fb8', 2);
        }
    },
    {
        id: 'gem_obsidian', name: 'Obsidian', rarity: 'rare', tags: ['gem', 'black'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#3a3346', '#14101c', '#050309']), null);
            u.ellipse(g, -0.35 * r, -0.4 * r, 0.3 * r, 0.14 * r, -0.6, 'rgba(255,255,255,0.45)', null);
            u.circle(g, 0, 0, 0.82 * r, null, '#b388ff', 3);
            u.circle(g, 0, 0, r, null, '#7e4fd6', 2);
        }
    },
    {
        id: 'gem_crystal', name: 'Crystal Heart', rarity: 'epic', tags: ['gem', 'heart'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#ffb3de', '#ff3d9a', '#8a0a4f']), null);
            u.poly(g, [[0, -r], [0.6 * r, -0.4 * r], [0, -0.1 * r], [-0.6 * r, -0.4 * r]], 'rgba(255,255,255,0.22)', null);
            u.poly(g, [[-0.7 * r, 0.3 * r], [0, -0.1 * r], [0.7 * r, 0.3 * r], [0, r]], 'rgba(60,0,30,0.18)', null);
            g.save();
            g.beginPath();
            g.moveTo(0, 0.35 * r);
            g.bezierCurveTo(-0.9 * r, -0.2 * r, -0.5 * r, -0.9 * r, 0, -0.4 * r);
            g.bezierCurveTo(0.5 * r, -0.9 * r, 0.9 * r, -0.2 * r, 0, 0.35 * r);
            g.closePath();
            g.fillStyle = u.radial(g, -0.15 * r, -0.2 * r, 0.05 * r, 0, -0.1 * r, 0.6 * r, ['#ffffff', '#ffd6ec', '#ff7fbf']);
            g.shadowColor = 'rgba(255,255,255,0.9)';
            g.shadowBlur = 0.3 * r;
            g.fill();
            g.restore();
            u.star(g, 0.55 * r, -0.55 * r, 0.16 * r, 0.04 * r, 4, 'rgba(255,255,255,0.95)', null);
            u.star(g, -0.5 * r, 0.45 * r, 0.12 * r, 0.03 * r, 4, 'rgba(255,255,255,0.95)', null);
            u.circle(g, 0, 0, r, null, '#8a0a4f', 2);
        }
    },
]);
