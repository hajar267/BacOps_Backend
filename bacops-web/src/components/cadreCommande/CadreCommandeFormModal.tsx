'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cadreCommandeService } from '@/services/cadreCommandeService';
import { CadreCommandeItem } from '@/types/cadreCommande';

interface CadreCommandeFormModalProps {
  mode?: 'create' | 'edit';
  initialData?: CadreCommandeItem;
  onClose: () => void;
  onSaved: (saved: CadreCommandeItem) => void;
}

export function CadreCommandeFormModal({ mode = 'create', initialData, onClose, onSaved }: CadreCommandeFormModalProps) {
  const [label, setLabel] = useState(initialData?.label ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError('Le libellé est obligatoire.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved =
        mode === 'edit' && initialData
          ? await cadreCommandeService.update(initialData.id, { label: label.trim() })
          : await cadreCommandeService.create({ label: label.trim() });

      onSaved(saved);
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/45 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            {mode === 'edit' ? 'Modifier le cadre de commande' : 'Nouveau cadre de commande'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-state-error/10 px-3 py-2 text-xs text-state-error">
            {error}
          </p>
        )}

        <label className="mb-1 block text-xs text-text-secondary">Libellé</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Investissement"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-background"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
