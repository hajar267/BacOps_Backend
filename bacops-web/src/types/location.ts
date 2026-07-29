export interface ArrondissementListItem {
  id: number;
  name: string;
  prefectureVille: {
    id: number;
    prefecture: string | null; // null = simple commune, not split
    ville: string;
  };
}

export interface PrefectureVilleTreeNode {
  id: number;
  prefecture: string | null;
  ville: string;
  arrondissements: {
    id: number;
    name: string;
  }[];
}

export interface CreateArrondissementPayload {
  ville: string;
  prefecture: string | null;
  name: string;
}

export interface UpdateArrondissementPayload {
//   ville: string;
//   prefecture: string | null;
  name: string;
}