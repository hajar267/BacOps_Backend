import { api } from '@/lib/axios';
import { Decharge } from '@/types/decharge';

export const dechargeService = {
  list: async (search?: string): Promise<Decharge[]> => {
    const { data } = await api.get<Decharge[]>('/decharges', {
      params: search ? { search } : {},
    });
    return data;
  },
};