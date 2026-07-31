export interface BacTypeItem {
  id: number;
  nature: string;
  capacite: string;
  matiere: string;
  color: string | null;
  variante: string | null;
  isActive: boolean;
}

export interface CreateBacTypePayload {
  nature: string;
  capacite?: string | null;
  variante?: string | null;
  matiere?: string | null;
  color?: string | null;
}

export interface BacTypeSuggestions {
  natures: string[];
  capacites: string[];
  matieres: string[];
  colors: string[];
}
