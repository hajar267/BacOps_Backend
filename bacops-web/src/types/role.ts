export interface PermissionCatalog {
  [module: string]: string[];
}

export interface RoleListItem {
  id: number;
  name: string;
  permissions: string[]; // ["*"] for full access, or specific strings otherwise
}

export interface CreateRolePayload {
  name: string;
  permissions: string[];
}

export interface UpdateRolePayload {
  name: string;
  permissions: string[];
}

export interface PermissionItem {
  name: string;
  label: string;
  group: string;
}
