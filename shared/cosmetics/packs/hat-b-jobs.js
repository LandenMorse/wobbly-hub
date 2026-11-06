Cosmetics.define({ pack: 'hat-b-jobs', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'jobs_hardhat', name: 'Hard Hat', rarity: 'common', tags: ['jobs', 'construction'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.5 * r, 0.95 * r, 0.5 * r, 0, '#fdd835', '#f9a825', 0.06 * r);
            u.rect(g, -1.0 * r, -1.12 * r, 2.0 * r, 0.14 * r, '#f9a825');
            u.rect(g, -0.1 * r, -2.05 * r, 0.2 * r, 0.3 * r, '#f9a825');
        }
    },
    {
        id: 'jobs_firefighter', name: 'Fire Helmet', rarity: 'common', tags: ['jobs', 'fire'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.5 * r, 0.95 * r, 0.5 * r, 0, '#d32f2f', '#b71c1c', 0.05 * r);
            u.rect(g, -0.95 * r, -1.2 * r, 1.9 * r, 0.22 * r, '#b71c1c');
            u.poly(g, [[-0.35 * r, -1.85 * r], [0.35 * r, -1.85 * r], [0.35 * r, -1.45 * r], [0, -1.2 * r], [-0.35 * r, -1.45 * r]], '#ffca28', '#f9a825', 0.04 * r);
        }
    },
    {
        id: 'jobs_police', name: 'Police Cap', rarity: 'common', tags: ['jobs', 'police'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.8 * r, -1.95 * r, 1.6 * r, 0.95 * r, '#1a237e');
            u.ellipse(g, 0.45 * r * c.look, -1.0 * r, 0.6 * r, 0.14 * r, 0, '#0d1452');
            u.star(g, 0, -1.5 * r, 0.25 * r, 0.11 * r, 5, '#ffca28', '#f9a825', 0.03 * r);
        }
    },
    {
        id: 'jobs_nurse', name: 'Nurse Cap', rarity: 'common', tags: ['jobs', 'medical'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.8 * r, -1.95 * r, 1.6 * r, 0.95 * r, '#ffffff', '#bdbdbd', 0.05 * r);
            u.rect(g, -0.08 * r, -1.8 * r, 0.16 * r, 0.5 * r, '#e53935');
            u.rect(g, -0.25 * r, -1.63 * r, 0.5 * r, 0.16 * r, '#e53935');
        }
    },
    {
        id: 'jobs_pilot', name: 'Pilot Cap', rarity: 'rare', tags: ['jobs', 'aviation'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.45 * r, 0.95 * r, 0.5 * r, 0, '#1a237e');
            u.ellipse(g, 0.4 * r * c.look, -1.0 * r, 0.65 * r, 0.12 * r, 0, '#0d1452');
            u.ellipse(g, -0.35 * r, -1.55 * r, 0.35 * r, 0.14 * r, -0.3, '#ffca28');
            u.ellipse(g, 0.35 * r, -1.55 * r, 0.35 * r, 0.14 * r, 0.3, '#ffca28');
            u.circle(g, 0, -1.55 * r, 0.1 * r, '#f9a825');
        }
    },
    {
        id: 'jobs_miner', name: 'Miner Lamp', rarity: 'common', tags: ['jobs', 'mining'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.45 * r, 0.92 * r, 0.5 * r, 0, '#cfd8dc', '#90a4ae', 0.05 * r);
            u.rect(g, -0.95 * r, -1.1 * r, 1.9 * r, 0.12 * r, '#90a4ae');
            u.circle(g, 0.55 * r * c.look, -1.55 * r, 0.3 * r, 'rgba(255,241,118,0.35)', null);
            u.circle(g, 0.55 * r * c.look, -1.55 * r, 0.18 * r, '#fff59d', '#f9a825', 0.04 * r);
        }
    },
    {
        id: 'jobs_graduate', name: 'Graduation Cap', rarity: 'rare', tags: ['jobs', 'school'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.25 * r, 0.62 * r, 0.22 * r, 0, '#263238');
            u.poly(g, [[0, -2.05 * r], [1.2 * r, -1.6 * r], [0, -1.05 * r], [-1.2 * r, -1.6 * r]], '#212121', '#000000', 0.04 * r);
            u.line(g, [[0, -1.8 * r], [0.9 * r, -1.7 * r], [0.95 * r, -1.25 * r]], '#fbc02d', 0.05 * r, 'round');
            u.circle(g, 0.95 * r, -1.2 * r, 0.08 * r, '#fbc02d');
        }
    },
    {
        id: 'jobs_painter', name: 'Painter Beret', rarity: 'common', tags: ['jobs', 'art'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.45 * r, 1.0 * r, 0.42 * r, -0.08, '#e53935', '#b71c1c', 0.04 * r);
            u.circle(g, 0.1 * r, -1.9 * r, 0.1 * r, '#b71c1c');
            u.circle(g, -0.5 * r, -1.5 * r, 0.12 * r, '#43a047');
            u.circle(g, 0.2 * r, -1.6 * r, 0.1 * r, '#1e88e5');
            u.circle(g, 0.5 * r, -1.4 * r, 0.09 * r, '#fdd835');
            u.circle(g, -0.1 * r, -1.35 * r, 0.08 * r, '#8e24aa');
        }
    },
    {
        id: 'jobs_detective', name: 'Detective', rarity: 'rare', tags: ['jobs', 'checkered'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.5 * r, 0.9 * r, 0.5 * r, 0, '#8d6e63');
            for (let i = -2; i <= 1; i++) {
                for (let j = 0; j < 2; j++) {
                    if ((i + j) % 2 === 0) {
                        u.rect(g, (i * 0.3) * r, (-1.9 + j * 0.3) * r, 0.3 * r, 0.3 * r, '#5d4037');
                    }
                }
            }
            u.rect(g, -0.92 * r, -1.12 * r, 1.84 * r, 0.14 * r, '#5d4037');
            u.poly(g, [[-0.8 * r, -1.15 * r], [-1.35 * r, -1.1 * r], [-1.2 * r, -0.98 * r], [-0.8 * r, -1.0 * r]], '#6d4c41');
            u.poly(g, [[0.8 * r, -1.15 * r], [1.35 * r, -1.1 * r], [1.2 * r, -0.98 * r], [0.8 * r, -1.0 * r]], '#6d4c41');
        }
    },
    {
        id: 'jobs_chief', name: 'Mayor Topper', rarity: 'epic', tags: ['jobs', 'formal'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.6 * r, -2.7 * r, 1.2 * r, 1.7 * r, '#212121', '#000000', 0.04 * r);
            u.ellipse(g, 0, -1.05 * r, 1.0 * r, 0.12 * r, 0, '#212121');
            u.rect(g, -0.6 * r, -1.7 * r, 1.2 * r, 0.25 * r, c.team);
            u.circle(g, 0, -1.58 * r, 0.2 * r, '#ffca28', '#f9a825', 0.04 * r);
        }
    },
]);
