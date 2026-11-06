// Base emotes: pictures a player sends in a match and in the hub lobby. Guide: docs/COSMETICS.md
// Drawn around the origin at radius c.r, inside [-1.25r, 1.25r] on both axes. c.t drives the animated ones.
Cosmetics.define({ pack: 'emote-base', category: 'emote', author: 'core' }, (u) => {
    const OUT = 'rgba(0,0,0,0.38)', SKIN = '#f6c445', SKIN_SHADE = '#e0a82a', FACE = '#ffd54a';
    // Rounded rectangle with a fill and an outline (u has no rounded rect)
    const rr = (g, x, y, w, h, rad, fill, stroke, lw) => {
        const k = Math.min(rad, w / 2, h / 2);
        g.beginPath();
        g.moveTo(x + k, y); g.lineTo(x + w - k, y); g.arcTo(x + w, y, x + w, y + k, k);
        g.lineTo(x + w, y + h - k); g.arcTo(x + w, y + h, x + w - k, y + h, k);
        g.lineTo(x + k, y + h); g.arcTo(x, y + h, x, y + h - k, k);
        g.lineTo(x, y + k); g.arcTo(x, y, x + k, y, k);
        g.closePath();
        if (fill) { g.fillStyle = fill; g.fill(); }
        if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 2; g.stroke(); }
    };
    // A round yellow face with two eyes; the caller adds the mouth and brows
    const face = (g, r, fill) => {
        u.circle(g, 0, 0, 0.95 * r, fill || FACE, OUT, 2);
        u.circle(g, -0.32 * r, -0.2 * r, 0.1 * r, '#3a2a10');
        u.circle(g, 0.32 * r, -0.2 * r, 0.1 * r, '#3a2a10');
    };
    return [
        {
            id: 'wave', name: 'Wave', rarity: 'common', tags: ['hello', 'hi', 'greeting'], anim: true,
            draw(g, c) {   // an open hand that waves
                const r = c.r, a = Math.sin(c.t * 0.012) * 0.28;
                g.save(); g.translate(0, 0.9 * r); g.rotate(a); g.translate(0, -0.9 * r);
                rr(g, -0.5 * r, -0.2 * r, 1.0 * r, 1.05 * r, 0.3 * r, SKIN, OUT, 2);                       // palm
                [[-0.42, -0.85, 0.2], [-0.15, -1.05, 0.2], [0.12, -1.0, 0.2], [0.38, -0.82, 0.18]].forEach(([fx, fy, w]) => rr(g, fx * r, fy * r, w * r, 0.85 * r, 0.1 * r, SKIN, OUT, 2));
                g.save(); g.translate(-0.55 * r, 0.35 * r); g.rotate(-0.7); rr(g, -0.1 * r, -0.45 * r, 0.24 * r, 0.6 * r, 0.1 * r, SKIN, OUT, 2); g.restore();   // thumb
                g.restore();
            }
        },
        {
            id: 'salute', name: 'Salute', rarity: 'common', tags: ['respect', 'hand', 'gg', 'hat tip'],
            draw(g, c) {   // a face with a flat hand at the brow
                const r = c.r;
                face(g, r);
                u.line(g, [[-0.5 * r, -0.5 * r], [-0.15 * r, -0.4 * r]], '#3a2a10', 0.09 * r, 'round');          // brows: the left one is level, the right one is hidden by the hand
                u.line(g, [[-0.3 * r, 0.42 * r], [0.2 * r, 0.42 * r]], '#3a2a10', 0.09 * r, 'round');           // straight, serious mouth
                // the forearm comes up from the bottom right to the temple
                u.line(g, [[1.0 * r, 1.05 * r], [0.72 * r, -0.35 * r]], OUT, 0.46 * r, 'round');
                u.line(g, [[1.0 * r, 1.05 * r], [0.72 * r, -0.35 * r]], SKIN, 0.38 * r, 'round');
                g.save(); g.translate(0.5 * r, -0.62 * r); g.rotate(-0.55);
                rr(g, -0.62 * r, -0.17 * r, 1.0 * r, 0.34 * r, 0.14 * r, SKIN, OUT, 2);                          // flat hand, fingertips at the brow
                u.line(g, [[-0.35 * r, 0.0], [0.2 * r, 0.0]], SKIN_SHADE, 0.05 * r, 'round');
                g.restore();
            }
        },
        {
            id: 'middle_finger', name: 'Middle Finger', rarity: 'rare', tags: ['rude', 'hand', 'flip', 'angry'],
            draw(g, c) {   // a fist with the middle finger up
                const r = c.r;
                rr(g, -0.5 * r, -0.25 * r, 1.0 * r, 1.05 * r, 0.28 * r, SKIN, OUT, 2);                           // fist
                for (const fx of [-0.5, 0.0, 0.25]) rr(g, fx * r, -0.4 * r, 0.25 * r, 0.52 * r, 0.11 * r, SKIN, OUT, 2);   // curled fingers: index, ring, pinky
                rr(g, -0.25 * r, -1.1 * r, 0.25 * r, 1.3 * r, 0.12 * r, SKIN, OUT, 2);                           // the finger itself
                u.line(g, [[-0.18 * r, -0.85 * r], [-0.07 * r, -0.85 * r]], SKIN_SHADE, 0.04 * r, 'round');       // knuckle crease
                u.line(g, [[-0.45 * r, 0.2 * r], [0.45 * r, 0.2 * r]], SKIN_SHADE, 0.04 * r, 'round');
                g.save(); g.translate(-0.45 * r, 0.5 * r); g.rotate(0.9); rr(g, -0.13 * r, -0.12 * r, 0.62 * r, 0.26 * r, 0.12 * r, SKIN, OUT, 2); g.restore();   // thumb across the fist
            }
        },
        {
            id: 'thumbs_up', name: 'Thumbs Up', rarity: 'common', tags: ['good', 'like', 'nice', 'ok'],
            draw(g, c) {
                const r = c.r;
                rr(g, -0.55 * r, -0.05 * r, 1.1 * r, 0.95 * r, 0.26 * r, SKIN, OUT, 2);                           // fist
                rr(g, -0.1 * r, -1.1 * r, 0.34 * r, 1.2 * r, 0.16 * r, SKIN, OUT, 2);                             // thumb
                for (const y of [0.12, 0.38, 0.64]) u.line(g, [[-0.5 * r, y * r], [-0.05 * r, y * r]], SKIN_SHADE, 0.05 * r, 'round');   // finger lines
            }
        },
        {
            id: 'thumbs_down', name: 'Thumbs Down', rarity: 'common', tags: ['bad', 'dislike', 'boo'],
            draw(g, c) {
                const r = c.r;
                g.save(); g.scale(1, -1);
                rr(g, -0.55 * r, -0.05 * r, 1.1 * r, 0.95 * r, 0.26 * r, SKIN, OUT, 2);
                rr(g, -0.1 * r, -1.1 * r, 0.34 * r, 1.2 * r, 0.16 * r, SKIN, OUT, 2);
                for (const y of [0.12, 0.38, 0.64]) u.line(g, [[-0.5 * r, y * r], [-0.05 * r, y * r]], SKIN_SHADE, 0.05 * r, 'round');
                g.restore();
            }
        },
        {
            id: 'gg', name: 'GG', rarity: 'common', tags: ['good game', 'well played', 'sport'],
            draw(g, c) {
                const r = c.r;
                rr(g, -1.1 * r, -0.65 * r, 2.2 * r, 1.3 * r, 0.4 * r, '#2ecc71', OUT, 2);
                g.fillStyle = '#ffffff'; g.font = `900 ${Math.round(r * 1.15)}px 'Segoe UI', Roboto, sans-serif`;
                g.textAlign = 'center'; g.textBaseline = 'middle';
                g.fillText('GG', 0, 0.05 * r);
            }
        },
        {
            id: 'heart', name: 'Heart', rarity: 'common', tags: ['love', 'like', 'cute'], anim: true,
            draw(g, c) {
                const r = c.r, k = 1 + (0.5 + 0.5 * Math.sin(c.t * 0.008)) * 0.12;
                g.save(); g.scale(k, k);
                g.beginPath();
                g.moveTo(0, 0.95 * r);
                g.bezierCurveTo(-1.25 * r, 0.1 * r, -0.95 * r, -0.95 * r, 0, -0.4 * r);
                g.bezierCurveTo(0.95 * r, -0.95 * r, 1.25 * r, 0.1 * r, 0, 0.95 * r);
                g.closePath();
                g.fillStyle = '#ff4d6d'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
                u.ellipse(g, -0.5 * r, -0.28 * r, 0.16 * r, 0.1 * r, -0.7, 'rgba(255,255,255,0.65)');
                g.restore();
            }
        },
        {
            id: 'laugh', name: 'LOL', rarity: 'common', tags: ['funny', 'haha', 'lol', 'joy'],
            draw(g, c) {
                const r = c.r;
                u.circle(g, 0, 0, 0.95 * r, FACE, OUT, 2);
                for (const sx of [-1, 1]) {   // squeezed-shut eyes
                    u.line(g, [[sx * 0.55 * r, -0.12 * r], [sx * 0.3 * r, -0.32 * r], [sx * 0.12 * r, -0.12 * r]], '#3a2a10', 0.09 * r, 'round');
                    u.circle(g, sx * 0.78 * r, 0.12 * r, 0.1 * r, '#5dade2');   // tears
                }
                g.beginPath(); g.moveTo(-0.55 * r, 0.12 * r); g.quadraticCurveTo(0, 0.1 * r, 0.55 * r, 0.12 * r); g.quadraticCurveTo(0.5 * r, 0.82 * r, 0, 0.82 * r); g.quadraticCurveTo(-0.5 * r, 0.82 * r, -0.55 * r, 0.12 * r); g.closePath();
                g.fillStyle = '#5b1d1d'; g.fill();
                u.ellipse(g, 0, 0.62 * r, 0.3 * r, 0.14 * r, 0, '#e8576a');
            }
        },
        {
            id: 'cry', name: 'Sad', rarity: 'common', tags: ['cry', 'tears', 'unlucky', 'sorry'],
            draw(g, c) {
                const r = c.r;
                face(g, r);
                u.line(g, [[-0.55 * r, -0.5 * r], [-0.15 * r, -0.62 * r]], '#3a2a10', 0.08 * r, 'round');
                u.line(g, [[0.55 * r, -0.5 * r], [0.15 * r, -0.62 * r]], '#3a2a10', 0.08 * r, 'round');
                g.strokeStyle = '#3a2a10'; g.lineWidth = 0.09 * r; g.lineCap = 'round';
                g.beginPath(); g.arc(0, 0.75 * r, 0.32 * r, Math.PI * 1.15, Math.PI * 1.85); g.stroke();   // frown
                u.ellipse(g, -0.36 * r, 0.12 * r, 0.1 * r, 0.24 * r, 0, '#5dade2');
                u.ellipse(g, 0.36 * r, 0.12 * r, 0.1 * r, 0.24 * r, 0, '#5dade2');
            }
        },
        {
            id: 'angry', name: 'Angry', rarity: 'common', tags: ['mad', 'rage', 'grr'],
            draw(g, c) {
                const r = c.r;
                u.circle(g, 0, 0, 0.95 * r, '#ff7a59', OUT, 2);
                u.circle(g, -0.32 * r, -0.12 * r, 0.1 * r, '#3a1a10');
                u.circle(g, 0.32 * r, -0.12 * r, 0.1 * r, '#3a1a10');
                u.line(g, [[-0.62 * r, -0.5 * r], [-0.1 * r, -0.28 * r]], '#3a1a10', 0.12 * r, 'round');   // brows slanting down to the middle
                u.line(g, [[0.62 * r, -0.5 * r], [0.1 * r, -0.28 * r]], '#3a1a10', 0.12 * r, 'round');
                g.strokeStyle = '#3a1a10'; g.lineWidth = 0.1 * r; g.lineCap = 'round';
                g.beginPath(); g.arc(0, 0.85 * r, 0.34 * r, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
            }
        },
        {
            id: 'cool', name: 'Cool', rarity: 'rare', tags: ['sunglasses', 'smooth', 'deal with it'],
            draw(g, c) {
                const r = c.r;
                u.circle(g, 0, 0, 0.95 * r, FACE, OUT, 2);
                rr(g, -0.75 * r, -0.4 * r, 0.65 * r, 0.42 * r, 0.16 * r, '#1b1b1f', null);
                rr(g, 0.1 * r, -0.4 * r, 0.65 * r, 0.42 * r, 0.16 * r, '#1b1b1f', null);
                u.line(g, [[-0.1 * r, -0.28 * r], [0.1 * r, -0.28 * r]], '#1b1b1f', 0.08 * r, 'round');
                u.line(g, [[-0.62 * r, -0.3 * r], [-0.4 * r, -0.2 * r]], 'rgba(255,255,255,0.5)', 0.06 * r, 'round');
                g.strokeStyle = '#3a2a10'; g.lineWidth = 0.09 * r; g.lineCap = 'round';
                g.beginPath(); g.arc(0, 0.25 * r, 0.42 * r, Math.PI * 0.15, Math.PI * 0.85); g.stroke();   // smirk
            }
        },
        {
            id: 'wow', name: 'Wow', rarity: 'common', tags: ['surprise', 'omg', 'shock'],
            draw(g, c) {
                const r = c.r;
                u.circle(g, 0, 0, 0.95 * r, FACE, OUT, 2);
                u.circle(g, -0.32 * r, -0.25 * r, 0.16 * r, '#ffffff', '#3a2a10', 1.5);
                u.circle(g, 0.32 * r, -0.25 * r, 0.16 * r, '#ffffff', '#3a2a10', 1.5);
                u.circle(g, -0.32 * r, -0.25 * r, 0.07 * r, '#3a2a10');
                u.circle(g, 0.32 * r, -0.25 * r, 0.07 * r, '#3a2a10');
                u.ellipse(g, 0, 0.45 * r, 0.2 * r, 0.28 * r, 0, '#5b1d1d', '#3a2a10', 1.5);
                u.line(g, [[-0.55 * r, -0.65 * r], [-0.12 * r, -0.72 * r]], '#3a2a10', 0.08 * r, 'round');
                u.line(g, [[0.55 * r, -0.65 * r], [0.12 * r, -0.72 * r]], '#3a2a10', 0.08 * r, 'round');
            }
        },
        {
            id: 'clap', name: 'Clap', rarity: 'common', tags: ['applause', 'bravo', 'well done'], anim: true,
            draw(g, c) {   // two hands that come together
                const r = c.r, gap = (0.5 + Math.sin(c.t * 0.016) * 0.5) * 0.3 * r;
                for (const s of [-1, 1]) {
                    g.save(); g.translate(s * (0.28 * r + gap), 0.1 * r); g.rotate(s * -0.45);
                    rr(g, -0.3 * r, -0.85 * r, 0.6 * r, 1.5 * r, 0.26 * r, SKIN, OUT, 2);
                    u.line(g, [[-0.1 * r, -0.6 * r], [-0.1 * r, 0.1 * r]], SKIN_SHADE, 0.04 * r, 'round');
                    u.line(g, [[0.1 * r, -0.6 * r], [0.1 * r, 0.1 * r]], SKIN_SHADE, 0.04 * r, 'round');
                    g.restore();
                }
                if (gap < 0.05 * r) for (const a of [-0.9, -0.5, 0, 0.5, 0.9]) u.line(g, [[Math.sin(a) * 0.95 * r, -Math.cos(a) * 0.75 * r - 0.1 * r], [Math.sin(a) * 1.2 * r, -Math.cos(a) * 0.98 * r - 0.1 * r]], '#f1c40f', 0.07 * r, 'round');
            }
        },
        {
            id: 'fire', name: 'On Fire', rarity: 'rare', tags: ['hot', 'streak', 'lit'], anim: true,
            draw(g, c) {
                const r = c.r, f = Math.sin(c.t * 0.02) * 0.07 * r, f2 = Math.sin(c.t * 0.031 + 1) * 0.06 * r;
                g.beginPath();
                g.moveTo(0, 1.05 * r);
                g.bezierCurveTo(-1.05 * r, 0.9 * r, -1.0 * r, -0.1 * r, -0.35 * r, -0.5 * r + f);
                g.bezierCurveTo(-0.3 * r, -0.2 * r, -0.2 * r, -0.2 * r, -0.05 * r, -1.1 * r + f2);
                g.bezierCurveTo(0.75 * r, -0.4 * r, 1.05 * r, 0.1 * r, 0.85 * r, 0.65 * r);
                g.bezierCurveTo(0.7 * r, 0.95 * r, 0.3 * r, 1.05 * r, 0, 1.05 * r);
                g.closePath();
                g.fillStyle = '#ff7a1a'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
                g.beginPath(); g.moveTo(0, 1.0 * r); g.bezierCurveTo(-0.55 * r, 0.9 * r, -0.5 * r, 0.3 * r, -0.05 * r, -0.1 * r + f2); g.bezierCurveTo(0.45 * r, 0.3 * r, 0.55 * r, 0.9 * r, 0, 1.0 * r); g.closePath();
                g.fillStyle = '#ffd23f'; g.fill();
            }
        },
        {
            id: 'sleepy', name: 'Zzz', rarity: 'common', tags: ['sleep', 'tired', 'bored', 'afk'], anim: true,
            draw(g, c) {
                const r = c.r;
                u.circle(g, -0.2 * r, 0.25 * r, 0.8 * r, FACE, OUT, 2);
                for (const sx of [-1, 1]) u.line(g, [[-0.2 * r + sx * 0.5 * r, 0.12 * r], [-0.2 * r + sx * 0.18 * r, 0.12 * r]], '#3a2a10', 0.09 * r, 'round');   // closed eyes
                u.ellipse(g, -0.2 * r, 0.62 * r, 0.14 * r, 0.1 * r, 0, '#5b1d1d');
                g.fillStyle = '#ffffff'; g.strokeStyle = OUT; g.lineWidth = 3; g.textAlign = 'center'; g.textBaseline = 'middle';
                [[0.65, -0.1, 0.55], [0.95, -0.7, 0.42]].forEach(([zx, zy, sz], i) => {
                    const bob = Math.sin(c.t * 0.004 + i * 1.6) * 0.1 * r;
                    g.font = `900 ${Math.round(sz * r * 1.4)}px 'Segoe UI', Roboto, sans-serif`;
                    g.strokeText('z', zx * r, zy * r + bob); g.fillText('z', zx * r, zy * r + bob);
                });
            }
        },
        {
            id: 'shrug', name: 'Shrug', rarity: 'common', tags: ['whatever', 'dunno', 'oops', 'idk'],
            draw(g, c) {
                const r = c.r;
                face(g, r);
                u.line(g, [[-0.28 * r, 0.5 * r], [0.28 * r, 0.42 * r]], '#3a2a10', 0.09 * r, 'round');     // wonky mouth
                u.line(g, [[-0.55 * r, -0.55 * r], [-0.15 * r, -0.5 * r]], '#3a2a10', 0.08 * r, 'round');
                u.line(g, [[0.55 * r, -0.6 * r], [0.15 * r, -0.5 * r]], '#3a2a10', 0.08 * r, 'round');
                for (const s of [-1, 1]) { g.save(); g.translate(s * 1.05 * r, 0.75 * r); g.rotate(s * 0.35); rr(g, -0.17 * r, -0.4 * r, 0.34 * r, 0.7 * r, 0.14 * r, SKIN, OUT, 2); g.restore(); }   // raised hands
            }
        },
        {
            id: 'trophy', name: 'Champion', rarity: 'epic', tags: ['win', 'winner', 'cup', 'first'],
            draw(g, c) {
                const r = c.r;
                g.strokeStyle = '#d4a017'; g.lineWidth = 0.13 * r; g.lineCap = 'round';
                g.beginPath(); g.arc(-0.78 * r, -0.2 * r, 0.3 * r, Math.PI * 0.5, Math.PI * 1.5); g.stroke();   // handles
                g.beginPath(); g.arc(0.78 * r, -0.2 * r, 0.3 * r, Math.PI * 1.5, Math.PI * 2.5); g.stroke();
                g.beginPath(); g.moveTo(-0.7 * r, -0.85 * r); g.lineTo(0.7 * r, -0.85 * r); g.quadraticCurveTo(0.7 * r, 0.45 * r, 0, 0.5 * r); g.quadraticCurveTo(-0.7 * r, 0.45 * r, -0.7 * r, -0.85 * r); g.closePath();
                g.fillStyle = '#ffd23f'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
                rr(g, -0.12 * r, 0.45 * r, 0.24 * r, 0.35 * r, 0.04 * r, '#d4a017', OUT, 1.5);
                rr(g, -0.5 * r, 0.78 * r, 1.0 * r, 0.27 * r, 0.08 * r, '#8e5a1a', OUT, 1.5);
                u.star(g, 0, -0.2 * r, 0.3 * r, 0.13 * r, 5, '#fff3b0', null);
            }
        }
    ];
});
