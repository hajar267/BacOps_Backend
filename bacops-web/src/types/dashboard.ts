// types/dashboard.ts

export interface DashboardFilters {
  nature?: string;
  capacite?: string;
  matiere?: string;
  variante?: string;
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd
}

export interface BacStats {
  total: number;
  en_stock: number;
  en_service: number;
  en_reparation: number;
  perdu: number;
  mis_en_rebut: number;
}

export interface RfidStats {
  total: number;
  disponible: number;
  en_service: number;
  perdu: number;
}

export interface DashboardStatsResponse {
  bacs: BacStats;
  rfids: RfidStats;
}

// Matches DashboardService::getBacsPerType() -> StockSummaryBac + bacType relation
export interface BacTypeSummary {
  id: number;
  nature: string;
  capacite: string;
  variante: string | null;
  matiere: string;
  color: string | null;
}

export interface BacPerTypeItem {
  enStock: number;
  bacType: BacTypeSummary | null;
}
