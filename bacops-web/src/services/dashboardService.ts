// services/dashboardService.ts

import { api } from '@/lib/axios';
import { DashboardFilters, DashboardStatsResponse } from '@/types/dashboard';

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
};