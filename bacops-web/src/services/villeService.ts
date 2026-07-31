import { api } from '@/lib/axios';
import { VilleListItem, CreateVillePayload, UpdateVillePayload } from '@/types/location';

export const villeService = {
  list: async (): Promise<VilleListItem[]> => {
    const { data } = await api.get('/villes');
    return data.data || data;
  },
  create: async (payload: CreateVillePayload): Promise<VilleListItem> => {
    const { data } = await api.post('/villes', payload);
    return data.data || data;
  },
  update: async (id: number, payload: UpdateVillePayload): Promise<VilleListItem> => {
    const { data } = await api.put(`/villes/${id}`, payload);
    return data.data || data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/villes/${id}`);
  },
};