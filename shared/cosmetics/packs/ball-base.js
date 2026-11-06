// Base balls (the originals).
// trail: "r,g,b" of the motion trail. goal: confetti colours when it scores.
// fx: a preset ('fire', 'sparkle', 'smoke') or an emitter object.
Cosmetics.define({ pack: 'ball-base', category: 'ball', author: 'core' }, (u) => [
    {
        id: 'classic', name: 'Classic', trail: '255,255,255',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff');
            g.strokeStyle = '#2c3e50'; g.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                g.beginPath(); g.arc(0, 0, r, (i * Math.PI) / 2.5, ((i + 0.5) * Math.PI) / 2.5); g.lineTo(0, 0); g.stroke();
            }
        }
    },
    {
        id: 'beach', name: 'Beach', trail: '255,209,102',
        draw(g, c) {
            const r = c.r, cols = ['#ff5252', '#ffffff', '#ffd740', '#ffffff', '#40c4ff', '#ffffff'];
            for (let i = 0; i < 6; i++) { g.fillStyle = cols[i]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, (i * Math.PI) / 3, ((i + 1) * Math.PI) / 3); g.closePath(); g.fill(); }
            u.circle(g, 0, 0, r * 0.25, '#fff');
            u.circle(g, 0, 0, r, null, 'rgba(0,0,0,0.2)', 1.5);
        }
    },
    {
        id: 'fire', name: 'Fireball', trail: '255,120,40', fx: 'fire', rarity: 'rare',
        draw(g, c) {
            const r = c.r;
            g.shadowBlur = 18; g.shadowColor = '#ff7b00';
            u.circle(g, 0, 0, r, u.radial(g, -r * 0.3, -r * 0.3, 1, 0, 0, r, ['#fff3b0', '#ffb703', '#fb5607']));
            g.shadowBlur = 0;
            g.strokeStyle = 'rgba(150,40,0,0.5)'; g.lineWidth = 2;
            for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(0, 0, r * 0.6, i * 2.1, i * 2.1 + 1); g.stroke(); }
        }
    },
    {
        id: 'neon', name: 'Neon', trail: '0,255,200',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#0d0d1a');
            g.shadowBlur = 14; g.shadowColor = '#00ffc8';
            u.circle(g, 0, 0, r - 1, null, '#00ffc8', 2.5);
            const pts = [];
            for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; pts.push([Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45]); }
            u.poly(g, pts, null, '#00ffc8', 2.5);
        }
    },
    {
        id: 'eight', name: '8-Ball', trail: '180,180,200',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#111');
            u.circle(g, 0, 0, r * 0.5, '#fff');
            g.fillStyle = '#111'; g.font = `bold ${Math.round(r * 0.75)}px Segoe UI, Roboto, sans-serif`;
            g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('8', 0, 1);
            u.ellipse(g, -r * 0.4, -r * 0.5, r * 0.25, r * 0.12, -0.6, 'rgba(255,255,255,0.25)');
        }
    },
    {
        id: 'ball_ice', name: 'Ice', trail: '170,235,255', goal: ['#a8e6ff', '#ffffff', '#5bc0eb'], fx: 'sparkle',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -r * 0.3, -r * 0.35, 1, 0, 0, r, [[0, '#ffffff'], [0.6, '#bfe9ff'], [1, '#5bc0eb']]));
            for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; u.line(g, [[0, 0], [Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9]], 'rgba(255,255,255,0.8)', 1.5, 'butt'); }
            u.circle(g, 0, 0, r, null, 'rgba(40,120,170,0.5)', 1.5);
        }
    },
    {
        id: 'ball_galaxy', name: 'Starfield', trail: '160,90,255', goal: ['#a078ff', '#ffffff', '#3d1d7a'], fx: 'sparkle', rarity: 'rare',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -r * 0.3, -r * 0.3, 1, 0, 0, r, ['#6a4cc4', '#14063a']));
            for (const [sx, sy, sr] of [[-0.4, -0.2, 1.6], [0.3, -0.5, 1.2], [0.1, 0.4, 1.8], [-0.5, 0.45, 1.1], [0.55, 0.15, 1.4], [0, -0.1, 1]]) u.circle(g, sx * r, sy * r, sr, '#ffffff');
            u.circle(g, 0, 0, r - 1, null, 'rgba(200,170,255,0.5)', 1.5);
        }
    },
    {
        id: 'ball_candy', name: 'Candy', trail: '255,120,200', goal: ['#ff78c8', '#ffffff', '#ffd1ec'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffffff');
            g.fillStyle = '#ff5fa2';
            for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 4); g.closePath(); g.fill(); }
            u.circle(g, 0, 0, r, null, 'rgba(120,20,70,0.35)', 1.5);
        }
    },
    {
        id: 'ball_melon', name: 'Watermelon', trail: '255,80,110', goal: ['#3ddc84', '#ff5068', '#1b1b1b'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#2e9e4f');
            u.circle(g, 0, 0, r * 0.82, '#e8ffe0');
            u.circle(g, 0, 0, r * 0.74, '#ff4d5e');
            for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 + 0.2, d = r * 0.42; u.ellipse(g, Math.cos(a) * d, Math.sin(a) * d, 1.8, 3.2, a, '#1b1b1b'); }
        }
    },
    {
        id: 'ball_retro', name: 'Retro', trail: '255,160,0', goal: ['#ff9f1c', '#ffbf69', '#2b2118'], fx: 'smoke',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#ffbf69');
            g.fillStyle = '#2b2118';
            for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, i * 2.09 + 0.3, i * 2.09 + 0.9); g.closePath(); g.fill(); }
            u.circle(g, 0, 0, r, null, 'rgba(0,0,0,0.3)', 1.5);
        }
    },
    {
        id: 'ball_disco', name: 'Disco', trail: '220,220,255', goal: ['#ffffff', '#c0c0ff', '#ff6fd8', '#6fe7ff'], fx: 'sparkle', rarity: 'epic',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#c9c9dc');
            for (const [tx, ty, col] of [[-0.45, -0.2, '#ffffff'], [0.2, -0.45, '#9fd8ff'], [0.4, 0.2, '#ffffff'], [-0.2, 0.4, '#ff9ee6'], [-0.5, 0.5, '#9fd8ff']]) {
                g.fillStyle = col; g.fillRect(tx * r - r * 0.18, ty * r - r * 0.18, r * 0.36, r * 0.36);
            }
            u.ellipse(g, -r * 0.35, -r * 0.5, r * 0.22, r * 0.1, -0.6, 'rgba(255,255,255,0.7)');
            u.circle(g, 0, 0, r, null, 'rgba(40,40,70,0.4)', 1.5);
        }
    },
    {
        id: 'ball_bubble', name: 'Bubble', trail: '120,200,255', goal: ['#9ad8ff', '#e8f7ff', '#4aa8e8'],
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -r * 0.35, -r * 0.35, 1, 0, 0, r, ['rgba(255,255,255,0.95)', 'rgba(120,200,255,0.45)', 'rgba(60,150,230,0.6)']));
            u.circle(g, 0, 0, r - 0.5, null, 'rgba(40,120,200,0.6)', 1.5);
            u.ellipse(g, -r * 0.4, -r * 0.45, r * 0.22, r * 0.12, -0.7, 'rgba(255,255,255,0.9)');
        }
    },
    {
        id: 'ball_gold', name: 'Solid Gold', trail: '255,215,0', goal: ['#ffd700', '#fff3a3', '#b8860b'], fx: 'sparkle', rarity: 'legendary',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, u.radial(g, -r * 0.3, -r * 0.3, 1, 0, 0, r, ['#fff8c4', '#ffd700', '#b8860b']));
            for (const k of [0.65, 0.3, 1]) u.circle(g, 0, 0, r * k, null, 'rgba(120,80,0,0.55)', 1.5);
        }
    },
    {
        id: 'ball_rainbow', name: 'Rainbow', trail: '255,100,255', goal: ['#ff4d4d', '#ffd23f', '#3ddc84', '#4cc9f0', '#b185ff'],
        draw(g, c) {
            const r = c.r, cols = ['#ff4d4d', '#ffd23f', '#3ddc84', '#4cc9f0', '#b185ff', '#ff6fd8'];
            for (let i = 0; i < 6; i++) { g.fillStyle = cols[i]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, (i * Math.PI) / 3, ((i + 1) * Math.PI) / 3); g.closePath(); g.fill(); }
            u.circle(g, 0, 0, r * 0.22, '#ffffff');
            u.circle(g, 0, 0, r, null, 'rgba(0,0,0,0.25)', 1.5);
        }
    },
    {
        id: 'ball_pixel', name: 'Pixel', trail: '120,255,120', goal: ['#78ff78', '#ffffff', '#000000'], fx: 'smoke',
        draw(g, c) {
            const r = c.r;
            u.circle(g, 0, 0, r, '#1d3b2a');
            u.clipDisc(g, c, () => {
                const px = Math.max(3, r * 0.42);
                g.fillStyle = '#78ff78';
                for (let y = -r; y < r; y += px) for (let x = -r; x < r; x += px) if (((Math.floor(x / px) + Math.floor(y / px)) & 1) === 0) g.fillRect(x, y, px, px);
            });
            u.circle(g, 0, 0, r - 1, null, '#000', 2);
        }
    }
]);
