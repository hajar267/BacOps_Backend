import { Role } from './auth';

export interface UserListItem {
  id: number;
  username: string;
  role: Role;
}
