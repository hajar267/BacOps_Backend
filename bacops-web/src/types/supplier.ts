export interface SupplierItem {
  id: number;
  nom: string;
  logoUrl: string | null;
}

export interface CreateSupplierPayload {
  nom: string;
  logo?: File | null;
}

export interface SupplierItem {
  id: number;
  nom: string;
  logoUrl: string | null;
}

export interface CreateSupplierPayload {
  nom: string;
  logo?: File | null;
}

export interface UpdateSupplierPayload {
  nom?: string;
  logo?: File | null;
}
