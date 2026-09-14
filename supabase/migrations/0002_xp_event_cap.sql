-- Phase 16 security hardening — XP tamper-resistance evaluation.
--
-- XP is client-trusted today (see 0001_init.sql's comment on user_xp_events): RLS confines writes
-- to the caller's own account, but nothing validates that a submitted `amount` matches what the
-- curriculum actually awards. A full fix means moving reward issuance to a server-side RPC that
-- independently derives the amount from a curriculum table instead of trusting the client — a
-- real change deferred to when XP carries competitive/monetary stakes (spec explicitly accepts
-- this tradeoff short-term).
--
-- Until then, this is the pragmatic defense-in-depth available without that rewrite: cap any
-- single event's amount well above the largest real award today (the highest mission is 150 XP)
-- while leaving headroom for future content. This doesn't stop a bad actor from inserting many
-- distinct fabricated event keys, but it does stop the trivial "one huge number" exploit, and the
-- unique (user_id, event_key) constraint already means they can't replay a single real key twice.
alter table public.user_xp_events
  drop constraint if exists user_xp_events_amount_check;

alter table public.user_xp_events
  add constraint user_xp_events_amount_check check (amount >= 0 and amount <= 500);
