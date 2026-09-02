'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cadreCommandeService } from '@/services/cadreCommandeService';
import { CadreCommandeItem } from '@/types/cadreCommande';

interface CadreCommandeDeleteModalProps {
  item: CadreCommandeItem;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export function CadreCommandeDeleteModal({ item, onClose, onDeleted }: CadreCommandeDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await cadreCommandeService.remove(item.id);
      onDeleted(item.id);
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Suppression impossible.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/45 p-4">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary transition-colors hover:text-text-primary"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-state-error" />
          <h2 className="text-base font-semibold text-text-primary">Supprimer le cadre de commande</h2>
        </div>

        <p className="mb-6 text-sm text-text-secondary">
          Voulez-vous vraiment supprimer <span className="font-semibold text-text-primary">{item.label}</span> ?
        </p>

        {error && (
          <p className="mb-4 text-sm font-medium text-state-error">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-background"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-state-error px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-state-error/90 active:scale-[0.98] disabled:opacity-60"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}