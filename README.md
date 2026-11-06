# Wobbly Hub

A monorepo of small browser games (plain HTML and JS, no framework, no build step) behind one hub world.

- `index.html`: the hub
- `play.html?game=<id>`: the one game page; `games/index.js` lists the games, `games/<id>.js` holds a game's rules ([docs/GAMES.md](docs/GAMES.md)); `games/volleyball.html` is still its own page
- `shared/`: code every page uses: the game engine (`core.js`, `modes.js`, `render.js`, `net.js`, `main.js`) and the cosmetics (`shared/cosmetics/load.js` lists the packs)
- `supabase/`: backend, see [supabase/README.md](supabase/README.md)

## Run locally

```bash
python3 -m http.server
```

Open http://localhost:8000/ (or http://localhost:8000/play.html?game=soccer). Add `?nettest` to a page URL for the network test mode. Opening a game file straight from disk also works.

Cosmetics: [docs/COSMETICS.md](docs/COSMETICS.md). Check them with `node tools/cosmetics.js check`.
