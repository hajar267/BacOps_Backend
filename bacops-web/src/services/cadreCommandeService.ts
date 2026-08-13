import { CadreCommandeItem, CreateCadreCommandePayload } from '@/types/cadreCommande';
import { api } from '@/lib/axios';

export const cadreCommandeService = {
  list: async (): Promise<CadreCommandeItem[]> => {
    const response = await api.get('/cadre-commandes');
    return response.data.cadreCommandes || response.data.data || response.data;
  },

  create: async (payload: CreateCadreCommandePayload): Promise<CadreCommandeItem> => {
    const response = await api.post('/cadre-commandes', payload);
    return response.data.cadreCommande || response.data.data || response.data;
  },
};