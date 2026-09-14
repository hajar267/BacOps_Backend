import { api } from '@/lib/axios';
import { ArrondissementListItem, CreateArrondissementPayload, UpdateArrondissementPayload } from '@/types/location';

interface RawArrondissement {
  id?: number;
  name?: string;
  ville?: { id?: number; name?: string } | null;
  prefecture?: { id?: number; name?: string } | null;
}

export const locationService = {
  list: async (): Promise<ArrondissementListItem[]> => {
    const { data } = await api.get('/arrondissements');
    const items = data.data || data;
    return items.map((raw: RawArrondissement) => ({
      id: raw.id,
      name: raw.name,
      ville: {
        id: raw.ville?.id ?? 0,
        name: raw.ville?.name ?? '',
      },
      prefecture: raw.prefecture
        ? { id: raw.prefecture.id, name: raw.prefecture.name }
        : null,
    }));
  },

  searchArrondissements: async (search: string): Promise<ArrondissementListItem[]> => {
    const { data } = await api.get('/search/arrondissements', { params: { search } });
    const items = data.data || data;
    return items.map((raw: RawArrondissement) => ({
      id: raw.id ?? 0,
      name: raw.name ?? '',
      ville: {
        id: raw.ville?.id ?? 0,
        name: raw.ville?.name ?? '',
      },
      prefecture: raw.prefecture
        ? { id: raw.prefecture.id ?? 0, name: raw.prefecture.name ?? '' }
        : null,
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
      ville: {
        id: raw.ville?.id ?? 0,
        name: raw.ville?.name ?? '',
      },
      prefecture: raw.prefecture
        ? { id: raw.prefecture.id, name: raw.prefecture.name }
        : null,
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
      ville: {
        id: raw.ville?.id ?? 0,
        name: raw.ville?.name ?? '',
      },
      prefecture: raw.prefecture
        ? { id: raw.prefecture.id, name: raw.prefecture.name }
        : null,
    };
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/arrondissements/${id}`);
  },
};