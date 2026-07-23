import { api } from '@/lib/axios';
import { LoginPayload, LoginResponse } from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  refresh: async (refreshToken: string): Promise<{ access_token: string }> => {
    const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return data;
  },

//   logout: async (): Promise<void> => {
//     await api.post('/auth/logout');
//   },
};
