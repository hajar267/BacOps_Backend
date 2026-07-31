export interface VilleListItem {
  id: number;
  name: string;
  prefecturesCount: number;
}

export interface PrefectureListItem {
  id: number;
  name: string;
  ville: { id: number; name: string };
}

export interface ArrondissementListItem {
  id: number;
  name: string;
  ville: { id: number; name: string };
  prefecture: { id: number; name: string } | null;
}

export interface CreateVillePayload { name: string; }
export interface UpdateVillePayload { name: string; }

export interface CreatePrefecturePayload { ville_id: number; name: string; }
export interface UpdatePrefecturePayload { ville_id: number; name: string; }

export interface CreateArrondissementPayload {
  ville_id: number;
  prefecture_id: number | null;
  name: string;
}
export interface UpdateArrondissementPayload {
  ville_id: number;
  prefecture_id: number | null;
  name: string;
}
