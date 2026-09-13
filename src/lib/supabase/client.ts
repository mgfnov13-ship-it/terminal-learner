import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True only when both env vars are present and non-empty. Never leaks the actual values into UI copy. */
export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Detail for developers only — visitor-facing copy never names an env var (see RequireAuth).
  console.error(
    'Terminal Space: Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing). ' +
      'Auth and cloud persistence are disabled; the app runs in local mode.',
  );
}

/**
 * Placeholder values so `createClient` never throws when unconfigured — the client is created but
 * unused in that case (every call site gates on `isSupabaseConfigured` first).
 */
export const supabase: SupabaseClient = createClient(
  url && anonKey ? url : 'https://placeholder.supabase.co',
  url && anonKey ? anonKey : 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
