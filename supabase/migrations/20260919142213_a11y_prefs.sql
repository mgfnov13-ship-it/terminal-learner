alter table public.user_settings
  add column if not exists language text not null default 'en' check (language in ('en', 'ar')),
  add column if not exists text_scale text not null default 'standard' check (text_scale in ('standard', 'large', 'larger')),
  add column if not exists high_contrast boolean not null default false;
