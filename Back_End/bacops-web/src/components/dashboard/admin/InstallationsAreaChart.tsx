'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { InstallationsSeriesPoint, SeriesGranularity } from '@/types/dashboard';
import { formatPeriodLabel } from '@/lib/dashboardChartFormat';

interface InstallationsAreaChartProps {
  data: InstallationsSeriesPoint[];
  granularity: SeriesGranularity;
  isLoading?: boolean;
}

const chartConfig = {
  count: {
    label: 'Déployés',
    color: 'var(--color-brand-primary)',
  },
} satisfies ChartConfig;

export function InstallationsAreaChart({ data, granularity, isLoading }: InstallationsAreaChartProps) {
  const isEmpty = data.every((point) => point.count === 0);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Bacs déployés</h3>
        <p className="text-xs text-text-secondary">Installations effectuées sur la période</p>
      </div>

      {isLoading ? (
        <div className="h-[220px] w-full animate-pulse rounded-lg bg-background" />
      ) : data.length === 0 || isEmpty ? (
        <p className="py-10 text-center text-sm text-text-secondary">Aucune donnée disponible</p>
      ) : (
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0.02} />
              </linearGradient>
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
            <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11 }} />
            <ChartTooltip
              cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-sm">
                    <p className="mb-1 font-medium text-text-primary">
                      {formatPeriodLabel(label as string, granularity)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-primary" />
                      <span className="text-text-secondary">Déployés</span>
                      <span className="font-semibold text-text-primary">{payload[0].value}</span>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-brand-primary)"
              strokeWidth={2}
              fill="url(#fillCount)"
              dot={{ r: 3, fill: 'white', stroke: 'var(--color-brand-primary)', strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}