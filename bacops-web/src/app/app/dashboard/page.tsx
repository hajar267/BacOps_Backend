'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { DashboardFilters as DashboardFiltersType, DashboardStatsResponse } from '@/types/dashboard';
import { DashboardFilters } from '@/components/dashboard/admin/DashboardFilters';
import { BacStatsCards } from '@/components/dashboard/admin/BacStatsCards';
import { RfidStatsCards } from '@/components/dashboard/admin/RfidStatsCards';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersType>({});
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    dashboardService
      .stats(filters)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError('Erreur lors du chargement des statistiques.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header row: greeting + filter trigger, same slot the mobile "Filtres" button occupies */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Bonjour, Hajar</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Aperçu des opérations</p>
        </div>
        <DashboardFilters value={filters} onApply={setFilters} />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-brand-error/10 px-4 py-3 text-sm text-brand-error">
          {error}
        </div>
      )}

      {/* Stat cards — mirrors the mobile stack: Bacs, then RFID */}
      <div className="space-y-6">
        <BacStatsCards stats={data?.bacs ?? null} isLoading={isLoading} />
        <RfidStatsCards stats={data?.rfids ?? null} isLoading={isLoading} />
      </div>

      {/* Chart panels (Types de bacs, Statut, Bacs déployés, Valeur par statut)
          go below the stat cards, same order as the mobile screens.
          Not built yet — say the word and I'll do DashboardCharts.tsx next,
          wired to bacTypeService.bacsPerType / installations / bacValue the same way. */}
    </div>
  );
}