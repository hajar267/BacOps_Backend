import { api } from '@/lib/axios';
import { PermissionCatalog } from '@/types/role';

export const permissionService = {
  list: async (): Promise<PermissionCatalog> => {
    const { data } = await api.get('/permissions');
    return data;
  },
};