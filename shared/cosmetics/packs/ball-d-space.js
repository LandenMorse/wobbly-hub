Cosmetics.define({ pack: 'ball-d-space', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'space_moon', name: 'Moon', rarity: 'common', tags: ['space', 'grey'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#bdbdbd', '#616161', 2);
            u.circle(g, -0.35 * r, -0.2 * r, 0.28 * r, '#9e9e9e', null);
            u.circle(g, 0.3 * r, 0.3 * r, 0.22 * r, '#9e9e9e', null);
            u.circle(g, 0.1 * r, -0.5 * r, 0.14 * r, '#8a8a8a', null);
        }
    },
    {
        id: 'space_mars', name: 'Mars', rarity: 'common', tags: ['space', 'red'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#e64a19', '#8d2a0b', 2);
            u.line(g, [[-0.9 * r, -0.4 * r], [0.9 * r, -0.2 * r]], '#bf360c', 0.12 * r, 'round');
            u.line(g, [[-0.8 * r, 0.2 * r], [0.8 * r, 0.45 * r]], '#ff8a65', 0.1 * r, 'round');
            u.line(g, [[-0.6 * r, 0.7 * r], [0.6 * r, 0.75 * r]], '#bf360c', 0.1 * r, 'round');
        }
    },
    {
        id: 'space_earth', name: 'Earth', rarity: 'common', tags: ['space', 'blue'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#1e88e5', '#0d47a1', 2);
            u.ellipse(g, -0.35 * r, -0.2 * r, 0.42 * r, 0.3 * r, 0.3, '#43a047', null);
            u.ellipse(g, 0.4 * r, 0.3 * r, 0.35 * r, 0.25 * r, -0.2, '#43a047', null);
            u.ellipse(g, 0.1 * r, -0.65 * r, 0.22 * r, 0.12 * r, 0, '#ffffff', null);
            u.ellipse(g, -0.5 * r, 0.6 * r, 0.25 * r, 0.12 * r, 0, '#ffffff', null);
            u.ellipse(g, 0.55 * r, -0.4 * r, 0.2 * r, 0.1 * r, 0, '#ffffff', null);
        }
    },
    {
        id: 'space_jupiter', name: 'Jupiter', rarity: 'common', tags: ['space', 'tan'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#d7ccc8', null);
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            u.rect(g, -r, -0.55 * r, 2 * r, 0.3 * r, '#d7a86e', null);
            u.rect(g, -r, -0.2 * r, 2 * r, 0.3 * r, '#8d6e63', null);
            u.rect(g, -r, 0.15 * r, 2 * r, 0.25 * r, '#bcaaa4', null);
            u.rect(g, -r, 0.5 * r, 2 * r, 0.3 * r, '#6d4c41', null);
            g.restore();
            u.circle(g, 0, 0, r, null, '#5d4037', 2);
        }
    },
    {
        id: 'space_comet', name: 'Comet', rarity: 'common', tags: ['space', 'ice'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, 0, 0, 0, 0, 0, r, ['#ffffff', '#b3e5fc', '#4fc3f7']), '#0288d1', 2);
            u.circle(g, 0, 0, 0.35 * r, '#ffffff', null);
        }
    },
    {
        id: 'space_saturn', name: 'Saturn', rarity: 'rare', tags: ['space', 'gold', 'ring'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, 0.85 * r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, 0.9 * r, ['#fff8e1', '#f5e6a8', '#d4b865']), null);
            u.ellipse(g, 0, 0, 1.2 * r, 0.35 * r, -0.4, null, '#c9a227', 0.14 * r);
        }
    },
    {
        id: 'space_sun', name: 'Sun', rarity: 'rare', tags: ['space', 'fire', 'bright'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, 1.2 * r, 'rgba(255,193,7,0.35)', null);
            u.circle(g, 0, 0, r, u.radial(g, -0.2 * r, -0.2 * r, 0.1 * r, 0, 0, r, ['#fff59d', '#ffb300', '#ff6f00']), '#e65100', 2);
        }
    },
    {
        id: 'space_nebula', name: 'Nebula', rarity: 'rare', tags: ['space', 'purple', 'pink'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, 0.2 * r, -0.2 * r, 0.1 * r, 0, 0, r, ['#f48fb1', '#8e24aa', '#311b92']), '#4a148c', 2);
            u.line(g, [[-0.8 * r, -0.3 * r], [-0.3 * r, -0.6 * r], [0.2 * r, -0.2 * r], [0.7 * r, -0.5 * r]], '#f8bbd0', 0.12 * r, 'round');
            u.line(g, [[-0.6 * r, 0.4 * r], [-0.1 * r, 0.1 * r], [0.4 * r, 0.5 * r], [0.8 * r, 0.2 * r]], '#ce93d8', 0.12 * r, 'round');
            u.circle(g, 0.3 * r, 0.1 * r, 0.14 * r, '#ffffff', null);
        }
    },
    {
        id: 'space_blackhole', name: 'Black Hole', rarity: 'epic', tags: ['space', 'dark', 'void'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#000000', '#37474f', 2);
            u.ellipse(g, 0, 0, 1.15 * r, 0.38 * r, -0.3, null, '#ff9800', 0.2 * r);
            u.ellipse(g, 0, 0, 1.15 * r, 0.38 * r, -0.3, null, '#fff3e0', 0.07 * r);
            u.circle(g, 0, 0, 0.6 * r, '#000000', null);
        }
    },
    {
        id: 'space_supernova', name: 'Supernova', rarity: 'epic', tags: ['space', 'burst', 'fire'], fx: 'fire',
        draw(g, c) {
            const r = c.r;
            u.star(g, 0, 0, 1.2 * r, 0.55 * r, 12, '#ffee58', '#ffb300', 2);
            u.circle(g, 0, 0, 0.8 * r, u.radial(g, 0, 0, 0, 0, 0, 0.8 * r, ['#ffffff', '#fff59d']), null);
        }
    },
]);
