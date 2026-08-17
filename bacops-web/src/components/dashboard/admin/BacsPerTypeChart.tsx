'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BacPerTypeItem } from '@/types/dashboard';

interface BacsPerTypeChartProps {
  data: BacPerTypeItem[];
  isLoading?: boolean;
}

const chartConfig = {
  enStock: {
    label: 'En stock',
    color: 'var(--color-brand-primary)',
  },
} satisfies ChartConfig;

export function BacsPerTypeChart({ data, isLoading }: BacsPerTypeChartProps) {
  const chartData = data.map((item) => ({
    label: formatLabel(item.bacType),
    enStock: item.enStock,
  }));

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Types de bacs</h3>
        <p className="text-xs text-text-secondary">
          Répartition du stock disponible par référence
        </p>
      </div>

      {isLoading ? (
        <div className="h-[220px] w-full animate-pulse rounded-lg bg-background" />
      ) : chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-secondary">Aucune donnée disponible</p>
      ) : (
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-border)" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="enStock" fill="var(--color-enStock)" radius={4} barSize={22} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

function formatLabel(bacType: BacPerTypeItem['bacType']): string {
  if (!bacType) return 'Sans type';
  return [bacType.nature, bacType.capacite, bacType.matiere].filter(Boolean).join(' ');
}