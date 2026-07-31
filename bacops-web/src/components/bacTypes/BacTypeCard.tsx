import { BacTypeItem } from '@/types/bacType';

interface BacTypeCardProps {
  item: BacTypeItem;
}

export function BacTypeCard({ item }: BacTypeCardProps) {
  const details = [item.capacite, item.matiere, item.color].filter(
    (part): part is string => Boolean(part && part.trim())
  );

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            item.isActive ? 'bg-state-success' : 'bg-state-error'
          }`}
        />
        <span className="rounded-full bg-brand-primary/15 px-2 py-1 text-[11px] font-bold text-text-primary">
          {item.nature.toUpperCase()}
        </span>
      </div>
      <p className="text-sm font-medium text-text-primary">{details.join(' · ')}</p>
      {item.variante && (
        <p className="mt-1 text-xs text-text-secondary">{item.variante}</p>
      )}
    </div>
  );
}