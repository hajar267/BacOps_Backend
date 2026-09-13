import { api } from '@/lib/axios';
import { LoginPayload, LoginResponse } from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
  const { data } = await api.post('/auth/refresh', { refreshToken }, {
    skipAuthRefresh: true,
  });
  return data;
},
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken }, {
      skipAuthRefresh: true,
    });
  },
};
