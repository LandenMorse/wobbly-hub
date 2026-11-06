Cosmetics.define({ pack: 'ball-d-sport', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'sport_tennis', name: 'Tennis', rarity: 'common', tags: ['sport', 'tennis'], trail: '217,249,157', goal: ['#d9f99d', '#ffffff'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#d9f99d', '#a3e635', 2);
            g.beginPath(); g.strokeStyle = '#ffffff'; g.lineWidth = 0.12 * r;
            g.moveTo(-0.8 * r, -0.6 * r); g.quadraticCurveTo(0, -0.1 * r, -0.5 * r, 0.7 * r); g.stroke();
            g.beginPath(); g.moveTo(0.8 * r, -0.6 * r); g.quadraticCurveTo(0, 0.1 * r, 0.5 * r, 0.7 * r); g.stroke();
        }
    },
    {
        id: 'sport_basket', name: 'Basketball', rarity: 'common', tags: ['sport', 'basketball'], trail: '249,115,22', goal: ['#f97316', '#fb923c'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#f97316', '#7c2d12', 2);
            u.line(g, [[0, -r], [0, r]], '#111827', 0.1 * r);
            u.line(g, [[-r, 0], [r, 0]], '#111827', 0.1 * r);
            g.beginPath(); g.strokeStyle = '#111827'; g.lineWidth = 0.1 * r;
            g.moveTo(-0.7 * r, -0.7 * r); g.quadraticCurveTo(-0.1 * r, 0, -0.7 * r, 0.7 * r); g.stroke();
            g.beginPath(); g.moveTo(0.7 * r, -0.7 * r); g.quadraticCurveTo(0.1 * r, 0, 0.7 * r, 0.7 * r); g.stroke();
        }
    },
    {
        id: 'sport_volley', name: 'Volleyball', rarity: 'common', tags: ['sport', 'volleyball'], trail: '59,130,246', goal: ['#2563eb', '#facc15'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#94a3b8', 2);
            u.poly(g, [[-0.9 * r, -0.1 * r], [-0.1 * r, -0.8 * r], [0.4 * r, -0.5 * r], [-0.5 * r, 0.3 * r]], '#2563eb', null);
            u.poly(g, [[0.5 * r, 0.3 * r], [0.9 * r, -0.2 * r], [0.6 * r, 0.7 * r], [0.1 * r, 0.8 * r]], '#facc15', null);
        }
    },
    {
        id: 'sport_rugby', name: 'Rugby Ball', rarity: 'common', tags: ['sport', 'rugby'], trail: '141,85,36', goal: ['#8d5524', '#ffffff'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#8d5524', '#3f1d0b', 2);
            u.line(g, [[-0.7 * r, 0], [0.7 * r, 0]], '#ffffff', 0.1 * r);
            [-0.5, -0.25, 0, 0.25, 0.5].forEach((x) => {
                u.line(g, [[x * r, -0.14 * r], [x * r, 0.14 * r]], '#ffffff', 0.07 * r);
            });
        }
    },
    {
        id: 'sport_bowling', name: 'Bowling Ball', rarity: 'common', tags: ['sport', 'bowling'], trail: '100,116,139', goal: ['#1e293b', '#94a3b8'],
        draw(g, c) {
            const r = c.r;
            const shade = u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#475569', '#1e293b', '#020617']);
            u.circle(g, 0, 0, r, shade, '#000000', 2);
            g.beginPath(); g.strokeStyle = 'rgba(148,163,184,0.35)'; g.lineWidth = 0.08 * r;
            g.arc(0.2 * r, 0.3 * r, 0.5 * r, 0, Math.PI * 1.5); g.stroke();
            u.ellipse(g, -0.5 * r, 0.3 * r, 0.2 * r, 0.1 * r, -0.6, 'rgba(255,255,255,0.5)', null);
            u.circle(g, -0.25 * r, -0.5 * r, 0.13 * r, '#020617', '#94a3b8', 1);
            u.circle(g, 0.2 * r, -0.5 * r, 0.13 * r, '#020617', '#94a3b8', 1);
            u.circle(g, 0, -0.15 * r, 0.13 * r, '#020617', '#94a3b8', 1);
        }
    },
    {
        id: 'sport_pingpong', name: 'Ping Pong', rarity: 'common', tags: ['sport', 'table tennis'], trail: '226,232,240', goal: ['#ffffff', '#f97316'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#cbd5e1', 2);
            u.circle(g, 0.45 * r, -0.35 * r, 0.2 * r, '#f97316', null);
        }
    },
    {
        id: 'sport_golf', name: 'Golf Ball', rarity: 'rare', tags: ['sport', 'golf'], trail: '203,213,225', goal: ['#ffffff', '#cbd5e1'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#cbd5e1', 2);
            [[-0.4, -0.4], [0, -0.45], [0.4, -0.4], [-0.5, 0], [-0.15, -0.1], [0.2, -0.1], [0.5, 0.05], [-0.3, 0.35], [0.1, 0.35], [0.45, 0.4]].forEach((p) => {
                u.circle(g, p[0] * r, p[1] * r, 0.1 * r, '#cbd5e1', null);
            });
        }
    },
    {
        id: 'sport_baseball', name: 'Baseball', rarity: 'rare', tags: ['sport', 'baseball'], trail: '239,68,68', goal: ['#ffffff', '#dc2626'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#e2e8f0', 2);
            g.beginPath(); g.strokeStyle = '#dc2626'; g.lineWidth = 0.1 * r; g.setLineDash([0.12 * r, 0.1 * r]);
            g.moveTo(-0.7 * r, -0.5 * r); g.quadraticCurveTo(-0.3 * r, 0, -0.7 * r, 0.5 * r); g.stroke();
            g.beginPath(); g.moveTo(0.7 * r, -0.5 * r); g.quadraticCurveTo(0.3 * r, 0, 0.7 * r, 0.5 * r); g.stroke();
            g.setLineDash([]);
        }
    },
    {
        id: 'sport_hockey', name: 'Puck Ball', rarity: 'epic', tags: ['sport', 'hockey', 'ice'], trail: '125,211,252', goal: ['#111827', '#cbd5e1', '#7dd3fc'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#111827', '#000000', 2);
            u.circle(g, 0, 0, 0.6 * r, null, '#cbd5e1', 0.16 * r);
        }
    },
    {
        id: 'sport_trophy', name: 'Trophy Ball', rarity: 'legendary', tags: ['sport', 'trophy', 'gold'], anim: true, fx: 'sparkle', trail: '253,224,71', goal: ['#fde047', '#facc15', '#fff7ad'],
        draw(g, c) {
            const r = c.r;
            const pulse = 1 + 0.06 * Math.sin(c.t / 250);
            const gold = u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#fff7ad', '#facc15', '#b45309']);
            u.circle(g, 0, 0, r, gold, '#92400e', 2);
            u.star(g, 0, 0, 0.6 * r * pulse, 0.26 * r * pulse, 5, '#fff7ad', '#b45309', 1.5);
            u.star(g, 0.72 * r, -0.62 * r, 0.16 * r * pulse, 0.06 * r, 4, '#ffffff', null);
            u.star(g, -0.7 * r, 0.6 * r, 0.12 * r * pulse, 0.05 * r, 4, '#ffffff', null);
        }
    },
]);
