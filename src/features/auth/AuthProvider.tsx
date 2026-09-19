import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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
  const authEventSeen = useRef(false);

  const loadProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const my = ++generation.current;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) throw error;
      if (!mounted.current || my !== generation.current) return;
      setProfile((data as Profile) ?? null);
    } catch (error) {
      if (!mounted.current || my !== generation.current) return;
      console.error('Terminal Space: profile sync failed.', error);
      setProfile(null);
    } finally {
      if (mounted.current && my === generation.current) setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    authEventSeen.current = false;
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted.current || authEventSeen.current) return;
        if (error) console.error('Terminal Space: could not restore the Supabase session.', error);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!mounted.current || authEventSeen.current) return;
        console.error('Terminal Space: could not restore the Supabase session.', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    // Keep this callback state-only; profile requests run in the effect below so they cannot
    // contend with Supabase Auth's internal lock.
    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted.current) return;
      authEventSeen.current = true;
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
        setProfile(null);
        generation.current += 1;
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession?.user) {
        setProfile(null);
        setProfileLoading(false);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const profileUserId = user?.id ?? null;

  useEffect(() => {
    if (!profileUserId || !isSupabaseConfigured) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    void loadProfile(profileUserId);
    return () => {
      generation.current += 1;
    };
  }, [profileUserId, loadProfile]);

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
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? fail(error.message) : { error: null };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
    async signUp(email, password) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        return error ? fail(error.message) : { error: null, session: data.session };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
    async signOut() {
      if (!isSupabaseConfigured) return;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Terminal Space: Supabase sign-out failed.', error);
      } catch (error) {
        console.error('Terminal Space: Supabase sign-out failed.', error);
      }
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        return error ? fail(error.message) : { error: null };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
    async updatePassword(password) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (!error) setIsPasswordRecovery(false);
        return error ? fail(error.message) : { error: null };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
    async resendVerification(email) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      try {
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        return error ? fail(error.message) : { error: null };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
    async refreshProfile() {
      if (user) await loadProfile(user.id);
    },
    async updateProfile(patch) {
      if (!isSupabaseConfigured) return { error: authErrorCodeCopy('not_connected') };
      if (!user) return { error: authErrorCodeCopy('not_signed_in') };
      try {
        const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select('id').maybeSingle();
        if (error) return fail(error.message);
        if (!data) return fail('profile not found');
        setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
        return { error: null };
      } catch (error) {
        return fail(error instanceof Error ? error.message : undefined);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
