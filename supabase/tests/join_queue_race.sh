#!/usr/bin/env bash
# Two real sessions: a waiting player must not be matched twice when they call join_queue again
# while another player's join (which already matched them) has not committed yet.
# Run AFTER accounts_queue_elo_test.sql, on the same scratch database (it needs the schema; PGHOST/PGPORT/PGDATABASE as for psql).
set -euo pipefail
X=00000000-0000-0000-0000-0000000000a1; Y=00000000-0000-0000-0000-0000000000a2
as() { printf "set role authenticated; select set_config('request.jwt.claims', '{\"sub\":\"%s\"}', false);\n" "$1"; }
psql -qAt -v ON_ERROR_STOP=1 -c "insert into auth.users values ('$X'), ('$Y') on conflict do nothing"
{ as $X; echo "select public.join_queue('race', 2);"; } | psql -qAt -v ON_ERROR_STOP=1 >/dev/null     # X waits (committed)
{ as $Y; echo "begin; select (public.join_queue('race', 2)).id is not null; select pg_sleep(3); commit;"; } | psql -qAt -v ON_ERROR_STOP=1 >/dev/null &
sleep 1                                                                                           # Y has matched X but not committed
out=$({ as $X; echo "select public.join_queue('race2', 4);"; } | psql -qAt 2>&1 || true)   # X tries again from "another tab", switching game and size
wait
echo "$out" | grep -q 'already in a live match' || { echo "FAIL: second join was not refused: $out"; exit 1; }
n=$(psql -qAt -c "select count(*) from public.matches where status = 'live' and game = 'race' and players @> '[{\"id\":\"$X\"}]'")
q=$(psql -qAt -c "select count(*) from public.queue where user_id in ('$X', '$Y')")
[ "$n" = 1 ] && [ "$q" = 0 ] || { echo "FAIL: live matches for X = $n (want 1), queue rows = $q (want 0)"; exit 1; }
echo "join_queue race check passed"
