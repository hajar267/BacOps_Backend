import { api } from '@/lib/axios';
import { PV, PreviewBacItem, PvFilters, CreatePvPayload } from '@/types/pv';

export const pvService = {
  list: async (): Promise<PV[]> => {
    const { data } = await api.get<PV[]>('/pv');
    return data;
  },

  preview: async (filters: PvFilters): Promise<PreviewBacItem[]> => {
    const { data } = await api.get<PreviewBacItem[]>('/pv/preview', { params: filters });
    return data;
  },

  create: async (payload: CreatePvPayload): Promise<PV> => {
    const { data } = await api.post<PV>('/pv/download', payload); // ← fixed
    return data;
  },

  uploadSigned: async (id: number, file: File): Promise<PV> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<PV>(`/pv/${id}/signed`, formData, { // ← fixed
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};