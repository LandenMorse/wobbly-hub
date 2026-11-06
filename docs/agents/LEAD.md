# Cosmetics lead handbook

You lead one slice of the 450 new cosmetics. You plan themes, hand small batches to item-writer helpers, check and review their work, and send back anything that is not good enough. Everything you need is in this file and `docs/COSMETICS.md` (the full item reference). **Do not read or search the game code**; you will not need it.

## Your slice

| Lead | Categories | New items | File names you own | Id prefix rule |
|---|---|---|---|---|
| A | skin | 120 | `shared/cosmetics/packs/skin-a-<theme>.js` | ids start with your theme word, e.g. `galaxy_`, `fruit_` |
| B | hat | 120 | `shared/cosmetics/packs/hat-b-<theme>.js` | same |
| C | boots 50, acc 70 | 120 | `shared/cosmetics/packs/boots-c-<theme>.js`, `shared/cosmetics/packs/acc-c-<theme>.js` | same |
| D | ball 70, arena 20 | 90 | `shared/cosmetics/packs/ball-d-<theme>.js`, `shared/cosmetics/packs/arena-d-<theme>.js` | same |

Each lead owns whole categories, so ids can never collide across leads. Within your slice, give every pack a different theme word and use it as the id prefix.

Existing ids you must not reuse (the originals):
- skin: classic, gold, galaxy, tiger, ninja, robot, slime, magma, jersey_hoops, jersey_brazil, jersey_pinstripe, jersey_sash, jersey_checker, jersey_retro, jersey_tuxedo, jersey_hawaiian, jersey_rainbow, jersey_camo
- hat: none, crown, cap, party, viking, tophat, halo, hat_beanie, hat_fedora, hat_bunny, hat_headband, hat_wizard, hat_pirate, hat_propeller, hat_flower, hat_santa, hat_horns
- boots: none, cleats, sneaks, rain, rocket, gold
- acc: none, shades, mustache, bowtie, scarf, medal
- ball: classic, beach, fire, neon, eight, ball_ice, ball_galaxy, ball_candy, ball_melon, ball_retro, ball_disco, ball_bubble, ball_gold, ball_rainbow, ball_pixel
- arena: night, sunset, neon, beach

## Setup (once)

```bash
cd <repo>
git fetch origin claude/project-thread-l9kk3u
git checkout -b cosmetics-lead-<a|b|c|d> origin/claude/project-thread-l9kk3u
node tools/cosmetics.js check        # must print OK before you start
```

Node 18+ is required. `check` and `sheet` use Playwright with Chromium if available; without it, `check` still validates the schema (`--static`) but cannot measure drawing, so prefer an environment with Playwright.

## The loop for each batch

1. **Plan** a theme and 8 to 12 item ideas (names, one-line looks, rarity). Keep about 60% common, 25% rare, 12% epic, 3% legendary. Ideas must be distinct from each other and from the originals.
2. **Create the file:** `node tools/cosmetics.js new <category> <lead-letter>-<theme>` (for example `new hat b-western`). This writes `shared/cosmetics/packs/hat-b-western.js` with one example item.
3. **Delegate** writing the items to a helper using `docs/agents/ITEM_WRITER.md`. Fill in its blanks completely (file path, pack name, category, theme, prefix, item list) and paste the matching category cheat sheet from that file. Ask for one file, 8 to 12 items. Do not give the helper this handbook or ask it to run tools, read other files, or think about the game; its only job is the items.
4. **Check:** `node tools/cosmetics.js check --pack <category>-<lead>-<theme>`. It must print `OK` with 0 errors. Read every warning.
5. **Look:** `node tools/cosmetics.js sheet <category> --pack <category>-<lead>-<theme> --out /tmp/sheet.png` and view the PNG. (Arenas have no sheet; judge them from their colours.)
6. **Review** against the checklist below. If anything fails, send the helper the exact check output lines and/or a precise description of what to fix per item id ("`western_stetson`: brim floats above the head, move it down to y = -1.0r"), and repeat from step 4. Give up on an item after two failed rounds and either fix it yourself or drop it and replace the idea.
7. **Commit** only your pack file and the line `new` added to `shared/cosmetics/load.js`: `git add shared/cosmetics/packs/<file>.js shared/cosmetics/load.js && git commit -m "Add <category> pack <theme> (<n> items)"`.

Repeat until your slice is complete, then run `node tools/cosmetics.js check` (everything, not just your pack) and `node tools/cosmetics.js list` to confirm your counts.

## Review checklist

Reject an item if any of these is true:

- `check` reports an error for it.
- It is hard to read at thumbnail size (the sheet cells are roughly in-game size): muddy colours, many tiny details, or low contrast against both team colours (Blue `#00d2ff`, Red `#ff3838`).
- Hats: bottom edge not sitting on the head (around y = -0.95r to -1.2r), floating, or covering the eyes (eyes are at y = -0.4r).
- Accessories: covering the eyes unless it is eyewear, or floating off the body.
- Boots: not at the feet (y about 1.5r to 1.95r), or the two feet look different by accident.
- Skins: a near copy of another skin in the game (a different colour of the same pattern is only fine inside a deliberate colourway set, at most 3 per set).
- Balls: hard to see against grass, sand, night and neon backgrounds, or a trail colour that clashes with the ball.
- Directional details (visors, feathers, tails) do not use `c.look`, so they would face the wrong way for the Red team.
- Uses `anim: true` for something that barely moves. Animation is for showpieces (rare and above).
- Name longer than 18 characters, not fun, or duplicates another name.

## Things to avoid

- Do not edit `shared/cosmetics/registry.js`, `tools/cosmetics.js`, `docs/`, any `*-base.js`, or another lead's files.
- Do not edit `shared/cosmetics/load.js` by hand; `new` adds your pack. If it conflicts in a merge, keep every pack line from both sides.
- Do not rename an id once it has been committed.
- Do not use `Math.random`, `Date.now`, images, fonts or the DOM in items.

## Handing in

Push your branch (`git push -u origin cosmetics-lead-<letter>`) and report: the branch name, the count per category from `node tools/cosmetics.js list`, the pack files you added, and the final line of `node tools/cosmetics.js check`.

Merging (done once, by whoever merges the four branches): merge each lead branch into the framework branch, run `node tools/cosmetics.js check`, and push.
