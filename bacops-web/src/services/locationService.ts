import { api } from '@/lib/axios';
import { ArrondissementListItem, CreateArrondissementPayload, UpdateArrondissementPayload } from '@/types/location';

export const locationService = {
  list: async (): Promise<ArrondissementListItem[]> => {
    const { data } = await api.get('/arrondissements');
    const items = data.data || data;
    return items.map((raw: any) => ({
      id: raw.id,
      name: raw.name,
      prefectureVille: {
        id: raw.ville?.id ?? 0,
        prefecture: raw.prefecture?.name ?? null,
        ville: raw.ville?.name ?? '',
      },
    }));
  },

  create: async (
    payload: CreateArrondissementPayload
  ): Promise<ArrondissementListItem> => {
    const { data } = await api.post('/arrondissements', payload);
    const raw = data.data || data;
    return {
      id: raw.id,
      name: raw.name,
      prefectureVille: {
        id: raw.ville?.id ?? 0,
        prefecture: raw.prefecture?.name ?? null,
        ville: raw.ville?.name ?? '',
      },
    };
  },

  update: async (
    id: number,
    payload: UpdateArrondissementPayload
  ): Promise<ArrondissementListItem> => {
    const { data } = await api.put(`/arrondissements/${id}`, payload);
    const raw = data.data || data;
    return {
      id: raw.id,
      name: raw.name,
      prefectureVille: {
        id: raw.ville?.id ?? 0,
        prefecture: raw.prefecture?.name ?? null,
        ville: raw.ville?.name ?? '',
      },
    };
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/arrondissements/${id}`);
  },
};