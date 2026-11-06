Cosmetics.define({ pack: 'hat-b-fantasy', category: 'hat', author: 'helper' }, (u) => [
    {
        id: 'fantasy_knight', name: 'Knight Helm', rarity: 'common', tags: ['fantasy', 'silver'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.6 * r, -1.95 * r, 1.2 * r, 0.95 * r, '#cfd8dc', '#90a4ae', 0.05 * r);   // helmet
            u.rect(g, -0.5 * r, -1.5 * r, 1.0 * r, 0.1 * r, '#37474f');                          // visor slit
            u.ellipse(g, 0.1 * c.look * r, -2.25 * r, 0.22 * r, 0.42 * r, 0, '#e53935');          // red plume
        }
    },
    {
        id: 'fantasy_elf', name: 'Elf Circlet', rarity: 'rare', tags: ['fantasy', 'silver'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.85 * r, -1.22 * r, 1.7 * r, 0.22 * r, '#cfd8dc', '#90a4ae', 0.04 * r);  // circlet band
            u.ellipse(g, 0, -1.2 * r, 0.14 * r, 0.2 * r, 0, '#43a047');                          // leaf gem
        }
    },
    {
        id: 'fantasy_dwarf', name: 'Dwarf Helm', rarity: 'common', tags: ['fantasy', 'iron'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.7 * r, -1.95 * r, 1.4 * r, 0.95 * r, '#78909c', '#546e7a', 0.05 * r);   // iron dome
            u.rect(g, -0.78 * r, -1.14 * r, 1.56 * r, 0.14 * r, '#6d4c41');                      // brown beard braid band
        }
    },
    {
        id: 'fantasy_druid', name: 'Druid Wreath', rarity: 'common', tags: ['fantasy', 'nature'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.3 * r, 1.0 * r, 0.2 * r, 0, null, '#2e7d32', 0.2 * r);            // wreath ring
            u.circle(g, -0.95 * r, -1.3 * r, 0.14 * r, '#43a047');                               // leaves
            u.circle(g, -0.5 * r, -1.47 * r, 0.14 * r, '#43a047');
            u.circle(g, 0.5 * r, -1.47 * r, 0.14 * r, '#43a047');
            u.circle(g, 0.95 * r, -1.3 * r, 0.14 * r, '#43a047');
            u.circle(g, -0.25 * r, -1.49 * r, 0.09 * r, '#e53935');                              // red berries
            u.circle(g, 0.25 * r, -1.49 * r, 0.09 * r, '#e53935');
        }
    },
    {
        id: 'fantasy_dragon', name: 'Dragon Helm', rarity: 'rare', tags: ['fantasy', 'red'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.65 * r, -1.95 * r, 1.3 * r, 0.95 * r, '#c62828', '#8e0000', 0.04 * r);  // red scaled helmet
            u.poly(g, [[-0.55 * r, -1.8 * r], [-0.95 * r, -2.5 * r], [-0.35 * r, -1.95 * r]], '#ffc107', '#8d6e63', 0.04 * r);  // left horn
            u.poly(g, [[0.55 * r, -1.8 * r], [0.95 * r, -2.5 * r], [0.35 * r, -1.95 * r]], '#ffc107', '#8d6e63', 0.04 * r);    // right horn
            u.poly(g, [[-0.2 * r, -1.95 * r], [0, -2.25 * r], [0.2 * r, -1.95 * r]], '#ffc107');   // spike
        }
    },
    {
        id: 'fantasy_witch', name: 'Witch Hat', rarity: 'common', tags: ['fantasy', 'black'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.6 * r, -1.15 * r], [0.6 * r, -1.15 * r], [0.35 * c.look * r, -2.9 * r]], '#212121');  // pointed cone
            u.ellipse(g, 0, -1.12 * r, 1.1 * r, 0.18 * r, 0, '#212121');                         // brim
            u.rect(g, -0.5 * r, -1.4 * r, 1.0 * r, 0.22 * r, '#7b1fa2');                         // purple band
            u.rect(g, -0.12 * r, -1.37 * r, 0.24 * r, 0.16 * r, '#ffd54f');                      // buckle
        }
    },
    {
        id: 'fantasy_mage', name: 'Mage Hood', rarity: 'common', tags: ['fantasy', 'blue'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.75 * r, -1.0 * r], [-0.6 * r, -1.5 * r], [-0.2 * r, -2.0 * r], [0.15 * r, -2.7 * r], [0.5 * r, -1.9 * r], [0.75 * r, -1.0 * r]], '#1e88e5', '#0d47a1', 0.05 * r);  // hood
            u.star(g, -0.3 * r, -1.6 * r, 0.14 * r, 0.06 * r, 5, '#eceff1');                     // silver stars
            u.star(g, 0.2 * r, -2.0 * r, 0.12 * r, 0.05 * r, 5, '#eceff1');
            u.star(g, 0, -1.25 * r, 0.1 * r, 0.04 * r, 5, '#eceff1');
        }
    },
    {
        id: 'fantasy_paladin', name: 'Paladin Crest', rarity: 'epic', tags: ['fantasy', 'gold'],
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.6 * r, -1.9 * r], [-1.7 * r, -2.5 * r], [-1.5 * r, -1.6 * r], [-0.6 * r, -1.3 * r]], '#ffffff', '#b0bec5', 0.04 * r);  // left wing
            u.poly(g, [[0.6 * r, -1.9 * r], [1.7 * r, -2.5 * r], [1.5 * r, -1.6 * r], [0.6 * r, -1.3 * r]], '#ffffff', '#b0bec5', 0.04 * r);    // right wing
            u.rect(g, -0.6 * r, -1.95 * r, 1.2 * r, 0.95 * r, '#ffca28', '#f9a825', 0.05 * r);  // gold helm
            u.rect(g, -0.5 * r, -1.5 * r, 1.0 * r, 0.1 * r, '#5d4037');                          // visor slit
        }
    },
    {
        id: 'fantasy_frost', name: 'Frost Crown', rarity: 'rare', tags: ['fantasy', 'ice'],
        draw(g, c) {
            const r = c.r;
            u.rect(g, -0.8 * r, -1.2 * r, 1.6 * r, 0.2 * r, '#81d4fa', '#4fc3f7', 0.04 * r);    // crown base
            u.poly(g, [[-0.8 * r, -1.2 * r], [-0.6 * r, -2.2 * r], [-0.35 * r, -1.2 * r], [-0.1 * r, -2.6 * r], [0.15 * r, -1.2 * r], [0.4 * r, -2.3 * r], [0.8 * r, -1.2 * r]], '#b3e5fc', '#29b6f6', 0.04 * r);  // icicles
        }
    },
    {
        id: 'fantasy_archmage', name: 'Archmage', rarity: 'legendary', tags: ['fantasy', 'violet'], anim: true,
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.7 * r, -1.2 * r], [-0.55 * r, -2.6 * r], [-0.2 * r, -1.9 * r], [0, -3.0 * r], [0.2 * r, -1.9 * r], [0.55 * r, -2.6 * r], [0.7 * r, -1.2 * r]], '#7e57c2', '#4527a0', 0.04 * r);  // tall crown
            u.rect(g, -0.7 * r, -1.2 * r, 1.4 * r, 0.2 * r, '#9575cd', '#4527a0', 0.04 * r);    // band
            const a = c.t / 700;
            for (const k of [0, Math.PI]) {
                const ox = Math.cos(a + k) * 0.95 * r;
                const oy = -2.0 * r + Math.sin(a + k) * 0.35 * r;
                u.circle(g, ox, oy, 0.3 * r, u.radial(g, ox, oy, 0, ox, oy, 0.3 * r, ['rgba(234,128,252,0.9)', 'rgba(234,128,252,0)']));  // glow
                u.circle(g, ox, oy, 0.12 * r, '#f3e5f5');                                       // orb
            }
        }
    },
]);
