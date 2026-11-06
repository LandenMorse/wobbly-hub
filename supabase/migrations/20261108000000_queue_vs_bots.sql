-- 2v2 vs bots: two players queue together (join_queue(game, 2, true)) and play as team 1 against two bots.
-- The game page fills every empty seat with a bot, so the match only lists the two players. Unrated: report_result just closes it.

alter table public.queue add column bots boolean not null default false;
alter table public.matches add column bots boolean not null default false;
drop index public.queue_waiting_idx;
create index queue_waiting_idx on public.queue (game, size, bots, joined_at);

-- Same as before plus p_bots (the 2-argument call keeps working through the default).
drop function public.join_queue(text, int);
create function public.join_queue(p_game text, p_size int, p_bots boolean default false) returns public.matches
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
  if p_bots is null or (p_bots and p_size <> 2) then raise exception 'vs bots is for 2 players'; end if;

  -- One matchmaker at a time, taken before any check: a player can switch game or size, and must never
  -- pass the live-match check while another join is still forming their match.
  perform pg_advisory_xact_lock(hashtext('wobbly-matchmaking'));
  if exists (select 1 from public.matches
             where status = 'live' and created_at > now() - public.wobbly_match_ttl()
               and players @> jsonb_build_array(jsonb_build_object('id', uid))) then
    raise exception 'you are already in a live match';
  end if;
  insert into public.queue (user_id, game, size, bots) values (uid, p_game, p_size, p_bots)
    on conflict (user_id) do update set game = excluded.game, size = excluded.size, bots = excluded.bots, joined_at = now();

  select array_agg(q.user_id order by q.joined_at) into ids from (
    select user_id, joined_at from public.queue
    where game = p_game and size = p_size and bots = p_bots
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

  -- vs bots: both players on team 1 (bots play team 2). 1v1: oldest vs newest. 2v2: by Elo, best + worst against the middle two.
  insert into public.matches (game, size, bots, room_code, host_id, players)
  select p_game, p_size, p_bots, code, ids[1],
         jsonb_agg(jsonb_build_object('id', t.id, 'team', t.team) order by t.ord)
  from (
    select u.id, u.ord,
           case when p_bots then 1
                when p_size = 2 then u.ord::int
                when row_number() over (order by coalesce(r.elo, 1000) desc, u.ord) in (1, 4) then 1
                else 2 end as team
    from unnest(ids) with ordinality u(id, ord)
    left join public.ratings r on r.user_id = u.id and r.game = p_game
  ) t
  returning * into m;
  return m;
end $$;

create or replace function public.report_result(p_match uuid, p_winner smallint) returns void
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

  if m.bots then   -- vs bots is unrated: just close it
    update public.matches set status = 'done', winner = p_winner where id = m.id;
    delete from public.rooms where code = m.room_code and host_id = m.host_id;
    return;
  end if;

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

revoke execute on function public.join_queue(text, int, boolean) from public, anon;
grant execute on function public.join_queue(text, int, boolean) to authenticated;
