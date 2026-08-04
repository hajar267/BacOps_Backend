import { SupplierItem } from '@/types/supplier';

interface SupplierCardProps {
  item: SupplierItem;
}

export function SupplierCard({ item }: SupplierCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-sm font-medium text-text-primary">{item.nom}</p>
    </div>
  );
}