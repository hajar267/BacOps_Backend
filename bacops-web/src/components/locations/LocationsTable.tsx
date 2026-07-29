'use client';

import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { ArrondissementListItem } from '@/types/location';

interface LocationsTableProps {
  items: ArrondissementListItem[];
  isLoading: boolean;
  onEdit: (item: ArrondissementListItem) => void;
  onDelete: (item: ArrondissementListItem) => void;
}

export function LocationsTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: LocationsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-bg border-b border-surface-border">
            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
              Ville
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
              Préfecture / Province
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
              Arrondissement
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-secondary">
                Chargement...
              </td>
            </tr>
          )}

          {!isLoading && items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-secondary">
                Aucun résultat trouvé
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.id} className="border-b border-surface-border last:border-0">
              <td className="px-6 py-4 text-sm font-medium text-text-primary">
                {item.prefectureVille.ville}
              </td>
              <td className="px-6 py-4 text-sm text-text-secondary">
                {item.prefectureVille.prefecture ?? (
                  <span className="italic text-text-secondary/70">—</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-text-primary">
                  <MapPin className="w-3 h-3" />
                  {item.name}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-brand-error hover:text-brand-error/80 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}