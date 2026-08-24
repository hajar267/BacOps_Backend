import { api } from '@/lib/axios';
import { BacHistoryItem, BacLocation, BacSearchResult } from '@/types/search';

export const searchService = {
  infos: async (rfid: string): Promise<BacSearchResult> => {
    const response = await api.get('/search/bac/infos', { params: { rfid } });
    return response.data;
  },

  history: async (id: number): Promise<BacHistoryItem[]> => {
    const response = await api.get(`/search/bac/${id}/history`);
    return response.data;
  },

  locations: async (): Promise<BacLocation[]> => {
    const response = await api.get('/search/bac/location');
    return response.data;
  },
};