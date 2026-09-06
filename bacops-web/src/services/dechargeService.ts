import { api } from '@/lib/axios';
import { Decharge } from '@/types/decharge';

export const dechargeService = {
  list: async (): Promise<Decharge[]> => {
    const { data } = await api.get<Decharge[]>('/decharges');
    return data;
  },
};