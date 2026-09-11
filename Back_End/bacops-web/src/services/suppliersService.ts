import { SupplierItem, CreateSupplierPayload, UpdateSupplierPayload } from '@/types/supplier';
import { api } from '@/lib/axios';

export const supplierService = {
  list: async (): Promise<SupplierItem[]> => {
    const response = await api.get('/suppliers');
    return response.data.suppliers || response.data.data || response.data;
  },

  create: async (payload: CreateSupplierPayload): Promise<SupplierItem> => {
    const formData = new FormData();
    formData.append('nom', payload.nom);
    if (payload.logo) {
      formData.append('logo', payload.logo);
    }

    const response = await api.post('/suppliers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.supplier || response.data.data || response.data;
  },

  update: async (id: number, payload: UpdateSupplierPayload): Promise<SupplierItem> => {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // method-spoof: native PUT drops file uploads in PHP
    if (payload.nom !== undefined) {
      formData.append('nom', payload.nom);
    }
    if (payload.logo) {
      formData.append('logo', payload.logo);
    }

    const response = await api.post(`/suppliers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.supplier || response.data.data || response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
