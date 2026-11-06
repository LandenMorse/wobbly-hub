-- Local check of profiles, ratings, the matchmaking queue, matches and Elo.
-- Run:  psql -v ON_ERROR_STOP=1 -f supabase/tests/accounts_queue_elo_test.sql  (on a scratch database)
-- auth.uid() is stubbed to read the JWT subject from request.jwt.claims, the way Supabase does.
create schema if not exists auth; create schema if not exists realtime;
do $$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid $$;
create function realtime.topic() returns text language sql stable as $$ select current_setting('app.topic', true) $$;
create table realtime.messages (id bigserial primary key, topic text not null, extension text not null, payload jsonb);
alter table realtime.messages enable row level security;
grant usage on schema auth, realtime to authenticated;
grant execute on function auth.uid(), realtime.topic() to authenticated;
create publication supabase_realtime;

\ir ../migrations/20261104000000_realtime_rooms.sql
\ir ../migrations/20261107000000_accounts_queue_elo.sql
\ir ../migrations/20261108000000_queue_vs_bots.sql

-- Run the next statements as this user (signed in, role authenticated); pg_temp.me(null) goes back to the superuser.
create function pg_temp.me(u uuid) returns void language plpgsql as $$
begin
  reset role;
  perform set_config('request.jwt.claims', case when u is null then '' else json_build_object('sub', u)::text end, true);
  if u is not null then set local role authenticated; end if;
end $$;
-- true when the statement fails with this SQLSTATE
create function pg_temp.fails(stmt text, state text) returns boolean language plpgsql as $$
begin
  execute stmt; return false;
exception when others then
  if sqlstate = state then return true; end if;
  raise exception 'expected % but got % (%)', state, sqlstate, sqlerrm;
end $$;
grant execute on function pg_temp.me(uuid), pg_temp.fails(text, text) to public;

do $$
declare
  u uuid[]; m public.matches; m2 public.matches; n int;
begin
  select array_agg(('00000000-0000-0000-0000-0000000000' || lpad(i::text, 2, '0'))::uuid order by i) into u from generate_series(1, 14) i;
  insert into auth.users select unnest(u);

  -- ---- profiles
  perform pg_temp.me(u[1]);
  assert pg_temp.fails($q$insert into public.profiles(id, username) values ('00000000-0000-0000-0000-000000000001', 'ab')$q$, '23514'), 'username too short';
  assert pg_temp.fails($q$insert into public.profiles(id, username) values ('00000000-0000-0000-0000-000000000001', 'seventeen_chars_xx')$q$, '23514'), 'username too long';
  assert pg_temp.fails($q$insert into public.profiles(id, username) values ('00000000-0000-0000-0000-000000000001', 'bad name!')$q$, '23514'), 'username charset';
  assert pg_temp.fails($q$insert into public.profiles(id, username, cosmetics) values ('00000000-0000-0000-0000-000000000001', 'alice_01', '{"cape":"red"}')$q$, '23514'), 'unknown cosmetics key';
  assert pg_temp.fails($q$insert into public.profiles(id, username, cosmetics) values ('00000000-0000-0000-0000-000000000001', 'alice_01', '{"hat":5}')$q$, '23514'), 'cosmetics value must be a string';
  assert pg_temp.fails($q$insert into public.profiles(id, username, cosmetics) values ('00000000-0000-0000-0000-000000000001', 'alice_01', '{"hat":"has space"}')$q$, '23514'), 'cosmetics value charset';
  assert pg_temp.fails($q$insert into public.profiles(id, username, cosmetics) values ('00000000-0000-0000-0000-000000000001', 'alice_01', '[]')$q$, '23514'), 'cosmetics must be an object';
  assert pg_temp.fails($q$insert into public.profiles(id, username) values ('00000000-0000-0000-0000-000000000002', 'mallory')$q$, '42501'), 'cannot create a profile for someone else';
  insert into public.profiles(id, username, cosmetics) values (u[1], 'Alice_01', '{"skin":"gold","hat":"hat_beanie","boots":"none","acc":"shades"}');
  perform pg_temp.me(u[2]);
  assert pg_temp.fails(format($q$insert into public.profiles(id, username) values (%L, 'alice_01')$q$, u[2]), '23505'), 'usernames are unique, case-insensitively';
  insert into public.profiles(id, username) values (u[2], 'bob');
  assert (select count(*) from public.profiles) = 2, 'everyone signed in reads profiles';
  update public.profiles set username = 'hacked' where id = u[1];
  get diagnostics n = row_count;
  assert n = 0, 'cannot update another profile';
  assert pg_temp.fails(format($q$update public.profiles set id = %L where id = %L$q$, u[3], u[2]), '42501'), 'cannot change profile id';
  update public.profiles set username = 'bobby', cosmetics = '{"hat":"crown"}' where id = u[2];
  get diagnostics n = row_count;
  assert n = 1, 'owner updates own profile';
  assert pg_temp.fails($q$delete from public.profiles$q$, '42501'), 'no deletes';

  -- ---- ratings, queue, matches are closed to direct writes
  assert pg_temp.fails(format($q$insert into public.ratings(user_id, game) values (%L, 'soccer')$q$, u[2]), '42501'), 'no client rating insert';
  assert pg_temp.fails($q$update public.ratings set elo = 3000$q$, '42501'), 'no client rating update';
  assert pg_temp.fails($q$select * from public.queue$q$, '42501'), 'queue is not readable';
  assert pg_temp.fails(format($q$insert into public.queue(user_id, game, size) values (%L, 'soccer', 2)$q$, u[2]), '42501'), 'queue is not writable';
  assert pg_temp.fails(format($q$insert into public.matches(game, size, room_code, host_id, players) values ('soccer', 2, 'ABCD', %L, '[]')$q$, u[2]), '42501'), 'matches are not writable';
  perform pg_temp.me(null);
  assert pg_temp.fails($q$select public.join_queue('soccer', 2)$q$, 'P0001'), 'no uid cannot queue';
  perform pg_temp.me(u[2]);
  assert pg_temp.fails($q$select public.join_queue('soccer', 3)$q$, 'P0001'), 'size 3 rejected';
  assert pg_temp.fails($q$select public.join_queue('Soccer!', 2)$q$, 'P0001'), 'bad game rejected';
  assert pg_temp.fails($q$select public.report_result(gen_random_uuid(), 1::smallint)$q$, 'P0001'), 'unknown match rejected';

  -- ---- two players
  perform pg_temp.me(u[1]);
  assert public.join_queue('soccer', 2) is null, 'first player waits';
  perform pg_temp.me(u[2]);
  m := public.join_queue('soccer', 2);
  assert m.id is not null and m.room_code ~ '^[A-Z]{4}$' and m.host_id = u[1] and m.status = 'live', 'second player completes the match, oldest hosts';
  assert m.players = jsonb_build_array(jsonb_build_object('id', u[1], 'team', 1), jsonb_build_object('id', u[2], 'team', 2)), '1v1 teams';
  perform pg_temp.me(null);
  assert (select count(*) from public.queue where user_id = any (u[1:2])) = 0, 'queue rows are consumed';
  assert (select host_id from public.rooms where code = m.room_code) = u[1], 'room created for the host';
  perform pg_temp.me(u[2]);
  assert (select count(*) from public.matches) = 1, 'a player reads their match';
  perform pg_temp.me(u[7]);
  assert (select count(*) from public.matches) = 0, 'others do not';
  perform pg_temp.me(u[1]);
  assert pg_temp.fails($q$select public.join_queue('soccer', 2)$q$, 'P0001'), 'cannot queue while in a live match';

  -- ---- report_result: host only, once; 1000 vs 1000 -> +16 / -16
  perform pg_temp.me(u[2]);
  assert pg_temp.fails(format($q$select public.report_result(%L, 2::smallint)$q$, m.id), 'P0001'), 'a guest cannot report';
  perform pg_temp.me(u[1]);
  assert pg_temp.fails(format($q$select public.report_result(%L, 3::smallint)$q$, m.id), 'P0001'), 'winner must be 1 or 2';
  perform public.report_result(m.id, 1::smallint);
  assert pg_temp.fails(format($q$select public.report_result(%L, 1::smallint)$q$, m.id), 'P0001'), 'only once';
  perform pg_temp.me(u[2]);
  assert (select (elo, wins, losses) from public.ratings where user_id = u[1] and game = 'soccer') = row(1016, 1, 0), 'winner +16';
  assert (select (elo, wins, losses) from public.ratings where user_id = u[2] and game = 'soccer') = row(984, 0, 1), 'loser -16';
  assert (select status || winner from public.matches where id = m.id) = 'done1', 'match closed';
  perform pg_temp.me(null);
  assert not exists (select 1 from public.rooms where code = m.room_code), 'room closed';
  perform pg_temp.me(u[1]);
  assert public.join_queue('soccer', 2) is null, 'can queue again after the match';
  perform public.leave_queue();
  perform pg_temp.me(null);
  assert not exists (select 1 from public.queue), 'leave_queue';

  -- ---- Elo numbers
  assert public.wobbly_elo_delta(1000, 1000, true) = 16 and public.wobbly_elo_delta(1000, 1000, false) = -16, '1000 vs 1000';
  assert public.wobbly_elo_delta(1200, 1000, true) = 8 and public.wobbly_elo_delta(1000, 1200, false) = -8, '1200 beats 1000';
  assert public.wobbly_elo_delta(1000, 1200, true) = 24, 'upset wins more';

  -- ---- four players rated 1000, 1500, 700, 1100 join in that order
  insert into public.ratings(user_id, game, elo) values (u[3], 'soccer', 1500), (u[4], 'soccer', 1100), (u[5], 'soccer', 1000), (u[6], 'soccer', 700);
  perform pg_temp.me(u[5]); assert public.join_queue('soccer', 4) is null, '1 of 4';
  perform pg_temp.me(u[3]); assert public.join_queue('soccer', 4) is null, '2 of 4';
  perform pg_temp.me(u[6]); assert public.join_queue('soccer', 4) is null, '3 of 4';
  perform pg_temp.me(u[7]); assert public.join_queue('soccer', 2) is null, 'a 1v1 waiter does not join a 2v2';
  perform pg_temp.me(u[4]); m := public.join_queue('soccer', 4);
  assert m.id is not null and m.size = 4 and m.host_id = u[5], '4th player completes it, oldest hosts';
  assert (select count(distinct p ->> 'team') from jsonb_array_elements(m.players) p) = 2, 'two teams';
  assert (select count(distinct p ->> 'team') from jsonb_array_elements(m.players) p where p ->> 'id' in (u[3]::text, u[6]::text)) = 1, 'best (1500) and worst (700) share a team';
  assert (select count(distinct p ->> 'team') from jsonb_array_elements(m.players) p where p ->> 'id' in (u[4]::text, u[5]::text)) = 1, 'the middle two share the other team';
  perform pg_temp.me(null);
  assert (select count(*) from public.queue) = 1, 'only the 1v1 waiter is left';

  -- ---- 2v2 deltas: team A = 1500 + 700 (avg 1100) beats B = 1100 + 1000 (avg 1050): +14 / -14
  perform pg_temp.me(u[5]);
  perform public.report_result(m.id, (select (p ->> 'team')::smallint from jsonb_array_elements(m.players) p where p ->> 'id' = u[3]::text));
  perform pg_temp.me(null);
  assert (select elo from public.ratings where user_id = u[3] and game = 'soccer') = 1514, 'A +14';
  assert (select elo from public.ratings where user_id = u[6] and game = 'soccer') = 714, 'A +14 (other member)';
  assert (select elo from public.ratings where user_id = u[4] and game = 'soccer') = 1086, 'B -14';
  assert (select elo from public.ratings where user_id = u[5] and game = 'soccer') = 986, 'B -14 (host)';
  assert (select sum(wins) = 2 and sum(losses) = 2 from public.ratings where user_id = any (u[3:6])), 'wins and losses counted';

  -- ---- games never mix
  perform pg_temp.me(null); delete from public.queue;
  perform pg_temp.me(u[8]); assert public.join_queue('volley-ball', 2) is null;
  perform pg_temp.me(u[9]); m2 := public.join_queue('soccer', 2);
  assert m2 is null, 'different games never match each other';

  -- ---- a host who already hosts a room: the old room is replaced
  perform pg_temp.me(null);
  delete from public.queue;
  insert into public.rooms(code, host_id) values ('ZZZZ', u[10]);
  perform pg_temp.me(u[10]); assert public.join_queue('soccer', 2) is null;
  perform pg_temp.me(u[11]); m := public.join_queue('soccer', 2);
  perform pg_temp.me(null);
  assert m.host_id = u[10] and (select count(*) from public.rooms where host_id = u[10]) = 1 and m.room_code <> 'ZZZZ', 'existing room of the host replaced';

  -- ---- a match counts as live for 15 minutes: an abandoned one stops blocking its players
  perform pg_temp.me(null);
  delete from public.queue;
  insert into public.matches(game, size, room_code, host_id, players, created_at) values
    ('soccer', 2, 'SSSS', u[14], jsonb_build_array(jsonb_build_object('id', u[12], 'team', 1), jsonb_build_object('id', u[14], 'team', 2)), now() - interval '10 minutes'),
    ('soccer', 2, 'TTTT', u[14], jsonb_build_array(jsonb_build_object('id', u[13], 'team', 1), jsonb_build_object('id', u[14], 'team', 2)), now() - interval '20 minutes');
  perform pg_temp.me(u[12]);
  assert pg_temp.fails($q$select public.join_queue('soccer', 2)$q$, 'P0001'), 'a 10-minute-old live match still blocks queueing';
  perform pg_temp.me(u[13]);
  assert public.join_queue('soccer', 2) is null, 'a 20-minute-old live match no longer blocks queueing';

  -- ---- stale rows
  perform pg_temp.me(null);
  delete from public.queue;
  insert into public.queue(user_id, game, size, joined_at) values (u[12], 'soccer', 2, now() - interval '11 minutes'), (u[13], 'soccer', 2, now() - interval '9 minutes');
  perform public.wobbly_expire_stale();
  assert (select array_agg(user_id) from public.queue where user_id in (u[12], u[13])) = array[u[13]], 'old queue rows deleted';
  assert (select status from public.matches where room_code = 'TTTT') = 'done' and (select status from public.matches where room_code = 'SSSS') = 'live', 'old live match closed';
  assert (select count(*) from public.ratings where user_id in (u[12], u[13])) = 0, 'no rating change on expiry';

  -- ---- 2v2 vs bots: two players, both on team 1, never mixed with the 1v1 queue, unrated
  perform pg_temp.me(null);
  delete from public.queue; delete from public.matches;
  perform pg_temp.me(u[1]);
  assert pg_temp.fails($q$select public.join_queue('soccer', 4, true)$q$, 'P0001'), 'vs bots is 2 players only';
  assert public.join_queue('soccer', 2, true) is null, 'first bots player waits';
  perform pg_temp.me(u[7]); assert public.join_queue('soccer', 2) is null, 'a 1v1 waiter does not join a vs bots match';
  perform pg_temp.me(u[2]); m := public.join_queue('soccer', 2, true);
  assert m.id is not null and m.bots and m.size = 2 and m.host_id = u[1], 'second bots player completes it';
  assert m.players = jsonb_build_array(jsonb_build_object('id', u[1], 'team', 1), jsonb_build_object('id', u[2], 'team', 1)), 'both on team 1';
  perform pg_temp.me(u[1]);
  perform public.report_result(m.id, 2::smallint);
  perform pg_temp.me(null);
  assert (select status || winner from public.matches where id = m.id) = 'done2', 'bots match closed';
  assert (select (elo, wins, losses) from public.ratings where user_id = u[1] and game = 'soccer') = row(1016, 1, 0), 'bots match leaves ratings alone';
  assert (select (elo, wins, losses) from public.ratings where user_id = u[2] and game = 'soccer') = row(984, 0, 1), 'no loss counted';
  assert not exists (select 1 from public.rooms where code = m.room_code), 'bots room closed';

  raise notice 'all accounts / queue / elo checks passed';
end $$;
