import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:8000/api
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired access tokens with a silent refresh
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue this request until the refresh finishes
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        // await useAuthStore.getState().refreshAccessToken();
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        // useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
