export interface Role {
  name: string;
  permissions: string[];
}

export interface User {
  id: number;
  username: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}