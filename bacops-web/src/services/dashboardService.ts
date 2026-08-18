// services/dashboardService.ts

import { api } from '@/lib/axios';
import {
  BacPerTypeItem,
  DashboardFilters,
  DashboardStatsResponse,
  InstallationsSeriesResponse,
  BacValueSeriesResponse,
} from '@/types/dashboard';

function buildParams(filters: DashboardFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.nature) params.nature = filters.nature;
  if (filters.capacite) params.capacite = filters.capacite;
  if (filters.matiere) params.matiere = filters.matiere;
  if (filters.variante) params.variante = filters.variante;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  return params;
}

export const dashboardService = {
  stats: async (filters: DashboardFilters = {}): Promise<DashboardStatsResponse> => {
    const response = await api.get('/dashboard/stats', { params: buildParams(filters) });
    return response.data;
  },

  // No filters here on purpose: DashboardController::bacsPerType() takes no Request,
  // it always reads live from StockSummaryBac regardless of any date/type filters applied elsewhere.
  bacsPerType: async (): Promise<BacPerTypeItem[]> => {
    const response = await api.get('/dashboard/bacs-per-type');
    return Array.isArray(response.data) ? response.data : [];
  },

    // Respects from/to and the bac-type filters properly (whereBetween on installed_at),
  // so this one *should* refetch whenever `filters` changes.
  installations: async (filters: DashboardFilters = {}): Promise<InstallationsSeriesResponse> => {
    const response = await api.get('/dashboard/installations', { params: buildParams(filters) });
    return response.data;
  },

    // `from` shapes the bucket range shown, but each bucket's values are cumulative-to-date
  // (see DashboardService::getBacValueSeries) — not activity strictly within the bucket.
  bacValue: async (filters: DashboardFilters = {}): Promise<BacValueSeriesResponse> => {
    const response = await api.get('/dashboard/bac-value', { params: buildParams(filters) });
    return response.data;
  },


};