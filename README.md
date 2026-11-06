# Wobbly Hub

A monorepo of small browser games (plain HTML and JS, no framework, no build step) behind one hub world.

- `index.html`: the hub
- `play.html?game=<id>`: the one game page; `games/index.js` lists the games, `games/<id>.js` holds a game's rules ([docs/GAMES.md](docs/GAMES.md))
- `shared/`: code every page uses: the game engine (`core.js`, `modes.js`, `render.js`, `net.js`, `main.js`) and the cosmetics (`shared/cosmetics/load.js` lists the packs)
- `shared/account.js`: the player's account (anonymous sign-in, username and look in the profile, ratings, matchmaking queue, results). The hub and every game page use it; it is the only place that knows the Supabase project
- `supabase/`: backend, see [supabase/README.md](supabase/README.md)

## Run locally

```bash
python3 -m http.server
```

Open http://localhost:8000/ (or http://localhost:8000/play.html?game=soccer). Add `?nettest` to a page URL for the network test mode. Opening a game file straight from disk also works. In `?nettest` there is no Supabase: the account is local to the tab and the ranked queue is a BroadcastChannel stand-in (no Elo), so ranked matches work between tabs of one browser. Online matches send snapshots and inputs peer to peer (WebRTC) and fall back to Supabase Realtime; add `?nortc` to a game URL to force the fallback.

Ranked play: in the hub, hold on the 1v1 or 2v2 pad of a game to queue; the match's room is made by the database, its host reports the result at the end (needs the `accounts_queue_elo` migration).

Tests: `node tools/e2e.js` (pages load, the ranked queue and match flow in `?nettest`, walkovers, the peer-to-peer link and its fallback; needs Playwright), and the SQL tests in `supabase/tests/` (see [supabase/README.md](supabase/README.md)).

Cosmetics: [docs/COSMETICS.md](docs/COSMETICS.md). Check them with `node tools/cosmetics.js check`.
