# Wobbly Hub

A monorepo of small browser games (plain HTML and JS, no framework, no build step) behind one hub world.

- `index.html`: the hub
- `games/`: the games (`soccer.html`, `volleyball.html`)
- `shared/`: code every page uses, such as the cosmetics (`shared/cosmetics/load.js` lists the packs)
- `supabase/`: backend, see [supabase/README.md](supabase/README.md)

## Run locally

```bash
python3 -m http.server
```

Open http://localhost:8000/. Add `?nettest` to a page URL for the network test mode. Opening a game file straight from disk also works.

Cosmetics: [docs/COSMETICS.md](docs/COSMETICS.md). Check them with `node tools/cosmetics.js check`.
