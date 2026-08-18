'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BacValueSeriesPoint, SeriesGranularity } from '@/types/dashboard';
import { formatPeriodLabel } from '@/lib/dashboardChartFormat';

interface StackedValueAreaChartProps {
  data: BacValueSeriesPoint[];
  granularity: SeriesGranularity;
  isLoading?: boolean;
}

const chartConfig = {
  en_stock: { label: 'En stock', color: 'var(--color-brand-primary)' },
  en_service: { label: 'En service', color: 'var(--color-state-success)' },
  perdu: { label: 'Perdu / Rebut', color: 'var(--color-state-error)' },
} satisfies ChartConfig;

// Stack order: bottom -> top. Kept separate from chartConfig's key order
// so the render/legend order and the visual stacking order can differ if needed.
const seriesOrder = ['en_stock', 'en_service', 'perdu'] as const;
type SeriesKey = (typeof seriesOrder)[number];

function formatMAD(value: number): string {
  return `${new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(value)} MAD`;
}

export function StackedValueAreaChart({ data, granularity, isLoading }: StackedValueAreaChartProps) {
  const chartData = data.map((point) => ({
    label: point.label,
    en_stock: point.values.en_stock,
    en_service: point.values.en_service,
    // perdu + mis_en_rebut combined, matching how "Perdu" reads elsewhere on the dashboard
    perdu: point.values.perdu + point.values.mis_en_rebut,
  }));

  const isEmpty = chartData.every((p) => p.en_stock + p.en_service + p.perdu === 0);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Valeur des bacs par statut</h3>
        <p className="text-xs text-text-secondary">Valeur cumulée du parc, à date</p>
      </div>

      {isLoading ? (
        <div className="h-[240px] w-full animate-pulse rounded-lg bg-background" />
      ) : chartData.length === 0 || isEmpty ? (
        <p className="py-10 text-center text-sm text-text-secondary">Aucune donnée disponible</p>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={chartData} margin={{ left: -12, right: 12, top: 8 }}>
              <defs>
                {seriesOrder.map((key) => (
                  <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.55} />
                    <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.08} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatPeriodLabel(value, granularity)}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fontSize: 10.5 }}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const total = payload.reduce((sum, p) => sum + (p.value as number), 0);

                  return (
                    <div className="min-w-[180px] rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-sm">
                      <p className="mb-1.5 font-medium text-text-primary">
                        {formatPeriodLabel(label as string, granularity)}
                      </p>
                      <div className="space-y-1">
                        {seriesOrder
                          .slice()
                          .reverse()
                          .map((key) => {
                            const entry = payload.find((p) => p.dataKey === key);
                            if (!entry) return null;
                            return (
                              <div key={key} className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: chartConfig[key as SeriesKey].color }}
                                />
                                <span className="text-text-secondary">
                                  {chartConfig[key as SeriesKey].label}
                                </span>
                                <span className="ml-auto font-semibold text-text-primary">
                                  {formatMAD(entry.value as number)}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between border-t border-border pt-1.5">
                        <span className="text-text-secondary">Total</span>
                        <span className="font-semibold text-text-primary">{formatMAD(total)}</span>
                      </div>
                    </div>
                  );
                }}
              />
              {seriesOrder.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="value"
                  stroke={chartConfig[key].color}
                  strokeWidth={1.5}
                  fill={`url(#fill-${key})`}
                />
              ))}
            </AreaChart>
          </ChartContainer>

          {/* Legend: what each color means, since the stack makes color the only cue */}
          <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3">
            {seriesOrder.map((key) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: chartConfig[key].color }}
                />
                {chartConfig[key].label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}