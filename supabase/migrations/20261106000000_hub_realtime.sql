-- Wobbly Hub: Realtime Authorization for the hub world (private channels, like the ws: topics).
--
-- Topic layout (all channels must be created with { config: { private: true } }):
--   hub:<world>           Anyone signed in reads and tracks presence (who is in the world, positions).
--   hub:<world>:u:<uid>   A player's own broadcast line (chat, emotes). Anyone signed in reads.
--                         Only <uid> (the JWT subject) may send, so the sender is fixed by the topic.
-- <world> must match ^[a-z0-9-]{1,16}$, the same rule the hub applies to ?world=.

create policy "hub topic: read"
  on realtime.messages for select to authenticated
  using (
    (
      realtime.messages.extension in ('broadcast', 'presence')
      and (select realtime.topic()) ~ '^hub:[a-z0-9-]{1,16}$'
    ) or (
      realtime.messages.extension = 'broadcast'
      and (select realtime.topic()) ~ '^hub:[a-z0-9-]{1,16}:u:[0-9a-f-]{36}$'
    )
  );

-- Presence on the world topic is open to everyone signed in; broadcast there is not allowed.
create policy "hub topic: presence"
  on realtime.messages for insert to authenticated
  with check (
    realtime.messages.extension = 'presence'
    and (select realtime.topic()) ~ '^hub:[a-z0-9-]{1,16}$'
  );

create policy "hub user line: write"
  on realtime.messages for insert to authenticated
  with check (
    realtime.messages.extension = 'broadcast'
    and (select realtime.topic()) ~ '^hub:[a-z0-9-]{1,16}:u:[0-9a-f-]{36}$'
    and split_part((select realtime.topic()), ':', 4) = (select auth.uid())::text
  );
