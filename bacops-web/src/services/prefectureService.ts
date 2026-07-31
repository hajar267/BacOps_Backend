import { api } from '@/lib/axios';
import { PrefectureListItem, CreatePrefecturePayload, UpdatePrefecturePayload } from '@/types/location';

export const prefectureService = {
  list: async (): Promise<PrefectureListItem[]> => {
    const { data } = await api.get('/prefectures');
    return data.data || data;
  },
  create: async (payload: CreatePrefecturePayload): Promise<PrefectureListItem> => {
    const { data } = await api.post('/prefectures', payload);
        return data.data || data;
  },
  update: async (id: number, payload: UpdatePrefecturePayload): Promise<PrefectureListItem> => {
    const { data } = await api.put(`/prefectures/${id}`, payload);
    return data.data || data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/prefectures/${id}`);
  },
};