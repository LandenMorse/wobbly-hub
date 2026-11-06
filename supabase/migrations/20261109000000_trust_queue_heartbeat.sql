-- Wobbly Hub: results that both teams confirm, and a queue heartbeat so a closed tab is never matched.
-- Apply after 20261108000000_queue_vs_bots.sql, and ship the matching shared/account.js and shared/net.js with it:
-- clients from before this never poll the queue, so 20 s after joining nobody gets matched with them.
--
-- Results: every player of a match calls report_result once. Both teams name the same winner -> rated at once.
-- They disagree -> the match is void (no rating change). Only one team reports (the other left, or its host crashed)
-- -> rated as that team says a minute later (wobbly_finalize_reports, by cron and on every join_queue).
-- Queue: poll_queue() every few seconds while waiting; only waiters heard from in the last 20 s are matched.

-- ---- Matches: per-player reports; 'void' = disputed, or never settled ---------------------------
alter table public.matches
  add column reports     jsonb not null default '{}' check (jsonb_typeof(reports) = 'object'),   -- { "<uid>": 1|2 }
  add column reported_at timestamptz;                                                            -- the first report
alter table public.matches drop constraint matches_status_check;
alter table public.matches add constraint matches_status_check check (status in ('live', 'done', 'void'));
create index matches_reported_idx on public.matches (reported_at) where status = 'live';

-- A live match counts for 30 minutes (was 15: long matches were voided mid-play)
create or replace function public.wobbly_match_ttl() returns interval
language sql immutable set search_path = '' as $$ select interval '30 minutes' $$;

-- Settle a match from its reports. p_force: one team's word is enough (its grace minute is over).
create function public.wobbly_settle(m public.matches, p_force boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare
  winners int; teams int; w smallint;
  r1 numeric; r2 numeric; d1 int; d2 int;
begin
  select count(distinct v.value), count(distinct pl ->> 'team'), min(v.value::smallint) into winners, teams, w
    from jsonb_each_text(m.reports) v join jsonb_array_elements(m.players) pl on pl ->> 'id' = v.key;
  if winners = 0 then return; end if;
  if winners > 1 then
    update public.matches set status = 'void' where id = m.id;
    delete from public.rooms where code = m.room_code and host_id = m.host_id;
    return;
  end if;
  if teams < 2 and not p_force and not m.bots then return; end if;   -- vs bots has one team: its word settles it

  if not m.bots then   -- vs bots is unrated
    insert into public.ratings (user_id, game)
      select (p ->> 'id')::uuid, m.game from jsonb_array_elements(m.players) p on conflict do nothing;
    select avg(r.elo) filter (where (p ->> 'team')::int = 1), avg(r.elo) filter (where (p ->> 'team')::int = 2) into r1, r2
      from jsonb_array_elements(m.players) p join public.ratings r on r.user_id = (p ->> 'id')::uuid and r.game = m.game;
    d1 := public.wobbly_elo_delta(r1, r2, w = 1);
    d2 := public.wobbly_elo_delta(r2, r1, w = 2);
    update public.ratings r
       set elo    = r.elo + case when t.team = 1 then d1 else d2 end,
           wins   = r.wins   + (t.team = w)::int,
           losses = r.losses + (t.team <> w)::int
      from (select (p ->> 'id')::uuid as id, (p ->> 'team')::int as team from jsonb_array_elements(m.players) p) t
     where r.user_id = t.id and r.game = m.game;
  end if;
  update public.matches set status = 'done', winner = w where id = m.id;
  delete from public.rooms where code = m.room_code and host_id = m.host_id;
end $$;

-- Any player of the match says which team won (1 or 2), once.
create or replace function public.report_result(p_match uuid, p_winner smallint) returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  m   public.matches;
begin
  if p_winner is null or p_winner not in (1, 2) then raise exception 'winner must be 1 or 2'; end if;
  select * into m from public.matches where id = p_match for update;
  if not found or uid is null or not m.players @> jsonb_build_array(jsonb_build_object('id', uid)) then
    raise exception 'only players of the match can report';
  end if;
  if m.status <> 'live' then raise exception 'match already reported'; end if;
  if m.reports ? uid::text then raise exception 'you already reported'; end if;
  update public.matches
     set reports = reports || jsonb_build_object(uid::text, p_winner), reported_at = coalesce(reported_at, now())
   where id = m.id returning * into m;
  perform public.wobbly_settle(m, false);
end $$;

-- A match with a report and no answer from the other team for a minute goes the way the report says.
create function public.wobbly_finalize_reports() returns void
language plpgsql security definer set search_path = '' as $$
declare m public.matches;
begin
  for m in select * from public.matches where status = 'live' and reported_at < now() - interval '1 minute' for update skip locked
  loop perform public.wobbly_settle(m, true); end loop;
end $$;

-- ---- Queue: a heartbeat; one function forms a match for join_queue and poll_queue ----------------
alter table public.queue add column seen_at timestamptz not null default now();

-- Callers hold the matchmaking lock. Matches p_uid with the oldest waiters heard from in the last 20 s; null if not enough.
create function public.wobbly_form_match(p_uid uuid) returns public.matches
language plpgsql security definer set search_path = '' as $$
declare
  me    public.queue;
  ids   uuid[];
  code  text;
  tries int := 0;
  n     int;
  m     public.matches;
begin
  select * into me from public.queue where user_id = p_uid;
  if not found then return null; end if;
  select array_agg(q.user_id order by q.joined_at) into ids from (
    select user_id, joined_at from public.queue
    where game = me.game and size = me.size and bots = me.bots
      and (user_id = p_uid or seen_at > now() - interval '20 seconds')
    order by joined_at limit me.size
  ) q;
  if coalesce(array_length(ids, 1), 0) < me.size or not p_uid = any (ids) then return null; end if;
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

  -- vs bots: both players on team 1 (bots play team 2). 1v1: oldest vs newest. 2v2: by Elo, best + worst against the middle two.
  insert into public.matches (game, size, bots, room_code, host_id, players)
  select me.game, me.size, me.bots, code, ids[1],
         jsonb_agg(jsonb_build_object('id', t.id, 'team', t.team) order by t.ord)
  from (
    select u.id, u.ord,
           case when me.bots then 1
                when me.size = 2 then u.ord::int
                when row_number() over (order by coalesce(r.elo, 1000) desc, u.ord) in (1, 4) then 1
                else 2 end as team
    from unnest(ids) with ordinality u(id, ord)
    left join public.ratings r on r.user_id = u.id and r.game = me.game
  ) t
  returning * into m;
  return m;
end $$;

create or replace function public.join_queue(p_game text, p_size int, p_bots boolean default false) returns public.matches
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid());
begin
  if uid is null then raise exception 'sign in first'; end if;
  if p_game is null or p_game !~ '^[a-z0-9-]{1,16}$' then raise exception 'bad game'; end if;
  if p_size is null or p_size not in (2, 4) then raise exception 'size must be 2 or 4'; end if;
  if p_bots is null or (p_bots and p_size <> 2) then raise exception 'vs bots is for 2 players'; end if;

  -- One matchmaker at a time, taken before any check: a player can switch game or size, and must never
  -- pass the live-match check while another join is still forming their match.
  perform pg_advisory_xact_lock(hashtext('wobbly-matchmaking'));
  perform public.wobbly_finalize_reports();   -- also where pg_cron is missing
  -- A match you have reported no longer holds you back while the other team answers
  if exists (select 1 from public.matches
             where status = 'live' and created_at > now() - public.wobbly_match_ttl()
               and players @> jsonb_build_array(jsonb_build_object('id', uid)) and not reports ? uid::text) then
    raise exception 'you are already in a live match';
  end if;
  -- Joining again with the same game and size keeps your place in line (unless you went quiet for 20 s)
  insert into public.queue as q (user_id, game, size, bots) values (uid, p_game, p_size, p_bots)
    on conflict (user_id) do update set
      joined_at = case when (q.game, q.size, q.bots) = (excluded.game, excluded.size, excluded.bots)
                        and q.seen_at > now() - interval '20 seconds' then q.joined_at else now() end,
      game = excluded.game, size = excluded.size, bots = excluded.bots, seen_at = now();
  return public.wobbly_form_match(uid);
end $$;

-- The waiting player's heartbeat: returns the match once formed (also one formed for us in the last 2 minutes,
-- in case we missed its Realtime message), else null. Raises 'not in queue' when our row is gone: join again.
create function public.poll_queue() returns public.matches
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  m   public.matches;
begin
  if uid is null then raise exception 'sign in first'; end if;
  perform pg_advisory_xact_lock(hashtext('wobbly-matchmaking'));
  update public.queue set seen_at = now() where user_id = uid;
  if found then return public.wobbly_form_match(uid); end if;
  select * into m from public.matches
   where status = 'live' and created_at > now() - interval '2 minutes'
     and players @> jsonb_build_array(jsonb_build_object('id', uid)) and not reports ? uid::text
   order by created_at desc limit 1;
  if not found then raise exception 'not in queue'; end if;
  return m;
end $$;

-- ---- Stale rows: waiters not heard from for a minute; live matches past wobbly_match_ttl() are void --------
create or replace function public.wobbly_expire_stale() returns void
language sql set search_path = '' as $$
  delete from public.queue where seen_at < now() - interval '1 minute';
  update public.matches set status = 'void' where status = 'live' and created_at < now() - public.wobbly_match_ttl();
$$;

-- New functions are callable by nobody by default; open only what players call.
revoke execute on function public.wobbly_settle(public.matches, boolean), public.wobbly_finalize_reports(),
  public.wobbly_form_match(uuid) from public, anon, authenticated;
revoke execute on function public.poll_queue() from public, anon;
grant execute on function public.poll_queue() to authenticated;

-- Needs pg_cron (skipped where it is not installed; join_queue settles reports too)
do $$ begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('wobbly-settle-reports', '* * * * *', 'select public.wobbly_finalize_reports()');
  end if;
end $$;
