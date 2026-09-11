// lib/dashboardChartFormat.ts

import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SeriesGranularity } from '@/types/dashboard';

export function formatPeriodLabel(label: string, granularity: SeriesGranularity): string {
  try {
    switch (granularity) {
      case 'hourly':
        return format(parse(label, 'yyyy-MM-dd HH:00', new Date()), 'HH:mm');
      case 'daily':
      case 'weekly':
        return format(parse(label, 'yyyy-MM-dd', new Date()), 'dd MMM', { locale: fr });
      case 'monthly':
        return format(parse(label, 'yyyy-MM', new Date()), 'MMM yyyy', { locale: fr });
      case 'yearly':
      default:
        return label;
    }
  } catch {
    return label;
  }
}