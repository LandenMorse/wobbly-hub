-- Wobbly Hub: accounts, matchmaking queue, matches and Elo ratings.
--
-- profiles  a player's name and look (everyone signed in reads; owners write only username and cosmetics)
-- ratings   Elo per game; written only by report_result()
-- queue     who is waiting for a match; touched only by join_queue() / leave_queue()
-- matches   a formed match: the rooms row (room_code) the players meet in, and who plays on which team.
--           Players read their own matches (Realtime postgres_changes tells a waiting player their match is ready).
-- Flow: join_queue(game, size) -> match with room_code -> players join that room as usual -> the host calls report_result().

create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,   -- = auth.uid()
  username   citext not null unique check (username ~ '^[A-Za-z0-9_]{3,16}$'),
  -- Only the look: ids of skin, hat, boots, acc. The cosmetics registry validates them client-side; the DB caps shape and size.
  cosmetics  jsonb not null default '{}' check (
    jsonb_typeof(cosmetics) = 'object'
    and cosmetics - '{skin,hat,boots,acc}'::text[] = '{}'
    and not jsonb_path_exists(cosmetics, '$.* ? (@.type() != "string" || !(@ like_regex "^[A-Za-z0-9_-]{1,40}$"))')
  ),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, username, cosmetics), update (username, cosmetics) on public.profiles to authenticated;

create policy "profiles are readable by signed-in users"
  on public.profiles for select to authenticated using (true);
create policy "users create their own profile"
  on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "users edit their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- Ratings: read-only for clients
-- ---------------------------------------------------------------------------
create table public.ratings (
  user_id uuid not null references auth.users on delete cascade,
  game    text not null,
  elo     int  not null default 1000,
  wins    int  not null default 0,
  losses  int  not null default 0,
  primary key (user_id, game)
);

alter table public.ratings enable row level security;
revoke all on public.ratings from anon, authenticated;
grant select on public.ratings to authenticated;
create policy "ratings are readable by signed-in users"
  on public.ratings for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Queue and matches: no client writes; the functions below are security definer
-- ---------------------------------------------------------------------------
create table public.queue (
  user_id   uuid primary key references auth.users on delete cascade,   -- one queue at a time
  game      text not null check (game ~ '^[a-z0-9-]{1,16}$'),
  size      int  not null check (size in (2, 4)),
  joined_at timestamptz not null default now()
);
create index queue_waiting_idx on public.queue (game, size, joined_at);
alter table public.queue enable row level security;   -- no policies, no grants: only the functions touch it
revoke all on public.queue from anon, authenticated;

create table public.matches (
  id         uuid primary key default gen_random_uuid(),
  game       text not null check (game ~ '^[a-z0-9-]{1,16}$'),
  size       int  not null check (size in (2, 4)),
  room_code  text not null check (room_code ~ '^[A-Z]{4}$'),
  host_id    uuid not null,
  players    jsonb not null check (jsonb_typeof(players) = 'array'),   -- [{ "id": uuid, "team": 1|2 }]
  status     text not null default 'live' check (status in ('live', 'done')),
  winner     smallint check (winner in (1, 2)),
  created_at timestamptz not null default now()
);
create index matches_players_idx on public.matches using gin (players jsonb_path_ops);
create index matches_created_at_idx on public.matches (created_at);

alter table public.matches enable row level security;
revoke all on public.matches from anon, authenticated;
grant select on public.matches to authenticated;
create policy "players read their matches"
  on public.matches for select to authenticated
  using (players @> jsonb_build_array(jsonb_build_object('id', (select auth.uid()))));

do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.matches;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Elo: the one place the maths lives. Change in rating for a side rated a against a side rated b.
-- ---------------------------------------------------------------------------
create function public.wobbly_elo_delta(a numeric, b numeric, won boolean) returns int
language sql immutable set search_path = '' as $$
  select round(32 * ((case when won then 1 else 0 end) - 1 / (1 + power(10::numeric, (b - a) / 400))))::int
$$;

-- How long a match counts as live. After that it no longer blocks its players from queueing
-- (a host who closed the tab never reports) and wobbly_expire_stale() closes it.
create function public.wobbly_match_ttl() returns interval
language sql immutable set search_path = '' as $$ select interval '15 minutes' $$;
revoke execute on function public.wobbly_match_ttl() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- join_queue: wait for a match. Returns the match once p_size players are waiting, else null
-- (then watch matches via Realtime postgres_changes, or call again).
-- ---------------------------------------------------------------------------
create function public.join_queue(p_game text, p_size int) returns public.matches
language plpgsql security definer set search_path = '' as $$
declare
  uid   uuid := (select auth.uid());
  ids   uuid[];
  code  text;
  tries int := 0;
  n     int;
  m     public.matches;
begin
  if uid is null then raise exception 'sign in first'; end if;
  if p_game is null or p_game !~ '^[a-z0-9-]{1,16}$' then raise exception 'bad game'; end if;
  if p_size is null or p_size not in (2, 4) then raise exception 'size must be 2 or 4'; end if;

  -- One matchmaker at a time, taken before any check: a player can switch game or size, and must never
  -- pass the live-match check while another join is still forming their match.
  perform pg_advisory_xact_lock(hashtext('wobbly-matchmaking'));
  if exists (select 1 from public.matches
             where status = 'live' and created_at > now() - public.wobbly_match_ttl()
               and players @> jsonb_build_array(jsonb_build_object('id', uid))) then
    raise exception 'you are already in a live match';
  end if;
  insert into public.queue (user_id, game, size) values (uid, p_game, p_size)
    on conflict (user_id) do update set game = excluded.game, size = excluded.size, joined_at = now();

  select array_agg(q.user_id order by q.joined_at) into ids from (
    select user_id, joined_at from public.queue
    where game = p_game and size = p_size
    order by joined_at limit p_size
    for update skip locked
  ) q;
  if coalesce(array_length(ids, 1), 0) < p_size then return null; end if;
  delete from public.queue where user_id = any (ids);

  -- The oldest player hosts. Hosting a room already? Close it (rooms.host_id is unique).
  delete from public.rooms where host_id = ids[1];
  loop
    code := (select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ', 1 + floor(random() * 24)::int, 1), '')
             from generate_series(1, 4));
    insert into public.rooms (code, host_id) values (code, ids[1]) on conflict do nothing;
    get diagnostics n = row_count;
    exit when n = 1;
    tries := tries + 1;
    if tries >= 20 then raise exception 'no free room code'; end if;
  end loop;

  -- 1v1: oldest vs newest. 2v2: by Elo, best + worst against the middle two.
  insert into public.matches (game, size, room_code, host_id, players)
  select p_game, p_size, code, ids[1],
         jsonb_agg(jsonb_build_object('id', t.id, 'team', t.team) order by t.ord)
  from (
    select u.id, u.ord,
           case when p_size = 2 then u.ord::int
                when row_number() over (order by coalesce(r.elo, 1000) desc, u.ord) in (1, 4) then 1
                else 2 end as team
    from unnest(ids) with ordinality u(id, ord)
    left join public.ratings r on r.user_id = u.id and r.game = p_game
  ) t
  returning * into m;
  return m;
end $$;

create function public.leave_queue() returns void
language sql security definer set search_path = '' as $$
  delete from public.queue where user_id = (select auth.uid())
$$;

-- ---------------------------------------------------------------------------
-- report_result: the match's host says which team won (1 or 2). Once. Updates Elo, closes the room.
-- A team's rating is the average of its players; every player moves by their team's delta.
-- ---------------------------------------------------------------------------
create function public.report_result(p_match uuid, p_winner smallint) returns void
language plpgsql security definer set search_path = '' as $$
declare
  m public.matches;
  r1 numeric; r2 numeric;
  d1 int; d2 int;
begin
  if p_winner is null or p_winner not in (1, 2) then raise exception 'winner must be 1 or 2'; end if;
  select * into m from public.matches where id = p_match for update;
  if not found or m.host_id is distinct from (select auth.uid()) then raise exception 'only the match host can report'; end if;
  if m.status <> 'live' then raise exception 'match already reported'; end if;

  insert into public.ratings (user_id, game)
    select (p ->> 'id')::uuid, m.game from jsonb_array_elements(m.players) p
    on conflict do nothing;
  select avg(r.elo) filter (where (p ->> 'team')::int = 1), avg(r.elo) filter (where (p ->> 'team')::int = 2)
    into r1, r2
    from jsonb_array_elements(m.players) p
    join public.ratings r on r.user_id = (p ->> 'id')::uuid and r.game = m.game;
  d1 := public.wobbly_elo_delta(r1, r2, p_winner = 1);
  d2 := public.wobbly_elo_delta(r2, r1, p_winner = 2);

  update public.ratings r
     set elo    = r.elo + case when t.team = 1 then d1 else d2 end,
         wins   = r.wins   + (t.team = p_winner)::int,
         losses = r.losses + (t.team <> p_winner)::int
    from (select (p ->> 'id')::uuid as id, (p ->> 'team')::int as team from jsonb_array_elements(m.players) p) t
   where r.user_id = t.id and r.game = m.game;

  update public.matches set status = 'done', winner = p_winner where id = m.id;
  delete from public.rooms where code = m.room_code and host_id = m.host_id;
end $$;

-- Functions are callable by signed-in users only (anonymous sign-ins use the authenticated role).
revoke execute on function public.wobbly_elo_delta(numeric, numeric, boolean) from public, anon, authenticated;
revoke execute on function public.join_queue(text, int) from public, anon;
revoke execute on function public.leave_queue() from public, anon;
revoke execute on function public.report_result(uuid, smallint) from public, anon;
grant execute on function public.join_queue(text, int), public.leave_queue(), public.report_result(uuid, smallint) to authenticated;

-- ---------------------------------------------------------------------------
-- Stale rows: waiting over 10 minutes, or a live match never reported within wobbly_match_ttl() (closed without rating changes).
-- ---------------------------------------------------------------------------
create function public.wobbly_expire_stale() returns void
language sql set search_path = '' as $$
  delete from public.queue where joined_at < now() - interval '10 minutes';
  update public.matches set status = 'done' where status = 'live' and created_at < now() - public.wobbly_match_ttl();
$$;
revoke execute on function public.wobbly_expire_stale() from public, anon, authenticated;

-- Needs the pg_cron extension (skipped where it is not installed, e.g. a plain local Postgres).
do $$ begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('wobbly-expire-queue', '*/5 * * * *', 'select public.wobbly_expire_stale()');
  end if;
end $$;
