# Supabase setup for online rooms

Rooms use **Supabase Auth (anonymous sign-ins)** and **private Realtime channels**, so every message has a verified sender.

## One-time steps (dashboard / live project)

1. **Authentication → Sign In / Providers → Allow anonymous sign-ins: on.** (Consider CAPTCHA to limit abuse.)
2. Apply the migrations in `supabase/migrations/` in order (SQL editor, `supabase db push`, or the Supabase MCP `apply_migration`):
   - `20261104000000_realtime_rooms.sql`: `public.rooms` table and the RLS policies on `realtime.messages`.
   - `20261104000100_rooms_cleanup_cron.sql`: optional; expires rooms older than 6 hours (needs `pg_cron`).
3. **Realtime settings → Allow public access: off**, so only private, authorised channels work.

## Channel layout

| Topic | Read | Write |
| --- | --- | --- |
| `ws:<CODE>:host` | anyone, if the room exists (broadcast + presence) | broadcast: the room host only (`rooms.host_id`); presence: anyone |
| `ws:<CODE>:g:<uid>` | that guest and the host | that guest only |

The host listens on one `g:<uid>` topic per guest, so the sender of every input is the topic's `<uid>` (the JWT subject), not a field in the payload. Guests trust `lobby`/`start`/`snap` because only the host can publish them.

## Tests

`supabase/tests/realtime_rls_test.sql` checks the policies against a stubbed `realtime` schema on a scratch Postgres (it passed locally). It does not prove the hosted Realtime service honours them, so run a live two-browser test after applying the migrations.
