# Item writer brief (template for leads)

Leads: copy everything below the line into the helper's task, fill every `<...>` blank, and paste in exactly one category cheat sheet from the bottom of this file. The helper needs nothing else.

---

You are drawing cosmetic items for a 2D cartoon soccer game. **Your only job is to write the items described below into one file.** Do not read other files, explore the project, run commands, or change anything else. Do not explain your work; just write the file.

**File to write (replace its whole contents):** `<shared/cosmetics/packs/hat-b-western.js>`
**Pack:** `<hat-b-western>`  **Category:** `<hat>`  **Theme:** `<western>`
**Every id must start with:** `<western_>` and be lowercase letters, digits and underscores, at most 32 characters.

**Items to make:**
<one line per item, for example:
1. western_stetson · "Stetson" · common · brown cowboy hat with a team-colour band
2. western_sheriff · "Sheriff" · rare · black hat with a gold star on the front
...>

Write the file in exactly this shape:

```js
Cosmetics.define({ pack: '<pack>', category: '<category>', author: 'helper' }, (u) => [
    {
        id: '<prefix_name>', name: '<Name>', rarity: '<common|rare|epic|legendary>', tags: ['<word>', '<word>'],
        // fields for this category, see the cheat sheet
    },
    // one object per item, in the order listed
]);
```

Drawing rules (all items):

- You draw on an HTML canvas. `g` is the 2D context. `c.r` is the size unit (32 px on a player). Write every size and position as a multiple of `r` (`const r = c.r;` then `0.4 * r`). The origin is the centre of the player or ball. **y goes down**, so "above" means more negative y.
- Use the helpers on `u` (listed below) or plain canvas calls. Colours are CSS strings like `'#8d6e63'` or `'rgba(0,0,0,0.25)'`.
- `c.team` is the player's team colour; use it when the item should match the team. `c.look` is `1` (facing right) or `-1` (facing left); multiply the x of anything that points one way (a visor, a feather) by `c.look`.
- Never use `Math.random`, `Date.now`, images, text fonts other than plain sans-serif, or anything outside the drawing function. For scattered details, use `const rnd = u.rng(5);` and call `rnd()`.
- Only add `anim: true` if the drawing uses `c.t` (time in ms) to move. Keep animated items simple. Only animate items marked rare or above, and only if the item list says so.
- Bold, simple shapes with strong colours. The item is seen at about 60 to 80 pixels tall, so skip tiny details.
- Stay inside the area given in the cheat sheet.
- `name` is at most 18 characters.

Helpers (`x`, `y` and sizes in pixels; pass `null` to skip a fill or stroke):

- `u.circle(g, x, y, radius, fill, stroke, lineWidth)`
- `u.ellipse(g, x, y, radiusX, radiusY, rotation, fill, stroke, lineWidth)`
- `u.rect(g, x, y, width, height, fill, stroke, lineWidth)`
- `u.poly(g, [[x, y], [x, y], ...], fill, stroke, lineWidth)` closed shape
- `u.line(g, [[x, y], [x, y], ...], stroke, lineWidth, cap)` open line
- `u.star(g, x, y, outerRadius, innerRadius, points, fill, stroke, lineWidth)`
- `u.linear(g, x0, y0, x1, y1, ['#a', '#b'])` and `u.radial(g, x0, y0, r0, x1, y1, r1, ['#a', '#b'])` return gradients to use as a fill
- `u.rng(seed)` returns a function giving repeatable numbers from 0 to 1

<PASTE ONE CHEAT SHEET HERE>

---

## Cheat sheet: skin

The player's whole body (a rounded capsule from y = -1.3r at the top of the head to y = 1.7r at the bottom, x from -r to r). The eyes are added by the game at y = -0.4r. Your drawing is automatically clipped to the body and shaded.

Fields: `fill` (base colour, or `(g, c) => u.linear(...)` for a gradient), optional `pattern`, optional `draw(g, c)` for extra detail on the body, optional `extras(g, c)` for things that stick out of the body (ears, tails, spikes; keep within x -2.4r..2.4r, y -2.6r..2.1r).

`pattern` is a quick decoration: `['hoops', colour]`, `['stripes', colour]`, `['band', colour, y, thickness]`, `['collar', colour]`, `['sash', colour]`, `['checker', colour, size]`, `['dots', colour, size, gap]`, `['bands', [colours]]` (vertical), `['rows', [colours]]` (horizontal), `['blobs', [colours], count, seed]`, `['belly', colour]`, `['gradient', [colours]]`. Use a list for several: `[['band', '#fff'], ['collar', '#000']]`.

```js
{ id: 'fruit_lime', name: 'Lime', rarity: 'common', tags: ['fruit', 'green'], fill: '#a3e635', pattern: [['dots', '#ecfccb', 0.1, 0.45], ['collar', '#3f6212']] },
{
    id: 'fruit_dragon', name: 'Dragonfruit', rarity: 'rare', tags: ['fruit', 'pink'],
    fill: (g, c) => u.linear(g, 0, -c.r * 1.3, 0, c.r * 1.7, ['#ff4fa3', '#c2185b']),
    draw(g, c) {
        const r = c.r, rnd = u.rng(3);
        for (let i = 0; i < 14; i++) u.ellipse(g, (rnd() * 1.8 - 0.9) * r, (rnd() * 2.6 - 1.0) * r, 0.05 * r, 0.09 * r, 0, '#1b1b1b');
    },
    extras(g, c) { const r = c.r; for (const s of [-1, 1]) u.poly(g, [[s * 0.9 * r, -0.2 * r], [s * 1.35 * r, -0.5 * r], [s * 0.95 * r, 0.2 * r]], '#7cb342'); }
},
```

## Cheat sheet: hat

Drawn on top of the head. The top of the head is at y = -1.3r; a hat's bottom edge usually sits between y = -0.95r and y = -1.2r. The eyes are at y = -0.4r: do not cover them. Stay within x -1.8r..1.8r and y -3.2r..0.6r.

Fields: `draw(g, c)` (required). Optional `clearTop: true` only for things like halos or headbands that leave the top of the head showing.

```js
{
    id: 'western_stetson', name: 'Stetson', rarity: 'common', tags: ['western', 'brown'],
    draw(g, c) {
        const r = c.r;
        u.ellipse(g, 0, -1.0 * r, 1.25 * r, 0.22 * r, 0, '#8d6e63');      // brim
        u.rect(g, -0.55 * r, -1.75 * r, 1.1 * r, 0.75 * r, '#a1887f');     // crown
        u.rect(g, -0.55 * r, -1.12 * r, 1.1 * r, 0.12 * r, c.team);        // band
    }
},
{
    id: 'western_feather', name: 'Feather Cap', rarity: 'rare', tags: ['western'],
    draw(g, c) {
        const r = c.r;
        u.ellipse(g, 0, -1.1 * r, 0.9 * r, 0.45 * r, 0, '#5d4037');
        u.ellipse(g, -0.5 * c.look * r, -1.6 * r, 0.12 * r, 0.5 * r, -0.5 * c.look, '#e53935');   // feather points backwards
    }
},
```

## Cheat sheet: boots

Drawn once per foot. Feet are centred at x = -0.45r and x = 0.45r, y about 1.72r. The default boot is an oval with a sole strip. Stay within x -1.2r..1.2r and y 1.2r..2.7r.

Fields: `colors: [bodyColour, soleColour]` (usually all you need), optional `over(g, c, x)` to draw on top of each boot (x is that foot's centre), optional `under(g, c, x)` to draw behind each boot (flames, glow).

```js
{ id: 'candy_mint', name: 'Mint Kicks', rarity: 'common', tags: ['candy'], colors: ['#a7f3d0', '#065f46'] },
{
    id: 'candy_cane', name: 'Candy Canes', rarity: 'rare', tags: ['candy'], colors: ['#ffffff', '#b91c1c'],
    over(g, c, x) { const r = c.r; for (const dx of [-0.2, 0, 0.2]) u.line(g, [[x + (dx - 0.06) * r, 1.6 * r], [x + (dx + 0.06) * r, 1.85 * r]], '#dc2626', 0.07 * r); }
},
```

## Cheat sheet: acc (accessory)

Drawn last, over the face and body. Eyes are at y = -0.4r and x = ±0.4r (`u.eyes(c)` gives `{ x, y, other }`: `x` is the eye on the side the player faces). Mouth area is about y = 0.1r, chest about y = 0.9r. Stay within x -1.7r..1.7r and y -1.5r..2.0r. Only eyewear may cover the eyes.

Fields: `draw(g, c)` (required).

```js
{
    id: 'party_monocle', name: 'Monocle', rarity: 'rare', tags: ['fancy'],
    draw(g, c) { const e = u.eyes(c); u.circle(g, e.x, e.y, 11, null, '#d4af37', 2.5); u.line(g, [[e.x, e.y + 11], [e.x + 4 * c.look, 0.6 * c.r]], '#d4af37', 1.5); }
},
{ id: 'party_necklace', name: 'Bead Necklace', rarity: 'common', tags: ['party'], draw(g, c) { const r = c.r; for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + i * 0.117); u.circle(g, Math.cos(a) * 0.75 * r, 0.25 * r + Math.sin(a) * 0.55 * r, 0.09 * r, ['#f43f5e', '#facc15', '#22d3ee'][i % 3]); } } },
```

## Cheat sheet: ball

A circle of radius `c.r` around the origin; the game spins it. Stay within x and y -1.25r..1.25r.

Fields: either `draw(g, c)`, or the quick form `fill` + `pattern` (same patterns as skins, clipped to the ball) + optional `outline` colour. Also `trail: 'r,g,b'` (motion trail colour, numbers 0 to 255), optional `goal: [colours]` (confetti when it scores), optional `fx`: `'sparkle'`, `'smoke'` or `'fire'` (rare and above only).

```js
{ id: 'sport_tennis', name: 'Tennis', rarity: 'common', tags: ['sport'], fill: '#d9f99d', pattern: ['hoops', '#ffffff', 0.9, 0.08], trail: '217,249,157', goal: ['#d9f99d', '#ffffff'] },
{
    id: 'sport_planet', name: 'Ringed Planet', rarity: 'epic', tags: ['space'], trail: '255,183,77', goal: ['#ffb74d', '#ffe0b2', '#6d4c41'], fx: 'sparkle',
    draw(g, c) {
        const r = c.r;
        u.circle(g, 0, 0, r, u.radial(g, -0.3 * r, -0.3 * r, 1, 0, 0, r, ['#ffe0b2', '#ffb74d', '#8d6e63']));
        u.ellipse(g, 0, 0, 1.2 * r, 0.3 * r, -0.3, null, '#fff3e0', 2);
    }
},
```

## Cheat sheet: arena

No drawing, only colours. Fields: `sky` (list of colours from top to bottom), `ground` (`'grass'`, `'neon'` or `'sand'`), `grass` (two stripe colours, only for grass), `line` (pitch line colour), `net` (goal net colour, usually semi-transparent), `post` (goal post colour). Do not add `rarity` above `rare` for arenas.

```js
{ id: 'space_moonbase', name: 'Moon Base', rarity: 'rare', tags: ['space'], sky: ['#020617', '#1e1b4b', '#312e81'], ground: 'neon', line: '#a5b4fc', net: 'rgba(165,180,252,0.25)', post: '#e0e7ff' },
{ id: 'space_meadow', name: 'Alien Meadow', rarity: 'common', tags: ['space'], sky: ['#164e63', '#22d3ee'], ground: 'grass', grass: ['#7c3aed', '#6d28d9'], line: 'rgba(255,255,255,0.35)', net: 'rgba(255,255,255,0.2)', post: '#f5f3ff' },
```
