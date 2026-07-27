import { UserListItem } from '@/types/user';
import { api } from '@/lib/axios';

export const userService = {
  list: async (): Promise<UserListItem[]> => {
    // TODO: replace with real API call
    const { data } = await api.get('/users');
    return data;
    // return [
    //   { id: 1, username: 'admin', role: { name: 'admin', permissions: [] } },
    //   { id: 2, username: 'maga', role: { name: 'magasin', permissions: [] } },
    //   { id: 3, username: 'ins', role: { name: 'install', permissions: [] } },
    // ];
  },
};