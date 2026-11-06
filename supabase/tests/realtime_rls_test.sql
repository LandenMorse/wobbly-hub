-- Local check of the Realtime RLS policies against a stubbed realtime schema.
-- Run:  psql -v ON_ERROR_STOP=1 -f supabase/tests/realtime_rls_test.sql  (on a scratch database)
-- The stubs only mimic realtime.topic() and realtime.messages(topic, extension); a live run on
-- a Supabase branch is still needed to prove the real Realtime service honours the policies.
create schema if not exists auth; create schema if not exists realtime;
do $$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('app.uid', true), '')::uuid $$;
create or replace function realtime.topic() returns text language sql stable as $$ select current_setting('app.topic', true) $$;
create table if not exists realtime.messages (id bigserial primary key, topic text not null, extension text not null, payload jsonb);
alter table realtime.messages enable row level security;
grant usage on schema auth, realtime to authenticated;
grant execute on function auth.uid(), realtime.topic() to authenticated;
grant select, insert on realtime.messages to authenticated;
grant usage, select on sequence realtime.messages_id_seq to authenticated;

\ir ../migrations/20261104000000_realtime_rooms.sql

create or replace function pg_temp.can(op text, who uuid, tpc text, ext text) returns boolean language plpgsql as $$
declare ok boolean;
begin
  perform set_config('app.uid', who::text, true); perform set_config('app.topic', tpc, true);
  set local role authenticated;
  begin
    if op = 'insert' then
      insert into realtime.messages(topic, extension) values (tpc, ext); ok := true;
    else
      ok := exists (select 1 from realtime.messages where topic = tpc and extension = ext);
    end if;
  exception when insufficient_privilege or check_violation then ok := false;
  end;
  reset role;
  return ok;
end $$;
grant execute on function pg_temp.can(text, uuid, text, text) to public;

do $$
declare host uuid := '00000000-0000-0000-0000-0000000000a1'; g1 uuid := '00000000-0000-0000-0000-0000000000b1'; g2 uuid := '00000000-0000-0000-0000-0000000000b2';
begin
  -- host creates the room; a second user cannot create a room in the host's name
  perform set_config('app.uid', host::text, true); set local role authenticated;
  insert into public.rooms(code) values ('ABCD');
  begin insert into public.rooms(code, host_id) values ('WXYZ', g1); raise exception 'forged host_id accepted'; exception when insufficient_privilege then null; end;
  reset role;
  -- seed one message per topic so the read policies have rows to show
  insert into realtime.messages(topic, extension) values
    ('ws:ABCD:host','broadcast'),('ws:ABCD:host','presence'),('ws:ABCD:g:'||g1,'broadcast'),('ws:ABCD:g:'||g2,'broadcast'),('ws:NOPE:host','broadcast');

  assert pg_temp.can('insert', host, 'ws:ABCD:host', 'broadcast'),            'host can broadcast';
  assert not pg_temp.can('insert', g1, 'ws:ABCD:host', 'broadcast'),          'guest cannot broadcast on host topic';
  assert pg_temp.can('insert', g1, 'ws:ABCD:host', 'presence'),               'guest can track presence';
  assert not pg_temp.can('insert', g1, 'ws:NOPE:host', 'presence'),           'no presence in a missing room';
  assert pg_temp.can('select', g1, 'ws:ABCD:host', 'broadcast'),              'guest reads host topic';
  assert not pg_temp.can('select', g1, 'ws:NOPE:host', 'broadcast'),          'cannot read missing room';
  assert pg_temp.can('insert', g1, 'ws:ABCD:g:'||g1, 'broadcast'),            'guest sends on own line';
  assert not pg_temp.can('insert', g1, 'ws:ABCD:g:'||g2, 'broadcast'),        'guest cannot send as another guest';
  assert not pg_temp.can('insert', host, 'ws:ABCD:g:'||g1, 'broadcast'),      'host cannot send as a guest';
  assert pg_temp.can('select', host, 'ws:ABCD:g:'||g1, 'broadcast'),          'host reads every guest line';
  assert pg_temp.can('select', g1, 'ws:ABCD:g:'||g1, 'broadcast'),            'guest reads own line';
  assert not pg_temp.can('select', g1, 'ws:ABCD:g:'||g2, 'broadcast'),        'guest cannot read another guest line';
  assert not pg_temp.can('insert', g1, 'ws:ABCD:g:'||g1, 'presence'),         'no presence on guest lines';
  raise notice 'all realtime policy checks passed';
end $$;
