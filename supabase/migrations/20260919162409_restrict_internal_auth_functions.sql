-- These functions are invoked by database triggers and are not public RPC endpoints.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Some hosted projects install this event trigger separately from the app migrations.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
