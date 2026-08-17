import { BacStats } from '@/types/dashboard';

interface BacStatsCardsProps {
  stats: BacStats | null;
  isLoading?: boolean;
}

export function BacStatsCards({ stats, isLoading }: BacStatsCardsProps) {
  return (
    <section>
      <h3 className="mb-2.5 text-sm font-semibold text-text-primary">Bacs</h3>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={stats?.total} isLoading={isLoading} color="neutral" />
        <StatCard label="En stock" value={stats?.en_stock} isLoading={isLoading} color="tertiary" />
        <StatCard label="En service" value={stats?.en_service} isLoading={isLoading} color="success" />
        <StatCard label="Perdu" value={stats?.perdu} isLoading={isLoading} color="error" />
      </div>
    </section>
  );
}

type AccentColor = 'tertiary' | 'success' | 'error' | 'neutral';

const colorClasses: Record<AccentColor, { bg: string; accent: string }> = {
  tertiary: { bg: 'bg-brand-tertiary/10', accent: 'bg-brand-tertiary' },
  success: { bg: 'bg-state-success/10', accent: 'bg-state-success' },
  error: { bg: 'bg-state-error/10', accent: 'bg-state-error' },
  neutral: { bg: 'bg-background', accent: 'bg-border' },
};

interface StatCardProps {
  label: string;
  value?: number;
  isLoading?: boolean;
  color: AccentColor;
}

function StatCard({ label, value, isLoading, color }: StatCardProps) {
  const { bg, accent } = colorClasses[color];

  return (
    <div className={`overflow-hidden rounded-xl border border-border ${bg}`}>
      <div className="p-3.5">
        <span className="text-xs text-text-secondary">{label}</span>
        {isLoading ? (
          <div className="mt-2 h-6 w-16 animate-pulse rounded bg-white/60" />
        ) : (
          <p className="mt-1.5 text-xl font-bold text-text-primary">
            {(value ?? 0).toLocaleString('fr-FR')}
          </p>
        )}
      </div>
      <div className={`h-1.5 w-full ${accent}`} />
    </div>
  );
}