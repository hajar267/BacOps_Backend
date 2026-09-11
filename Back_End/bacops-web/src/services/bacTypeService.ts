// src/services/bacTypeService.ts
import { api } from '@/lib/axios';
import { BacTypeItem, CreateBacTypePayload, UpdateBacTypePayload } from '@/types/bacType';

interface RawBacType {
  id: number;
  nature: string;
  capacite: string;
  matiere: string;
  color: string | null;
  variante: string | null;
  is_active: boolean;
}

function normalize(raw: RawBacType): BacTypeItem {
  return {
    id: raw.id,
    nature: raw.nature,
    capacite: raw.capacite,
    matiere: raw.matiere,
    color: raw.color,
    variante: raw.variante,
    isActive: raw.is_active,
  };
}

export const bacTypeService = {
  list: async (): Promise<BacTypeItem[]> => {
    const response = await api.get('/bac-types/bac-types');
    const raw: RawBacType[] = response.data.bacTypes || response.data.data || response.data;
    return Array.isArray(raw) ? raw.map(normalize) : [];
  },

  create: async (payload: CreateBacTypePayload): Promise<BacTypeItem> => {
    const response = await api.post('/bac-types/bac-types', payload);
    const raw: RawBacType = response.data.bacType || response.data.data || response.data;
    return normalize(raw);
  },

  natures: async (): Promise<string[]> => {
    const response = await api.get('/bac-types/natures');
    return response.data.natures || response.data.data || response.data;
  },

  capacites: async (): Promise<string[]> => {
    const response = await api.get('/bac-types/capacites');
    return response.data.capacites || response.data.data || response.data;
  },

  matieres: async (): Promise<string[]> => {
    const response = await api.get('/bac-types/matieres');
    return response.data.matieres || response.data.data || response.data;
  },

  colors: async (): Promise<string[]> => {
    const response = await api.get('/bac-types/colors');
    return response.data.colors || response.data.data || response.data;
  },

    update: async (id: number, payload: UpdateBacTypePayload): Promise<BacTypeItem> => {
    const response = await api.put(`/bac-types/bac-types/${id}`, payload);
    const raw: RawBacType = response.data.bacType || response.data.data || response.data;
    return normalize(raw);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/bac-types/bac-types/${id}`);
  },
};