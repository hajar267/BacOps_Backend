import { Pencil, Trash2 } from 'lucide-react';
import { BacTypeItem } from '@/types/bacType';

interface BacTypeCardProps {
  item: BacTypeItem;
  onEdit: (item: BacTypeItem) => void;
  onDelete: (item: BacTypeItem) => void;
}

export function BacTypeCard({ item, onEdit, onDelete }: BacTypeCardProps) {
  const details = [item.capacite, item.matiere, item.color].filter(
    (part): part is string => Boolean(part && part.trim())
  );

  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              item.isActive ? 'bg-state-success' : 'bg-state-error'
            }`}
          />
          <span className="rounded-full bg-brand-primary/15 px-2 py-1 text-[11px] font-bold text-text-primary">
            {item.nature.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
            aria-label="Modifier"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-state-error/10 hover:text-state-error"
            aria-label="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium text-text-primary">{details.join(' · ')}</p>
      {item.variante && (
        <p className="mt-1 text-xs text-text-secondary">{item.variante}</p>
      )}
    </div>
  );
}