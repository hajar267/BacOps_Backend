import { SupplierItem, CreateSupplierPayload } from '@/types/supplier';
import { api } from '@/lib/axios';

// let mockSuppliers: SupplierItem[] = [
//   { id: 1, nom: 'Sotramex' },
//   { id: 2, nom: 'Plastimo Maroc' },
//   { id: 3, nom: 'BacIndustries' },
// ];

// let mockNextId = 4;

export const supplierService = {
  list: async (): Promise<SupplierItem[]> => {
    const response = await api.get('/suppliers');
    return response.data.suppliers || response.data.data || response.data;
    // return Promise.resolve([...mockSuppliers]);
  },

  create: async (payload: CreateSupplierPayload): Promise<SupplierItem> => {
    const response = await api.post('/suppliers', payload);
    return response.data.supplier || response.data.data || response.data;
    // const created: SupplierItem = { id: mockNextId++, nom: payload.nom };
    // mockSuppliers = [...mockSuppliers, created];
    // return Promise.resolve(created);
  },
};
