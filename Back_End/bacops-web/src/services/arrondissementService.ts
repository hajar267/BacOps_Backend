import { api } from '@/lib/axios';
import { ArrondissementListItem, CreateArrondissementPayload, UpdateArrondissementPayload } from '@/types/location';

export const arrondissementService = {
  list: async (): Promise<ArrondissementListItem[]> => {
    const { data } = await api.get('/arrondissements');
    return data.data || data;
  },
  create: async (payload: CreateArrondissementPayload): Promise<ArrondissementListItem> => {
    const { data } = await api.post('/arrondissements', payload);
    return data.data || data;
  },
  update: async (id: number, payload: UpdateArrondissementPayload): Promise<ArrondissementListItem> => {
    const { data } = await api.put(`/arrondissements/${id}`, payload);
    return data.data || data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/arrondissements/${id}`);
  },
};