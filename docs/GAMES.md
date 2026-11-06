# Adding a game

One page (`play.html?game=<id>`) and one engine (`shared/*.js`) run every game. A game is only its rules: one file, `games/<id>.js`, that calls `Games.define({...})`. `games/soccer.js` is the worked example.

Steps: add `{ id, name, file, accent, ground }` to `games/index.js` (the hub's areas come from it; give the hub a spot for it in `AREA_LAYOUT` in `index.html`), write `games/<id>.js`, open `play.html?game=<id>`. For a game on the shared page, `file` is `play.html` (the hub adds `?game=`).

## Load order (no build step, classic scripts, works from file://)

`shared/cosmetics/load.js`, `shared/hub-link.js`, `games/index.js`, `games/<id>.js`, then `shared/modes.js`, `core.js`, `render.js`, `net.js`, `main.js`. The game file runs first and only registers itself; the engine files read it as `G` (`Games.current`). Top-level `const`/`let`/`function` in the engine are globals, so hooks can use `state`, `balls`, `players`, `CONFIG`, `emit`, `Sound`, `showBanner`, `settings`, `net`... directly. Wrap the game file in an IIFE so its helpers stay private.

## Fields (data)

| field | meaning |
| --- | --- |
| `id` | must be listed in `games/index.js` (`name`, `file`, `accent`, `ground` come from there) |
| `point` | word for a score: `'goal'` (HUD, banners, chips, mode text) |
| `subtitle`, `startLabel`, `overLabel`, `hint` | menu texts: subtitle under the title, start button, end-of-match heading, last part of the key hint line |
| `storageKey`, `netStorageKey` | localStorage keys for settings and the online name. Never change a shipped key: saves live there |
| `defaults` | settings defaults the game owns: `{ target, ball, arena }` |
| `targets` | the "first to" choices |
| `config` | overrides/extra fields on `CONFIG` (see the top of `core.js` for the physics defaults: `ballR`, `ballGravity`, `ballMaxSpeed`, `walkAccel`, `walkMax`, `airAccel`, `airMax`, `airGravity`, `apexBand`, `apexHang`, `jumpScale`, ...). Soccer adds `goalWidth`, `goalHeight` |
| `fields` | `[{ id, name, w, spawn }]` choices of world width and 1v1 start distance from the middle. Omit for one standard 1024-wide field (the Field chips then hide) |
| `modes` | ids from `shared/modes.js`, or `{ id, ...overrides }` to change one (`desc`, `balls`, ...) or add a new mode. Fields: `name, desc, kind: 'goals'\|'time'\|'none'\|'endless', gravity, balls, tag`. `{point}`/`{points}` in `desc` are replaced |
| `sounds` | extra `Sound` methods (`this.tone`, `this.noise`); they are also replayed on online guests |
| `states` | extra match states (soccer: `'DUEL'`); they count as "active" for pause and are synced online |

## Hooks (functions; all optional except where noted)

Rules
- `ballSpots(n)` (required): `[[x, y], ...]` where the `n` balls start.
- `scoredFor(ball)` (required): the team (1 or 2) that scored with this ball, or 0. Called every step; the engine does score, banner, kickoff and match end.
- `step()`: once per `PLAYING` step after goals are checked (soccer: deadlock timer). May change `state`.
- `resetRound()`: before every kickoff.
- `tickState()`: each step in `GAMEOVER` or one of `states`.
- `onJumpPress(p, repeat)`: the jump button went down; return true to swallow it (soccer: duel mashing).

The second button, `action: { name, ... }` (`name` is its label in menus and touch controls; the keys are S, ↓, G, K)
- `reset(p)`: add per-player fields (called on creation and every reset). `cancel(p)`: drop a pending action (focus lost, pause).
- `down(p)` / `up(p)`: the button went down / up. `step(p)`: each step per player. `squash(p)`: 0..1 body squash for drawing.
- `snap(p)` / `apply(p, A, i)`: extra per-player numbers for online snapshots, and how a guest reads them back (`A[i...]`).

Bots, `ai: { levels, state, busy, plan }`: the engine's `Bot` handles charging a jump and the cooldown. `levels` = skill tables `{ react, noise, blunder, charges, ... }` for easy/normal/hard; `state` = extra `Bot` fields; `busy(bot, L)` = return true while a game move is running; `plan(bot, L)` = the bot is idle on the ground: pick a plan by simulating ahead (`sim`, `copyActor`, `AI_HORIZON`, `resolveCollision`) and call `bot.start(lean, chargeFrames)` or set `bot.cooldown`.

Drawing, `draw: { field, world, screen, thumb }`
- `field(g, A, FW, GY)` (required): goals/net/lines drawn once into the arena background `g` (`A` = the arena, `GY` = ground y).
- `world()`: each frame inside the camera (meters, timers). `screen()`: each frame over everything (soccer: the duel overlay). `thumb(g, A, gy)`: the goal/net corner in the arena picker thumbnail.

Online: `snap()` returns extra fields for the host's snapshot, `applySnap(s)` restores them on guests. Rooms carry `game: id`, so a code opened in the wrong game is refused.

## Soccer in short

`games/soccer.js`: goals, the dig action (charge, release), the deadlock timer and duel (an extra state), the bot plan (scores each lean/charge/dig by simulating the real physics), the goal drawing. Everything else is shared.
