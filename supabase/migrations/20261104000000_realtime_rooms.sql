-- Wobbly Soccer: authenticated sender identity for online rooms.
--
-- Topic layout (all channels must be created with { config: { private: true } }):
--   ws:<CODE>:host        Everyone in the room reads. Only the room's host may broadcast
--                         (lobby, start, snap, tolobby). Anyone may track presence.
--   ws:<CODE>:g:<uid>     A guest's private line to the host: hello and key inputs.
--                         Only <uid> (the JWT subject) may send. Only <uid> and the host may read.
-- Because the sender of a guest message is fixed by the topic, the host never has to trust
-- an "id" field inside a payload. Realtime RLS cannot look inside payloads, hence one topic per sender.

-- ---------------------------------------------------------------------------
-- Rooms: one row per live room. It is the authority on who the host is.
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  code       text primary key check (code ~ '^[A-Z]{4}$'),
  host_id    uuid not null unique default auth.uid(),  -- one live room per user
  created_at timestamptz not null default now()
);
comment on table public.rooms is 'Live Wobbly Soccer rooms. host_id is the only user allowed to broadcast on ws:<code>:host.';

create index if not exists rooms_created_at_idx on public.rooms (created_at);

alter table public.rooms enable row level security;

-- Anonymous sign-ins use the authenticated role, so these grants cover them too.
revoke all on public.rooms from anon, authenticated;
grant select, insert, delete on public.rooms to authenticated;

create policy "rooms are readable by signed-in users"
  on public.rooms for select to authenticated
  using (true);

create policy "users create rooms they host"
  on public.rooms for insert to authenticated
  with check ((select auth.uid()) = host_id);

create policy "hosts close their own room"
  on public.rooms for delete to authenticated
  using ((select auth.uid()) = host_id);

-- ---------------------------------------------------------------------------
-- Realtime Authorization (private channels): RLS on realtime.messages
-- ---------------------------------------------------------------------------

-- Everyone may read the host topic of a room that exists (broadcast and presence).
create policy "ws host topic: read"
  on realtime.messages for select to authenticated
  using (
    realtime.messages.extension in ('broadcast', 'presence')
    and split_part((select realtime.topic()), ':', 1) = 'ws'
    and split_part((select realtime.topic()), ':', 3) = 'host'
    and exists (select 1 from public.rooms r where r.code = split_part((select realtime.topic()), ':', 2))
  );

-- Presence on the host topic is open to the room; broadcast is the host's alone.
create policy "ws host topic: write"
  on realtime.messages for insert to authenticated
  with check (
    split_part((select realtime.topic()), ':', 1) = 'ws'
    and split_part((select realtime.topic()), ':', 3) = 'host'
    and (
      (realtime.messages.extension = 'presence'
        and exists (select 1 from public.rooms r where r.code = split_part((select realtime.topic()), ':', 2)))
      or
      (realtime.messages.extension = 'broadcast'
        and exists (select 1 from public.rooms r
                    where r.code = split_part((select realtime.topic()), ':', 2)
                      and r.host_id = (select auth.uid())))
    )
  );

-- A guest's line: readable by that guest and by the room's host.
create policy "ws guest topic: read"
  on realtime.messages for select to authenticated
  using (
    realtime.messages.extension = 'broadcast'
    and split_part((select realtime.topic()), ':', 1) = 'ws'
    and split_part((select realtime.topic()), ':', 3) = 'g'
    and (
      split_part((select realtime.topic()), ':', 4) = (select auth.uid())::text
      or exists (select 1 from public.rooms r
                 where r.code = split_part((select realtime.topic()), ':', 2)
                   and r.host_id = (select auth.uid()))
    )
  );

-- A guest's line: only that guest may send, and only into a room that exists.
create policy "ws guest topic: write"
  on realtime.messages for insert to authenticated
  with check (
    realtime.messages.extension = 'broadcast'
    and split_part((select realtime.topic()), ':', 1) = 'ws'
    and split_part((select realtime.topic()), ':', 3) = 'g'
    and split_part((select realtime.topic()), ':', 4) = (select auth.uid())::text
    and exists (select 1 from public.rooms r where r.code = split_part((select realtime.topic()), ':', 2))
  );
