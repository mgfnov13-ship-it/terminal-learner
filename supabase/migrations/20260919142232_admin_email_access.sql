-- Admin access is restricted to the two account emails named by the project owner.
-- Authorization uses the Supabase Auth email claim, never user-editable user_metadata.
create policy "profiles_select_admin_emails" on public.profiles
  for select to authenticated
  using (lower((select auth.jwt() ->> 'email')) in ('mgfnov13@gmail.com', 'm.obaida2021@gmail.com'));

create policy "contact_submissions_select_admin_emails" on public.contact_submissions
  for select to authenticated
  using (lower((select auth.jwt() ->> 'email')) in ('mgfnov13@gmail.com', 'm.obaida2021@gmail.com'));
