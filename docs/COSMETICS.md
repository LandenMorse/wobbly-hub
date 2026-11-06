# Adding cosmetics

This is the guide for anyone (person or agent) adding skins, hats, boots, accessories, balls, arenas or emotes to Wobbly Soccer. Follow it exactly: the checks enforce most of it, and reviewers enforce the rest.

## The short version

```bash
node tools/cosmetics.js new hat cowboys        # creates shared/cosmetics/packs/hat-cowboys.js and lists it in shared/cosmetics/load.js
# edit that file: add items to the array
node tools/cosmetics.js check --pack hat-cowboys   # must print OK with 0 errors
node tools/cosmetics.js sheet hat --pack hat-cowboys   # renders dist/sheet-hat-hat-cowboys.png to look at
```

Then serve the repo (`python3 -m http.server`) and open `play.html?game=soccer` in a browser and click the name in any picker (for example the hat name) to see every item in a searchable grid.

**Only ever touch your own pack file.** Do not edit `shared/cosmetics/registry.js` or other people's packs. `new` adds your pack to the list in `shared/cosmetics/load.js` (commit that with your pack); if two branches both add packs and that list conflicts in a merge, keep every line from both sides.

## How it fits together

- `shared/cosmetics/registry.js` is the engine: it validates items, stores them by id, draws them through one renderer per category, and caches static items as sprites.
- `shared/cosmetics/packs/<category>-<name>.js` are pack files. Each one calls `Cosmetics.define(...)` once with a list of items of a single category. `*-base.js` hold the original items.
- `shared/cosmetics/load.js` is the only list of pack files. Every game page (`index.html`, `games/*.html`) includes it with one `<script>` tag, and it loads the registry, then every pack, before the game script.

## A pack file

```js
// hat pack "cowboys". Guide: docs/COSMETICS.md
Cosmetics.define({ pack: 'hat-cowboys', category: 'hat', author: 'your-name' }, (u) => [
    {
        id: 'cowboy_stetson', name: 'Stetson', rarity: 'rare', tags: ['western'],
        draw(g, c) {
            const r = c.r;
            u.ellipse(g, 0, -1.0 * r, 1.25 * r, 0.22 * r, 0, '#8d6e63');          // brim
            u.rect(g, -0.55 * r, -1.75 * r, 1.1 * r, 0.75 * r, '#a1887f');         // crown
            u.rect(g, -0.55 * r, -1.12 * r, 1.1 * r, 0.12 * r, c.team);            // band in team colour
        }
    },
    // ...more items
]);
```

Rules for the file:

- File name is `<category>-<name>.js`, where category is one of `skin`, `hat`, `boots`, `acc`, `ball`, `arena`, `emote`, and name is lowercase letters, digits and dashes.
- `pack` must equal the file name without `.js`. `category` must match the file name prefix.
- The second argument is a function that receives `u` (the drawing helpers) and returns the array of items. Keep any shared constants (star positions, palettes) inside that function, never on `window`.

## Item fields (all categories)

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable id: lowercase `snake_case`, 2 to 32 characters, starts with a letter. Unique within its category. Saves and online play store this id, so **never rename or reuse an id after it has merged.** Prefix ids with your pack theme (for example `cowboy_stetson`) so parallel packs do not collide. |
| `name` | yes | Shown in the picker. 18 characters at most. Unique within the category (the check warns on duplicates). |
| `rarity` | no | `common` (default), `rare`, `epic` or `legendary`. Shown as a coloured strip in the grid. Aim for roughly 60% common, 25% rare, 12% epic, 3% legendary. |
| `tags` | no | Array of lowercase words for search, for example `['western', 'brown']`. |
| `anim` | no | `true` if the drawing changes with `c.t`. Leave it out otherwise. Static items are drawn once and cached, so they are almost free; animated items are drawn every frame. The check fails if an item changes over time without `anim: true`. |
| `bounds` | no | `[x0, y0, x1, y1]` in multiples of `r` to widen the category's box (see below). Rarely needed; prefer drawing inside the default box. |
| `hidden` | no | `true` keeps the item out of the picker (it still works if a save or another player uses it). |
| `desc` | no | One line of flavour text. |

## The drawing context

Every `draw(g, c)` style function gets the canvas 2D context `g` and a context object `c`:

- `c.r`: the radius. Players are 32 px, balls 18 px, but **always write sizes as multiples of `c.r`** (for example `0.4 * r`), because the picker draws smaller and the game zooms.
- `c.t`: time in milliseconds. Only use it with `anim: true`.
- `c.look`: `1` when the player faces right (Blue team), `-1` when facing left (Red team). Multiply x offsets of anything directional (visors, feathers, tassels) by `c.look`.
- `c.team`: the team colour (`'#00d2ff'` Blue or `'#ff3838'` Red). Use it if the item should match the team.
- `c.teamNum`: `1` or `2`.
- `c.hat`: the hat item the player is wearing (useful in skin `extras`, see Robot).

Coordinates: the origin is the centre of the actor, x to the right, **y down**. The player's body is a capsule from about `y = -1.3r` (top of head) to `y = 1.7r` (bottom), `x` from `-r` to `r`. Eyes sit at `y = -0.4r`, `x = ±0.4r`. Feet are at `x = ±0.45r`, `y ≈ 1.75r`. The ball is a circle of radius `r` around the origin.

You may set any canvas state (`fillStyle`, `lineWidth`, `globalAlpha`, `shadowBlur`, transforms, clips). The registry saves and restores around every draw, so nothing leaks.

### The box each layer must stay inside

Everything is cached as a sprite cut from this box (plus 24 px of slack for glows). Anything outside is cut off, and `check` reports it as an error.

| Category / layer | Box `[x0, y0, x1, y1]` in r |
|---|---|
| skin body (`fill`, `pattern`, `draw`) | clipped to the body automatically |
| skin `extras` | `[-2.4, -2.6, 2.4, 2.1]` |
| hat | `[-1.8, -3.2, 1.8, 0.6]` |
| boots | `[-1.2, 1.2, 1.2, 2.7]` |
| acc | `[-1.7, -1.5, 1.7, 2.0]` |
| ball | `[-1.25, -1.25, 1.25, 1.25]` |
| emote | `[-1.25, -1.25, 1.25, 1.25]` |

## Category fields

### skin

The body. Drawn as: fill, then `pattern`, then `draw` (both clipped to the body shape), then the standard shading and outline, then `extras` (not clipped).

| Field | Meaning |
|---|---|
| `fill` | A colour string, or `(g, c) => fillStyle` for a gradient. Leave out to use the team colour. |
| `pattern` | Declarative decoration: `['hoops', '#e74c3c']`, or a list: `[['band', '#1e8449'], ['collar', '#2d3436']]`. See Patterns. |
| `draw(g, c)` | Extra detail painted on the body (clipped). |
| `extras(g, c)` | Things that stick out of the body: tails, antennae, wings. Not clipped. |

Many jerseys need one line:

```js
{ id: 'jersey_lime_hoops', name: 'Lime Hoops', fill: '#a3e635', pattern: ['hoops', '#14532d', 0.5, 0.2], tags: ['jersey'] }
```

### hat

| Field | Meaning |
|---|---|
| `draw(g, c)` | Required. Draw around the top of the head, which is at `y = -1.3r`. Most hats sit between `y = -0.9r` and `y = -2.5r`. |
| `lift` | Optional. Pixels to raise the charge meter and name tag so they clear the hat. Leave it out and it is measured from your drawing. |
| `clearTop` | `true` if the hat leaves the top of the head visible (halos, headbands), which lets skins like Robot show their antenna. |

### boots

Drawn once per foot unless you provide `draw`.

| Field | Meaning |
|---|---|
| `colors` | `[body, sole]`. The default boot shape in those colours. Many boots need only this. |
| `under(g, c, x)` | Drawn behind each boot; `x` is that foot's centre (flames, trails). |
| `over(g, c, x)` | Drawn on top of each boot (laces, stripes, wings, spikes). |
| `draw(g, c)` | Replaces everything above. Draw both feet yourself at `x = ±0.45r`. |

```js
{ id: 'boot_zebra', name: 'Zebra Kicks', colors: ['#ffffff', '#111111'],
  over(g, c, x) { const r = c.r; for (const dx of [-0.18, 0, 0.18]) u.rect(g, x + dx * r, 1.56 * r, 0.06 * r, 0.3 * r, '#111111'); } }
```

### acc

Accessories are drawn last, over the face. `draw(g, c)` is required. Use `u.eyes(c)` to get eye positions (`x` is the eye nearest the facing direction, `other` the far one, `y` the height).

### ball

| Field | Meaning |
|---|---|
| `draw(g, c)` | Draw the ball around the origin, radius `c.r`. The game rotates it as it spins. |
| `fill` / `pattern` / `outline` | Declarative alternative to `draw`: a filled disc, patterns clipped to it, and an outline colour (or `false` for none). |
| `trail` | Motion trail colour as an `"r,g,b"` string, for example `'255,120,40'`. Defaults to white. |
| `goal` | Confetti colours when this ball scores, for example `['#ffd700', '#ffffff']`. |
| `fx` | Trail particles: a preset (`'fire'`, `'sparkle'`, `'smoke'`) or an emitter object `{ color, size, life, speed, gravity, drag, every, minSpeed }` where `every` is ticks between particles (default 3) and `minSpeed` the ball speed needed (default 4). Keep `every` at 2 or more unless it is a showpiece. |

### emote

A picture a player sends in a match or in the hub; it pops up in a bubble above their head for a few seconds. Players put 8 of them on the number keys (1-8, `Q` opens the picker); every emote in the registry is available, so adding one to a pack is all it takes. `draw(g, c)` is required: draw around the origin at radius `c.r` (it is shown at about 15 px), with `c.t` for `anim: true`. `c.look` and `c.team` do not apply. Keep it readable at that size: bold shapes, a dark `rgba(0,0,0,0.38)` outline, the yellow face / skin tones of `emote-base.js`. Only an id is sent over the network, so ids are as permanent as any other cosmetic id.

### arena

Data only; the game paints it.

| Field | Meaning |
|---|---|
| `sky` | Array of colours, top to bottom. |
| `ground` | `'grass'`, `'neon'` or `'sand'`. |
| `grass` | Two stripe colours, required for `'grass'`. |
| `line`, `net`, `post` | Colours of the pitch lines, goal net and goal posts. |

## Helpers (`u`)

All take the context `g` first and work in pixels (multiply by `c.r`). A `null` fill or stroke skips it.

| Helper | Does |
|---|---|
| `u.circle(g, x, y, rad, fill, stroke?, lineWidth?)` | Circle. |
| `u.ellipse(g, x, y, rx, ry, rotation, fill, stroke?, lineWidth?)` | Ellipse. |
| `u.rect(g, x, y, w, h, fill, stroke?, lineWidth?)` | Rectangle. |
| `u.poly(g, [[x, y], ...], fill, stroke?, lineWidth?)` | Closed polygon. |
| `u.line(g, [[x, y], ...], stroke, lineWidth?, cap?)` | Open polyline. |
| `u.star(g, x, y, outer, inner, points, fill, stroke?, lineWidth?, rotation?)` | Star. |
| `u.linear(g, x0, y0, x1, y1, colours)` | Returns a linear gradient. `colours` is `['#a', '#b']` (even spacing) or `[[0, '#a'], [0.4, '#b'], ...]`. |
| `u.radial(g, x0, y0, r0, x1, y1, r1, colours)` | Returns a radial gradient. |
| `u.rng(seed)` | Deterministic random generator: `const rnd = u.rng(7); rnd()` gives 0..1. Use it instead of `Math.random`. |
| `u.disc(g, c, fill, outline?, lineWidth?)` | The ball's disc. |
| `u.clipDisc(g, c, () => { ... })` | Run drawing clipped to the ball. |
| `u.boot(g, c, x, body, sole)` | One default boot at foot `x`. |
| `u.eyes(c)` | `{ x, y, other }` eye positions. |
| `u.bodyPath(g, r)` | Traces the body outline (for custom clipping or outlines). |
| `u.TAU` | `2 * Math.PI`. |

### Patterns

Used in `pattern` on skins and balls (`[name, ...args]`), or called directly as `u.patterns.name(g, c, ...args)`. Arguments after the colour are optional.

| Pattern | Arguments |
|---|---|
| `hoops` | `color, gap = 0.6, thick = 0.28` horizontal stripes |
| `stripes` | `color, gap = 0.36, thick = 0.07` vertical pinstripes |
| `band` | `color, y = 0.35, thick = 0.4` one horizontal band |
| `collar` | `color, thick = 0.2` band across the top |
| `sash` | `color, width = 0.35, dir = 1` diagonal sash (`dir = -1` flips it) |
| `checker` | `color, size = 0.4` checkerboard |
| `dots` | `color, size = 0.12, gap = 0.5` polka dots |
| `bands` | `[colours]` vertical colour bands |
| `rows` | `[colours]` horizontal colour bands |
| `blobs` | `[colours], n = 6, seed = 1` camo-style blobs |
| `belly` | `color, w = 0.55, h = 0.7, y = 0.95` belly patch |
| `gradient` | `[colours], dir = 'down' or 'across'` |

## Hard rules

1. **Deterministic.** No `Math.random()`, `Date.now()` or `performance.now()` in drawing. Use `u.rng(seed)` and `c.t`.
2. **`anim: true` only when the drawing changes with `c.t`,** and then keep it cheap: animated items must draw in under 0.6 ms (the check measures it). Static items must stay under 4 ms.
3. **Stay inside the box** for your category.
4. **Sizes in multiples of `c.r`** (small fixed pixel details such as a 1.5 px outline are fine).
5. **Mirror directional details with `c.look`.**
6. **No side effects.** No DOM, no images, no fonts other than the system font, no network, no globals, no `console.log`. Do not mutate `c` or anything outside your pack.
7. **Stable, unique ids** prefixed by theme; never rename merged ids.
8. **`check` must print `OK` with 0 errors** before you hand anything in. Fix warnings too unless there is a clear reason.

## Quality bar (what reviewers look for)

- Reads clearly at small size: the grid thumbnail is 80 px, the in-game player is 64 px tall. Bold shapes, strong contrast against both team colours, few tiny details.
- Fits the game's look: flat colours, simple gradients, a soft dark outline (`rgba(0,0,0,0.25)` style) where it helps.
- Looks right facing both ways (check both rows of the sheet if you render it with another team, or just reason about `c.look`).
- Hats sit on the head (bottom edge around `y = -0.95r` to `-1.2r`), not floating or sunk into the eyes. Accessories do not cover the eyes unless they are eyewear.
- Distinct from existing items: not a recolour of something already in the category unless it is part of a deliberate colourway set.
- Names are short, fun and unique. Tags help search.

## Checking your work

- `node tools/cosmetics.js check` validates every pack: the schema in Node, then renders every item in headless Chromium to catch drawing outside the box, `Math.random`, missing `anim`, items that draw nothing, slow draws, exceptions and console errors. `--pack <name>` filters the report to one pack; `--json` gives machine-readable output; `--static` skips the browser.
- `node tools/cosmetics.js sheet <category> [--pack <name>] [--out file.png]` renders a contact sheet for visual review.
- `node tools/cosmetics.js list` shows counts per category and pack.
- Add `?nocache` to the game URL to draw everything live (handy when debugging a cached item).
