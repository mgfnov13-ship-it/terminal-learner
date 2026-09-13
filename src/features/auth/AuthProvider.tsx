import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_complete: boolean;
}

export type AuthResult = { error: string | null };

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  /** True while the current session is a Supabase password-recovery session, not a normal sign-in. */
  isPasswordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

const NOT_CONNECTED = "Terminal Space isn't connected to an account backend yet.";

function readableAuthError(message: string | undefined): string {
  if (!message) return 'Something went wrong. Try again.';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (m.includes('already registered') || m.includes('already exists')) {
    return 'That email is already registered. Try signing in instead.';
  }
  if (m.includes('email not confirmed')) return 'Verify your email before signing in.';
  if (m.includes('password') && m.includes('at least')) return message;
  if (m.includes('rate limit')) return 'Too many attempts. Wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch')) return "We couldn't connect right now. Try again.";
  return message;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const mounted = useRef(true);

  async function loadProfile(userId: string) {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (mounted.current && data) setProfile(data as Profile);
  }

  useEffect(() => {
    mounted.current = true;
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted.current) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted.current) return;
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
        setProfile(null);
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) loadProfile(nextSession.user.id);
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    isPasswordRecovery,
    async signIn(email, password) {
      if (!isSupabaseConfigured) return { error: NOT_CONNECTED };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? readableAuthError(error.message) : null };
    },
    async signUp(email, password) {
      if (!isSupabaseConfigured) return { error: NOT_CONNECTED };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      return { error: error ? readableAuthError(error.message) : null };
    },
    async signOut() {
      if (!isSupabaseConfigured) return;
      await supabase.auth.signOut();
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured) return { error: NOT_CONNECTED };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      return { error: error ? readableAuthError(error.message) : null };
    },
    async updatePassword(password) {
      if (!isSupabaseConfigured) return { error: NOT_CONNECTED };
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) setIsPasswordRecovery(false);
      return { error: error ? readableAuthError(error.message) : null };
    },
    async resendVerification(email) {
      if (!isSupabaseConfigured) return { error: NOT_CONNECTED };
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      return { error: error ? readableAuthError(error.message) : null };
    },
    async refreshProfile() {
      if (user) await loadProfile(user.id);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
