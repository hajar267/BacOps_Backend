'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import {
  BacPerTypeItem,
  BacValueSeriesResponse,
  DashboardFilters as DashboardFiltersType,
  DashboardStatsResponse,
  InstallationsSeriesResponse,
} from '@/types/dashboard';
import { DashboardFilters } from '@/components/dashboard/admin/DashboardFilters';
import { BacStatsCards } from '@/components/dashboard/admin/BacStatsCards';
import { RfidStatsCards } from '@/components/dashboard/admin/RfidStatsCards';
import { BacsPerTypeChart } from '@/components/dashboard/admin/BacsPerTypeChart';
import { BacStatusDonutChart } from '@/components/dashboard/admin/BacStatusDonutChart';
import { InstallationsAreaChart } from '@/components/dashboard/admin/InstallationsAreaChart';
import { StackedValueAreaChart } from '@/components/dashboard/admin/StackedValueAreaChart';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFiltersType>({});
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bacsPerType, setBacsPerType] = useState<BacPerTypeItem[]>([]);
  const [isBacsPerTypeLoading, setIsBacsPerTypeLoading] = useState(true);

  const [installations, setInstallations] = useState<InstallationsSeriesResponse | null>(null);
  const [isInstallationsLoading, setIsInstallationsLoading] = useState(true);

  const [bacValue, setBacValue] = useState<BacValueSeriesResponse | null>(null);
  const [isBacValueLoading, setIsBacValueLoading] = useState(true);

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

  // Also driven by `filters` — unlike bacsPerType, this endpoint respects from/to and the bac-type filters.
  useEffect(() => {
    let cancelled = false;

    setIsInstallationsLoading(true);

    dashboardService
      .installations(filters)
      .then((res) => {
        if (!cancelled) setInstallations(res);
      })
      .catch(() => {
        if (!cancelled) setInstallations(null);
      })
      .finally(() => {
        if (!cancelled) setIsInstallationsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Also driven by `filters` — bucket range respects from/to, though each point's
  // value is cumulative-to-date rather than period activity (see dashboardService.bacValue).
  useEffect(() => {
    let cancelled = false;

    setIsBacValueLoading(true);

    dashboardService
      .bacValue(filters)
      .then((res) => {
        if (!cancelled) setBacValue(res);
      })
      .catch(() => {
        if (!cancelled) setBacValue(null);
      })
      .finally(() => {
        if (!cancelled) setIsBacValueLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Independent of `filters` — the bacs-per-type endpoint takes no query params.
  useEffect(() => {
    let cancelled = false;

    dashboardService
      .bacsPerType()
      .then((res) => {
        if (!cancelled) setBacsPerType(res);
      })
      .catch(() => {
        if (!cancelled) setBacsPerType([]);
      })
      .finally(() => {
        if (!cancelled) setIsBacsPerTypeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
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

      <div className="space-y-6">
        <BacStatsCards stats={data?.bacs ?? null} isLoading={isLoading} />
        <RfidStatsCards stats={data?.rfids ?? null} isLoading={isLoading} />

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <BacsPerTypeChart data={bacsPerType} isLoading={isBacsPerTypeLoading} />
          <BacStatusDonutChart stats={data?.bacs ?? null} isLoading={isLoading} />
        </div>

        <InstallationsAreaChart
          data={installations?.series ?? []}
          granularity={installations?.granularity ?? 'monthly'}
          isLoading={isInstallationsLoading}
        />

        <StackedValueAreaChart
          data={bacValue?.series ?? []}
          granularity={bacValue?.granularity ?? 'monthly'}
          isLoading={isBacValueLoading}
        />
      </div>
    </div>
  );
}