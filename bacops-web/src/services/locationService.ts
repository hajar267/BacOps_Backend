import { api } from '@/lib/axios';
import {
  ArrondissementListItem,
  PrefectureVilleTreeNode,
  CreateArrondissementPayload,
  UpdateArrondissementPayload,
} from '@/types/location';

interface RawArrondissementResponse {
  id: number;
  prefecture_ville_id: number;
  name: string;
  prefecture_ville: {
    id: number;
    prefecture: string | null;
    ville: string;
  };
}

function normalizeArrondissement(
  raw: RawArrondissementResponse
): ArrondissementListItem {
  return {
    id: raw.id,
    name: raw.name,
    prefectureVille: {
      id: raw.prefecture_ville.id,
      prefecture: raw.prefecture_ville.prefecture,
      ville: raw.prefecture_ville.ville,
    },
  };
}

function flattenTree(
  tree: PrefectureVilleTreeNode[]
): ArrondissementListItem[] {
  return tree.flatMap((pv) =>
    pv.arrondissements.map((a) => ({
      id: a.id,
      name: a.name,
      prefectureVille: {
        id: pv.id,
        prefecture: pv.prefecture,
        ville: pv.ville,
      },
    }))
  );
}

export const locationService = {
  list: async (): Promise<ArrondissementListItem[]> => {
    const { data } = await api.get<PrefectureVilleTreeNode[]>('/locations/tree');
    return flattenTree(data);
  },

  create: async (
    payload: CreateArrondissementPayload
  ): Promise<ArrondissementListItem> => {
    const { data } = await api.post<RawArrondissementResponse>(
      '/arrondissements',
      payload
    );
    return normalizeArrondissement(data);
  },

  update: async (
    id: number,
    payload: UpdateArrondissementPayload
  ): Promise<ArrondissementListItem> => {
    const { data } = await api.put<RawArrondissementResponse>(
      `/arrondissements/${id}`,
      payload
    );
    return normalizeArrondissement(data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/arrondissements/${id}`);
  },
};