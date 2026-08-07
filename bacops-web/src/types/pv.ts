export interface PV {
  id: number;
  pvNumber: string;
  contractNum: string;
  startDate: string | null;
  endDate: string | null;
  filterCapacite: string | null;
  filterMatiere: string | null;
  signedPdfUrl: string | null;
  isSigned: boolean;
  signedAt: string | null;
  createdAt: string;
}

export interface PreviewBacItem {
  nature: string;
  capacite: string;
  matiere: string;
  serialNumber: string;
  arrond: string | null;
  installedAt: string;
  address: string | null;
  x: number | null;
  y: number | null;
  photo: string | null;
}

export interface PvFilters {
  nature?: string;
  capacite?: string;
  matiere?: string;
  arrond?: string;
  arrondissementId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreatePvPayload {
  contractNum?: string;
  filterCapacite?: string;
  filterMatiere?: string;
  startDate?: string;
  endDate?: string;
}
