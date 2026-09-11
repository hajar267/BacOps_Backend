interface StatusBadgeProps {
  status: string;
}

const STATUS_LABELS: Record<string, string> = {
  en_service: 'En service',
  hors_service: 'Hors service',
  en_stock: 'En stock',
};

const STATUS_STYLES: Record<string, string> = {
  en_service: 'bg-state-success/15 text-state-success',
  hors_service: 'bg-state-error/15 text-state-error',
  en_stock: 'bg-brand-tertiary/15 text-brand-tertiary',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const style = STATUS_STYLES[status] ?? 'bg-border/50 text-text-secondary';

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}