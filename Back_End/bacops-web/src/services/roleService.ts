import { api } from '@/lib/axios';
import { RoleListItem, CreateRolePayload, UpdateRolePayload, PermissionItem } from '@/types/role';

export const roleService = {
list: async (): Promise<RoleListItem[]> => {
    const response = await api.get('/roles');
    
    // Check if Laravel wrapped it in a 'data' key, otherwise fallback to the raw body
    return response.data.data || response.data;
  },

  listPermissions: async (): Promise<PermissionItem[]> => {
    const response = await api.get('/permissions');
    return response.data.data || response.data;
  },

  create: async (payload: CreateRolePayload): Promise<RoleListItem> => {
    const response = await api.post('/roles', payload);
    return response.data.data || response.data;
  },

  update: async (id: number, payload: UpdateRolePayload): Promise<RoleListItem> => {
    const response = await api.put(`/roles/${id}`, payload);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },
};