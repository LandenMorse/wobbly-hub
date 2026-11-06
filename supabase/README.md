# Supabase setup for online rooms

Rooms use **Supabase Auth (anonymous sign-ins)** and **private Realtime channels**, so every message has a verified sender.

## One-time steps (dashboard / live project)

1. **Authentication → Sign In / Providers → Allow anonymous sign-ins: on.** (Consider CAPTCHA to limit abuse.)
2. Apply the migrations in `supabase/migrations/` in order (SQL editor, `supabase db push`, or the Supabase MCP `apply_migration`):
   - `20261104000000_realtime_rooms.sql`: `public.rooms` table and the RLS policies on `realtime.messages`.
   - `20261106000000_hub_realtime.sql`: RLS for the hub's `hub:` topics.
   - `20261104000100_rooms_cleanup_cron.sql`: optional; expires rooms older than 6 hours (needs `pg_cron`).
   - `20261107000000_accounts_queue_elo.sql`: accounts, matchmaking and Elo (below).
   - `20261108000000_queue_vs_bots.sql`: the 2v2 vs bots queue (`join_queue(game, 2, true)`: both players on team 1, bots fill the other seats in the game; `report_result` closes it without rating changes).
3. **Realtime settings → Allow public access: off**, so only private, authorised channels work.

## Channel layout

| Topic | Read | Write |
| --- | --- | --- |
| `ws:<CODE>:host` | anyone, if the room exists (broadcast + presence) | broadcast: the room host only (`rooms.host_id`); presence: anyone |
| `ws:<CODE>:g:<uid>` | that guest and the host | that guest only |
| `hub:<world>` | anyone signed in (broadcast + presence) | presence: anyone signed in; no broadcast |
| `hub:<world>:u:<uid>` | anyone signed in (broadcast) | that user only |

`<world>` must match `^[a-z0-9-]{1,16}$` (`20261106000000_hub_realtime.sql`).

Matches go peer to peer when they can: each guest sends a WebRTC offer (`rtc`) on its `g:<uid>` line and the host answers (`rtc`, with `to: <uid>`) on `ws:<CODE>:host`. Snapshots and inputs then travel over the data channel and do not touch Realtime; the topics above carry the lobby, the signalling, and the match for any guest whose data channel did not open (see `shared/net.js`). This matters on the Free plan, which allows 100 Realtime messages per second for the whole project, counting every recipient of a broadcast.

The host listens on one `g:<uid>` topic per guest, so the sender of every input is the topic's `<uid>` (the JWT subject), not a field in the payload. Guests trust `lobby`/`start`/`snap` because only the host can publish them.

## Accounts, matchmaking and Elo (`20261107000000_accounts_queue_elo.sql`)

| Table | Read | Write |
| --- | --- | --- |
| `profiles` (username, cosmetics look) | anyone signed in | the owner, only `username` and `cosmetics` (shape and size checked) |
| `ratings` (elo, wins, losses per game) | anyone signed in | nobody; only `report_result` |
| `queue` | nobody | nobody; only the functions |
| `matches` (room code, host, players with teams, status) | its players (in the `supabase_realtime` publication, so waiting players learn their match) | nobody |

Functions (security definer, signed-in users only): `join_queue(game, size)` returns the new match (or null while waiting; size 2 or 4; 2v2 teams are balanced by Elo; creates the `rooms` row, the oldest waiting player hosts), `leave_queue()`, `report_result(match, winner)` (host only, once; Elo K=32 on team averages, closes the room). Stale queue rows (10 min) and unreported matches (a match counts as live for 15 minutes, `wobbly_match_ttl()`; closed without rating changes) are cleaned by the `wobbly-expire-queue` cron job (installed only where `pg_cron` exists).

## Tests

`supabase/tests/accounts_queue_elo_test.sql` covers the above the same way (`psql -v ON_ERROR_STOP=1 -f ...` on a scratch database); then `supabase/tests/join_queue_race.sh` (two real sessions) checks that nobody is matched twice.

`supabase/tests/realtime_rls_test.sql` checks the policies against a stubbed `realtime` schema on a scratch Postgres (it passed locally). It does not prove the hosted Realtime service honours them, so run a live two-browser test after applying the migrations.
