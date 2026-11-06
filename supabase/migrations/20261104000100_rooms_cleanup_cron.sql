-- Optional: expire rooms whose host vanished without closing them (closed tab, lost connection).
-- Needs the pg_cron extension (Dashboard -> Database -> Extensions, or the statement below).
create extension if not exists pg_cron;

select cron.schedule(
  'wobbly-soccer-expire-rooms',
  '*/15 * * * *',
  $$ delete from public.rooms where created_at < now() - interval '6 hours' $$
);
