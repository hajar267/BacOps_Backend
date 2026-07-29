import { Role } from './auth';

export interface UserListItem {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  active: boolean;
  role: Role;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  active: boolean;
}

export interface RoleOption {
  name: string;
  label: string;
}

export interface EditUserModalProps {
    user: UserListItem;

    onClose: () => void;

    onUpdated: (user: UserListItem) => void;
}

export interface UpdatePasswordPayload {
  password: string;
  passwordConfirmation: string;
}
