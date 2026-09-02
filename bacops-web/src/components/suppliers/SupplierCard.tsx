import { Factory, Pencil, Trash2 } from 'lucide-react';
import { SupplierItem } from '@/types/supplier';

interface SupplierCardProps {
  item: SupplierItem;
  onEdit: (item: SupplierItem) => void;
  onDelete: (item: SupplierItem) => void;
}

export function SupplierCard({ item, onEdit, onDelete }: SupplierCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background">
        {item.logoUrl ? (
          <img src={item.logoUrl} alt={item.nom} className="h-full w-full object-cover" />
        ) : (
          <Factory className="h-4 w-4 text-text-secondary/50" />
        )}
      </div>
      <p className="flex-1 text-sm font-medium text-text-primary">{item.nom}</p>
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
  );
}