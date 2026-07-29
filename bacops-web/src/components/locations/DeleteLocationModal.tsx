'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { locationService } from '@/services/locationService';
import { ArrondissementListItem } from '@/types/location';

interface DeleteLocationModalProps {
  arrondissement: ArrondissementListItem;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export function DeleteLocationModal({
  arrondissement,
  onClose,
  onDeleted,
}: DeleteLocationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await locationService.delete(arrondissement.id);
      onDeleted(arrondissement.id);
      onClose();
    } catch (err) {
      setError("Suppression impossible — vérifiez qu'aucune installation ne l'utilise.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border border-surface-border w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-brand-error" />
          <h2 className="text-lg font-bold text-text-primary">Confirmer la suppression</h2>
        </div>

        <p className="text-sm text-text-secondary mb-6">
          Voulez-vous vraiment supprimer{' '}
          <span className="font-semibold text-text-primary">{arrondissement.name}</span>
          {' '}({arrondissement.prefectureVille.ville}) ? Cette action est irréversible.
        </p>

        {error && (
          <p className="text-sm text-brand-error font-medium mb-4">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-bg transition-colors"
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-error hover:bg-brand-error/90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}