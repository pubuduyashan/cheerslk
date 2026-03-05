import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { Profile } from '@cheerslk/shared-types';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOnboarded: (onboarded: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isLoading: true,
  isOnboarded: false,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
  reset: () =>
    set({
      session: null,
      profile: null,
      isLoading: false,
      isOnboarded: false,
    }),
}));
