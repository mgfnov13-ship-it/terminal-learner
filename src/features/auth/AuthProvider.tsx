import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { LocalizedText } from '../../lib/i18n';
import { isSupabaseConfigured, supabase } from '../../lib/supabase/client';
import { authErrorCodeCopy, authErrorCopy } from './authErrors';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_complete: boolean;
}

export type AuthResult = { error: LocalizedText | null; session?: Session | null };

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  isPasswordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    patch: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'onboarding_complete'>>,
  ) => Promise<AuthResult>;
}

function fail(message?: string): AuthResult {
  return { error: authErrorCopy(message) };
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const mounted = useRef(true);
  const generation = useRef(0);

  async function loadProfile(userId: string) {
    if (!isSupabaseConfigured) return;
    const my = ++generation.current;
    setProfileLoading(true);
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!mounted.current || my !== generation.current) return;
    setProfile((data as Profile) ?? null);
    setProfileLoading(false);
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
      if (data.session?.user) {
        void loadProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted.current) return;
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
        setProfile(null);
        generation.current += 1;
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) void loadProfile(nextSession.user.id);
      else setProfileLoading(false);
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
    profileLoading,
    isConfigured: isSupabaseConfigured,
    isPasswordRecovery,
    async signIn(email, password) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? fail(error.message) : { error: null };
    },
    async signUp(email, password) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      return error ? fail(error.message) : { error: null, session: data.session };
    },
    async signOut() {
      if (!isSupabaseConfigured) return;
      await supabase.auth.signOut();
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      return error ? fail(error.message) : { error: null };
    },
    async updatePassword(password) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) setIsPasswordRecovery(false);
      return error ? fail(error.message) : { error: null };
    },
    async resendVerification(email) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      return error ? fail(error.message) : { error: null };
    },
    async refreshProfile() {
      if (user) await loadProfile(user.id);
    },
    async updateProfile(patch) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      if (!user) return { error: authErrorCodeCopy('not_signed_in') };
      const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
      if (error) return fail(error.message);
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
      return { error: null };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
