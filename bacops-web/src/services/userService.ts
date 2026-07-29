import { UserListItem, CreateUserPayload, RoleOption, UpdateUserPayload, UpdatePasswordPayload} from '@/types/user';
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

    create: async (payload: CreateUserPayload): Promise<UserListItem> => {
    // TODO: replace with real API call
    const { data } = await api.post('/users', payload);
    return data;
    // return {
    //   id: Math.floor(Math.random() * 10000),
    //   username: payload.email.split('@')[0],
    //   role: { name: payload.roleName, permissions: [] },
    //     firstName: payload.firstName,
    //     lastName: payload.lastName,
    //     email: payload.email,
    //     active: true,
    // };
  },

  listRoles: async (): Promise<RoleOption[]> => {
    // TODO: replace with real API call, e.g. api.get('/roles')
    return [
      { name: 'admin', label: 'Admin' },
      { name: 'magasin', label: 'Magasinier' },
      { name: 'install', label: 'Installation' },
    ];
  },

  delete: async (id: number): Promise<void> => {
  // TODO: replace with real API call
  await api.delete(`/users/${id}`);
// console.log(`Deleting user with id: ${id}`);
//   await new Promise((resolve) => setTimeout(resolve, 700));

  // Uncomment to test the error UI
  // throw new Error('Delete failed');
},

update: async (
  id: number,
  payload: UpdateUserPayload
): Promise<UserListItem> => {

  // TODO replace with API
  const { data } = await api.put(`/users/${id}`, payload);
  return data;

  // await new Promise(resolve => setTimeout(resolve, 700));

  // return {
  //   id,
  //   username: payload.email.split("@")[0],
  //   firstName: payload.firstName,
  //   lastName: payload.lastName,
  //   email: payload.email,
  //   active: payload.active,
  //   role: {
  //     name: payload.roleName,
  //     permissions: [],
  //   },
  // };
},

updatePassword: async (
  id: number,
  payload: UpdatePasswordPayload
): Promise<void> => {
  // TODO: replace with real API call if your backend uses a different endpoint
  await api.patch(`/users/${id}/password`, payload);
  // console.log(`Updating password for user with id: ${id}`, payload);

  // await new Promise((resolve) => setTimeout(resolve, 700));
},

};