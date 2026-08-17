'use client';

// import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RfidStats } from '@/types/dashboard';

interface RfidStatsCardsProps {
  stats: RfidStats | null;
  isLoading?: boolean;
}

export function RfidStatsCards({ stats, isLoading }: RfidStatsCardsProps) {
//   const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">RFID</h3>
        <button
        //   onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline"
        >
          {/* {expanded ? 'Voir moins' : 'Voir plus'}
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />} */}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={stats?.total} isLoading={isLoading} color="neutral" />
        <StatCard label="Disponible" value={stats?.disponible} isLoading={isLoading} color="tertiary" />
        <StatCard label="En service" value={stats?.en_service} isLoading={isLoading} color="success" />
        <StatCard label="Perdu" value={stats?.perdu} isLoading={isLoading} color="error" />

        {/* {expanded && (
          <>
          </>
        )} */}
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