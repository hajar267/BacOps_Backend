import axios from 'axios';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

login: async (username, password) => {
  set({ isLoading: true, error: null });
  try {
    const data = await authService.login({ username, password });
    set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  } catch (err: unknown) {
    let message = 'Nom d\'utilisateur ou mot de passe incorrect';
    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }
    set({ error: message, isLoading: false, isAuthenticated: false });
    throw err;
  }
},
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');
        const data = await authService.refresh(refreshToken);
        set({ accessToken: data.access_token });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'bacops-auth', // localStorage key
      partialize: (state) => ({
        // only persist what's needed — don't persist isLoading/error
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
