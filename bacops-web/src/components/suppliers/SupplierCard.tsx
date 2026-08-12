import { Factory } from 'lucide-react';
import { SupplierItem } from '@/types/supplier';

interface SupplierCardProps {
  item: SupplierItem;
}

export function SupplierCard({ item }: SupplierCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background">
        {item.logoUrl ? (
          <img src={item.logoUrl} alt={item.nom} className="h-full w-full object-cover" />
        ) : (
          <Factory className="h-4 w-4 text-text-secondary/50" />
        )}
      </div>
      <p className="text-sm font-medium text-text-primary">{item.nom}</p>
    </div>
  );
}