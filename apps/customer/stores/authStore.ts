import { create } from 'zustand';
import type { Profile } from '@cheerslk/shared-types';

interface AuthState {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (session: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setProfile: (profile: Profile) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      // TODO: Check for existing session in SecureStore
      set({ isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (session: any) => {
    set({
      session,
      user: session?.user || null,
      isAuthenticated: true,
    });
    // TODO: Save session to SecureStore
    // TODO: Fetch profile from Supabase
  },

  logout: async () => {
    set({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
    });
    // TODO: Remove session from SecureStore
    // TODO: Sign out from Supabase
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { profile } = get();
    // TODO: Update profile in Supabase
    if (profile) {
      set({ profile: { ...profile, ...updates } as Profile });
    }
  },

  setProfile: (profile: Profile) => set({ profile }),
}));
