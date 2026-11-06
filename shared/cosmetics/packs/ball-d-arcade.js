Cosmetics.define({ pack: 'ball-d-arcade', category: 'ball', author: 'helper' }, (u) => [
    {
        id: 'arcade_pacman', name: 'Chomp', rarity: 'common', tags: ['retro', 'game'],
        trail: '255,214,0', goal: ['#ffd600', '#1a1a2e', '#ffffff'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffd600', '#c79100', 0.08 * r);
            u.poly(g, [[0, 0], [1.2 * r * c.look, -0.8 * r], [1.2 * r * c.look, 0.8 * r]], '#1a1a2e', null);
            u.circle(g, 0.1 * r * c.look, -0.5 * r, 0.12 * r, '#222222', null);
        }
    },
    {
        id: 'arcade_invader', name: 'Invader', rarity: 'common', tags: ['retro', 'space'],
        trail: '57,255,20', goal: ['#39ff14', '#1b1b2f', '#00e5ff'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#1b1b2f', '#00e5ff', 0.08 * r);
            const rows = ['.X...X.', '..XXX..', '.XXXXX.', 'XX.X.XX', 'XXXXXXX', 'X.XXX.X', 'X.X.X.X'];
            const cell = 0.14 * r;
            const x0 = -3.5 * cell;
            const y0 = -3.5 * cell;
            rows.forEach((row, j) => [...row].forEach((ch, i) => {
                if (ch === 'X') u.rect(g, x0 + i * cell, y0 + j * cell, cell, cell, '#39ff14', null);
            }));
        }
    },
    {
        id: 'arcade_dice', name: 'Dice', rarity: 'common', tags: ['lucky', 'game'],
        trail: '240,240,240', goal: ['#ffffff', '#111111', '#e53935'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#222222', 0.08 * r);
            const p = 0.4 * r;
            const pr = 0.13 * r;
            [[-p, -p], [p, -p], [0, 0], [-p, p], [p, p]].forEach(([x, y]) => u.circle(g, x, y, pr, '#111111', null));
        }
    },
    {
        id: 'arcade_chess', name: 'Chess', rarity: 'common', tags: ['classic', 'board'],
        trail: '200,200,200', goal: ['#111111', '#f5f5f5', '#8d6e63'],
        draw(g, c) {
            const r = c.r;
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    u.rect(g, -r + i * 0.5 * r, -r + j * 0.5 * r, 0.5 * r, 0.5 * r, (i + j) % 2 ? '#111111' : '#f5f5f5', null);
                }
            }
            g.restore();
            u.circle(g, 0, 0, r, null, '#222222', 0.08 * r);
        }
    },
    {
        id: 'arcade_cards', name: 'Ace', rarity: 'common', tags: ['cards', 'classic'],
        trail: '229,57,53', goal: ['#e53935', '#111111', '#ffffff'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff', '#222222', 0.08 * r);
            const suit = (cx, cy, s, f, fill) => {
                const P = (x, y) => [cx + x * s, cy + f * y * s];
                g.beginPath();
                g.moveTo(...P(0, 0.35));
                g.bezierCurveTo(...P(-0.6, 0.05), ...P(-0.45, -0.45), ...P(0, -0.15));
                g.bezierCurveTo(...P(0.45, -0.45), ...P(0.6, 0.05), ...P(0, 0.35));
                g.fillStyle = fill;
                g.fill();
            };
            suit(-0.3 * r, -0.2 * r, 0.45 * r, 1, '#e53935');
            suit(0.3 * r, 0.2 * r, 0.45 * r, -1, '#111111');
            u.poly(g, [[0.26 * r, 0.36 * r], [0.34 * r, 0.36 * r], [0.5 * r, 0.6 * r], [0.1 * r, 0.6 * r]], '#111111', null);
        }
    },
    {
        id: 'arcade_target', name: 'Target', rarity: 'common', tags: ['bullseye', 'sport'],
        trail: '229,57,53', goal: ['#e53935', '#ffffff', '#b71c1c'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#e53935', '#7f0000', 0.06 * r);
            u.circle(g, 0, 0, 0.8 * r, '#ffffff', null);
            u.circle(g, 0, 0, 0.6 * r, '#e53935', null);
            u.circle(g, 0, 0, 0.4 * r, '#ffffff', null);
            u.circle(g, 0, 0, 0.2 * r, '#e53935', null);
        }
    },
    {
        id: 'arcade_slot', name: 'Slot Seven', rarity: 'rare', tags: ['jackpot', 'casino'],
        trail: '255,193,7', goal: ['#ffc107', '#d32f2f', '#fff8e1'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffc107', '#8d6000', 0.08 * r);
            u.line(g, [[-0.4 * r, -0.55 * r], [0.4 * r, -0.55 * r], [-0.1 * r, 0.7 * r]], '#d32f2f', 0.22 * r, 'round');
        }
    },
    {
        id: 'arcade_vinyl', name: 'Vinyl', rarity: 'rare', tags: ['music', 'retro'],
        trail: '120,120,120', goal: ['#151515', '#e53935', '#f5f5f5'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#151515', '#000000', 0.04 * r);
            [0.85, 0.7, 0.55].forEach((k) => u.circle(g, 0, 0, k * r, null, '#3d3d3d', 0.03 * r));
            u.circle(g, 0, 0, 0.38 * r, '#e53935', null);
            u.circle(g, 0, 0, 0.06 * r, '#f5f5f5', null);
        }
    },
    {
        id: 'arcade_cd', name: 'Rainbow CD', rarity: 'epic', tags: ['shiny', 'music'],
        trail: '207,216,220', goal: ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#b388ff'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#cfd8dc', '#78909c', 0.08 * r);
            g.save();
            g.globalAlpha = 0.55;
            u.circle(g, 0, 0, r, u.linear(g, -r, -r, r, r, ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#b388ff']), null);
            g.restore();
            u.circle(g, 0, 0, 0.2 * r, '#eceff1', '#90a4ae', 0.04 * r);
        }
    },
    {
        id: 'arcade_jackpot', name: 'Jackpot', rarity: 'legendary', tags: ['gold', 'casino'],
        anim: true,
        trail: '255,213,79', goal: ['#ffd54f', '#fff8e1', '#ffb300'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 0.1 * r, 0, 0, r, ['#fff59d', '#ffc107', '#b8860b']), '#8a6100', 0.12 * r);
            u.star(g, 0, 0, 0.6 * r, 0.25 * r, 5, '#fff8e1', '#8a6100', 0.04 * r);
            g.save();
            g.beginPath();
            g.arc(0, 0, r, 0, Math.PI * 2);
            g.clip();
            const sx = Math.sin(c.t / 500) * 1.3 * r;
            g.fillStyle = u.linear(g, sx - 0.4 * r, -r, sx + 0.4 * r, r, ['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']);
            g.fillRect(-r, -r, 2 * r, 2 * r);
            g.restore();
        }
    },
]);
