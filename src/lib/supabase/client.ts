import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { productionSupabaseConfig } from './publicConfig';

// Production is connected out of the box. Local .env values can still point development
// at a separate Supabase project; the embedded key is public and RLS remains the boundary.
const url = import.meta.env.VITE_SUPABASE_URL || (import.meta.env.PROD ? productionSupabaseConfig.url : undefined);
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env.PROD ? productionSupabaseConfig.anonKey : undefined);

/** True when this build has Supabase client config. Never leaks values into UI copy. */
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
