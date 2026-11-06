// Base hats (the originals). lift values are kept from the old list; new hats
// can leave lift out and it is measured from the drawing.
Cosmetics.define({ pack: 'hat-base', category: 'hat', author: 'core' }, (u) => [
    { id: 'none', name: 'None', lift: 0, clearTop: true },
    {
        id: 'crown', name: 'Crown', lift: 26, rarity: 'epic',
        draw(g, c) {
            const r = c.r;
            u.poly(g, [[-0.5 * r, -1.15 * r], [-0.55 * r, -1.62 * r], [-0.27 * r, -1.4 * r], [0, -1.72 * r], [0.27 * r, -1.4 * r], [0.55 * r, -1.62 * r], [0.5 * r, -1.15 * r]], '#f1c40f', '#b7950b', 2);
            u.circle(g, 0, -1.32 * r, 3.5, '#e74c3c');
            g.fillStyle = '#3498db'; g.beginPath(); g.arc(-0.3 * r, -1.25 * r, 2.5, 0, u.TAU); g.arc(0.3 * r, -1.25 * r, 2.5, 0, u.TAU); g.fill();
        }
    },
    {
        id: 'cap', name: 'Cap', lift: 4,
        draw(g, c) {
            const r = c.r, look = c.look;
            const dome = (rad, a0, a1, fill) => { g.beginPath(); g.arc(0, -0.3 * r, r * rad, Math.PI * a0, Math.PI * a1); g.closePath(); g.fillStyle = fill; g.fill(); };
            dome(1.06, 1.12, 1.88, c.team); dome(1.06, 1.12, 1.88, 'rgba(0,0,0,0.25)'); dome(1.02, 1.14, 1.86, c.team);
            u.poly(g, [[look * 0.2 * r, -0.74 * r], [look * 1.5 * r, -0.66 * r], [look * 1.5 * r, -0.58 * r], [look * 0.2 * r, -0.62 * r]], '#2d3436');
            u.circle(g, 0, -1.36 * r, 3, '#fff');
        }
    },
    {
        id: 'party', name: 'Party Hat', lift: 44,
        draw(g, c) {
            const r = c.r, look = c.look;
            g.save();
            u.poly(g, [[-0.42 * r, -1.18 * r], [0.42 * r, -1.18 * r], [0.08 * look * r, -2.15 * r]], c.team);
            g.clip();
            for (let y = -1.3; y > -2.2; y -= 0.25) u.line(g, [[-r, y * r], [r, (y - 0.15) * r]], '#f1c40f', 4, 'butt');
            g.restore();
            u.circle(g, 0.08 * look * r, -2.15 * r, 5, '#fff');
        }
    },
    {
        id: 'viking', name: 'Viking', lift: 24,
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                g.beginPath();
                g.moveTo(s * 0.7 * r, -0.95 * r);
                g.quadraticCurveTo(s * 1.35 * r, -1.0 * r, s * 1.3 * r, -1.7 * r);
                g.quadraticCurveTo(s * 1.05 * r, -1.25 * r, s * 0.55 * r, -1.2 * r);
                g.closePath(); g.fillStyle = '#ecf0f1'; g.fill(); g.strokeStyle = '#b2bec3'; g.lineWidth = 1.5; g.stroke();
            }
            g.fillStyle = '#95a5a6';
            g.beginPath(); g.arc(0, -0.3 * r, r * 1.05, Math.PI * 1.15, Math.PI * 1.85); g.closePath(); g.fill();
            g.fillStyle = '#7f8c8d'; g.fillRect(-0.85 * r, -0.86 * r, 1.7 * r, 0.12 * r);
        }
    },
    {
        id: 'tophat', name: 'Top Hat', lift: 36,
        draw(g, c) {
            const r = c.r;
            g.fillStyle = '#1e1e1e';
            g.fillRect(-0.72 * r, -1.36 * r, 1.44 * r, 0.14 * r);
            g.fillRect(-0.46 * r, -2.05 * r, 0.92 * r, 0.72 * r);
            g.fillStyle = c.team; g.fillRect(-0.46 * r, -1.55 * r, 0.92 * r, 0.14 * r);
        }
    },
    {
        id: 'halo', name: 'Halo', lift: 28, clearTop: true, anim: true, rarity: 'legendary',
        draw(g, c) {
            const r = c.r, bob = Math.sin(c.t * 0.004) * 3;
            g.shadowBlur = 12; g.shadowColor = '#ffeaa7';
            g.strokeStyle = '#f9e076'; g.lineWidth = 4;
            g.beginPath(); g.ellipse(0, -1.75 * r + bob, 0.55 * r, 0.15 * r, 0, 0, u.TAU); g.stroke();
        }
    },
    {
        id: 'hat_beanie', name: 'Beanie', lift: 10,
        draw(g, c) {
            const r = c.r;
            g.fillStyle = c.team;
            g.beginPath(); g.arc(0, -0.5 * r, r * 1.05, Math.PI * 1.08, Math.PI * 1.92); g.closePath(); g.fill();
            g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(-1.08 * r, -0.92 * r, 2.16 * r, 0.24 * r);
            u.circle(g, 0, -1.6 * r, 0.16 * r, '#ffffff');
        }
    },
    {
        id: 'hat_fedora', name: 'Fedora', lift: 26,
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -0.95 * r, 1.2 * r, 0.25 * r, 0, '#6d4c41');
            g.fillStyle = '#795548'; g.fillRect(-0.6 * r, -1.9 * r, 1.2 * r, 0.95 * r);
            g.fillStyle = '#3e2723'; g.fillRect(-0.6 * r, -1.1 * r, 1.2 * r, 0.14 * r);
        }
    },
    {
        id: 'hat_bunny', name: 'Bunny Ears', lift: 40,
        draw(g, c) {
            const r = c.r;
            for (const s of [-1, 1]) {
                u.ellipse(g, s * 0.45 * r, -1.5 * r, 0.2 * r, 0.7 * r, s * 0.15, '#ffffff', '#b2bec3', 1.5);
                u.ellipse(g, s * 0.45 * r, -1.5 * r, 0.09 * r, 0.5 * r, s * 0.15, '#fd79a8');
            }
        }
    },
    {
        id: 'hat_headband', name: 'Headband', lift: 6,
        draw(g, c) {
            const r = c.r;
            g.strokeStyle = '#ffffff'; g.lineWidth = 0.22 * r; g.lineCap = 'round';
            g.beginPath(); g.arc(0, -0.2 * r, r * 1.02, Math.PI * 1.2, Math.PI * 1.8); g.stroke();
        }
    },
    {
        id: 'hat_wizard', name: 'Wizard', lift: 56, rarity: 'rare',
        draw(g, c) {
            const r = c.r, look = c.look;
            g.fillStyle = '#6c5ce7'; g.strokeStyle = '#2d3436'; g.lineWidth = 1.5;
            g.beginPath(); g.moveTo(-0.6 * r, -0.98 * r); g.quadraticCurveTo(-0.5 * r, -1.8 * r, 0.35 * look * r, -2.5 * r);
            g.quadraticCurveTo(0.45 * r, -1.6 * r, 0.6 * r, -0.98 * r); g.closePath(); g.fill(); g.stroke();
            g.beginPath(); g.ellipse(0, -0.95 * r, 1.1 * r, 0.2 * r, 0, 0, u.TAU); g.fill(); g.stroke();
            u.circle(g, 0, -1.6 * r, 0.08 * r, '#f1c40f');
            u.circle(g, 0.2 * look * r, -2.0 * r, 0.07 * r, '#f1c40f');
        }
    },
    {
        id: 'hat_pirate', name: 'Pirate', lift: 26,
        draw(g, c) {
            const r = c.r;
            g.fillStyle = '#2d3436'; g.strokeStyle = '#000000'; g.lineWidth = 1.5;
            g.beginPath(); g.moveTo(-1.2 * r, -1.0 * r); g.quadraticCurveTo(-0.6 * r, -1.9 * r, 0, -1.7 * r);
            g.quadraticCurveTo(0.6 * r, -1.9 * r, 1.2 * r, -1.0 * r); g.quadraticCurveTo(0, -1.1 * r, -1.2 * r, -1.0 * r);
            g.closePath(); g.fill(); g.stroke();
            u.circle(g, 0, -1.42 * r, 0.16 * r, '#ffffff');
            g.fillStyle = '#2d3436'; g.fillRect(-0.08 * r, -1.46 * r, 0.05 * r, 0.05 * r); g.fillRect(0.03 * r, -1.46 * r, 0.05 * r, 0.05 * r);
        }
    },
    {
        id: 'hat_propeller', name: 'Propeller', lift: 26, anim: true,
        draw(g, c) {
            const r = c.r;
            g.fillStyle = '#e17055';
            g.beginPath(); g.arc(0, -0.3 * r, r * 1.04, Math.PI * 1.1, Math.PI * 1.9); g.closePath(); g.fill();
            g.translate(0, -1.45 * r); g.rotate(c.t * 0.01);
            g.fillStyle = '#fdcb6e';
            for (const a of [0, Math.PI / 2]) { g.save(); g.rotate(a); g.fillRect(-0.9 * r, -0.06 * r, 1.8 * r, 0.12 * r); g.restore(); }
        }
    },
    {
        id: 'hat_flower', name: 'Flower Crown', lift: 20,
        draw(g, c) {
            const r = c.r, cols = ['#ff7675', '#fdcb6e', '#fd79a8', '#a29bfe'];
            for (let i = 0; i < 5; i++) {
                const a = Math.PI * (1.15 + i * 0.175);
                const x = Math.cos(a) * r, y = -0.5 * r + Math.sin(a) * r;
                u.circle(g, x, y, 0.2 * r, cols[i % cols.length]);
                u.circle(g, x, y, 0.07 * r, '#ffeaa7');
            }
        }
    },
    {
        id: 'hat_santa', name: 'Santa', lift: 30,
        draw(g, c) {
            const r = c.r, look = c.look;
            g.fillStyle = '#d63031';
            g.beginPath(); g.moveTo(-0.7 * r, -0.98 * r); g.quadraticCurveTo(-0.5 * r, -1.9 * r, 0.85 * look * r, -1.45 * r);
            g.quadraticCurveTo(0.45 * look * r, -1.3 * r, 0.7 * r, -0.98 * r); g.closePath(); g.fill();
            u.ellipse(g, 0, -0.95 * r, 0.85 * r, 0.2 * r, 0, '#ffffff');
            u.circle(g, 0.85 * look * r, -1.45 * r, 0.16 * r, '#ffffff');
        }
    },
    {
        id: 'hat_horns', name: 'Devil Horns', lift: 22,
        draw(g, c) {
            const r = c.r;
            g.fillStyle = '#b71540'; g.strokeStyle = '#6d0a24'; g.lineWidth = 1.5;
            for (const s of [-1, 1]) {
                g.beginPath(); g.moveTo(s * 0.5 * r, -0.95 * r); g.quadraticCurveTo(s * 1.05 * r, -1.0 * r, s * 0.95 * r, -1.9 * r);
                g.quadraticCurveTo(s * 0.85 * r, -1.35 * r, s * 0.35 * r, -1.1 * r); g.closePath(); g.fill(); g.stroke();
            }
        }
    }
]);
