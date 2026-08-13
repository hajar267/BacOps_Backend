import { Tag } from 'lucide-react';
import { CadreCommandeItem } from '@/types/cadreCommande';

interface CadreCommandeCardProps {
  item: CadreCommandeItem;
}

export function CadreCommandeCard({ item }: CadreCommandeCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background">
        <Tag className="h-4 w-4 text-text-secondary/50" />
      </div>
      <p className="text-sm font-medium text-text-primary">{item.label}</p>
    </div>
  );
}