'use client';

import { Cell, Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BacStats } from '@/types/dashboard';

interface BacStatusDonutChartProps {
  stats: BacStats | null;
  isLoading?: boolean;
}

// Matches the 3 statuses actually shown on the stat cards (Total is excluded, it's not a slice).
const chartConfig = {
  en_service: { label: 'En service', color: 'var(--color-state-success)' },
  en_stock: { label: 'En stock', color: 'var(--color-brand-tertiary)' },
  perdu: { label: 'Perdu', color: 'var(--color-state-error)' },
} satisfies ChartConfig;

type StatusKey = keyof typeof chartConfig;

export function BacStatusDonutChart({ stats, isLoading }: BacStatusDonutChartProps) {
  const total = (stats?.en_service ?? 0) + (stats?.en_stock ?? 0) + (stats?.perdu ?? 0);

  const data: { status: StatusKey; value: number }[] = [
    { status: 'en_service', value: stats?.en_service ?? 0 },
    { status: 'en_stock', value: stats?.en_stock ?? 0 },
    { status: 'perdu', value: stats?.perdu ?? 0 },
  ];

  const percentageOf = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Statut des bacs</h3>
        <p className="text-xs text-text-secondary">Sur l&apos;ensemble du parc</p>
      </div>

      {isLoading ? (
        <div className="h-[220px] w-full animate-pulse rounded-lg bg-background" />
      ) : total === 0 ? (
        <p className="py-10 text-center text-sm text-text-secondary">Aucune donnée disponible</p>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto h-[220px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const key = payload[0].payload.status as StatusKey;
                const value = payload[0].value as number;

                return (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-sm">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: chartConfig[key].color }}
                    />
                    <span className="font-medium text-text-primary">{chartConfig[key].label}</span>
                    <span className="text-text-secondary">{value.toLocaleString('fr-FR')}</span>
                  </div>
                );
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              labelLine
              label={({ status, value }: { status: StatusKey; value: number }) =>
                `${chartConfig[status].label} ${percentageOf(value)}%`
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={chartConfig[entry.status].color}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}