'use client';

import { useState } from 'react';
import { X, MapPinned } from 'lucide-react';
import { prefectureService } from '@/services/prefectureService';
import { PrefectureListItem, VilleListItem } from '@/types/location';

interface PrefectureFormModalProps {
  prefecture?: PrefectureListItem;
  villes: VilleListItem[];
  onClose: () => void;
  onSaved: (p: PrefectureListItem) => void;
}

export function PrefectureFormModal({ prefecture, villes, onClose, onSaved }: PrefectureFormModalProps) {
  const isEditMode = !!prefecture;
  const [villeId, setVilleId] = useState<number | ''>(prefecture?.ville.id ?? '');
  const [name, setName] = useState(prefecture?.name ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!villeId) {
      setError('La ville est obligatoire.');
      return;
    }
    if (!name.trim()) {
      setError('Le nom de la préfecture est obligatoire.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ville_id: Number(villeId), name: name.trim() };
      const result = isEditMode
        ? await prefectureService.update(prefecture!.id, payload)
        : await prefectureService.create(payload);
      onSaved(result);
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border border-surface-border w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPinned className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">
            {isEditMode ? 'Modifier la préfecture' : 'Ajouter une préfecture'}
          </h2>
        </div>
        <p className="text-sm text-text-secondary mb-6">Choisissez la ville et nommez la préfecture.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Ville <span className="text-brand-error">*</span>
            </label>
            <select
              value={villeId}
              onChange={(e) => setVilleId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              <option value="">Sélectionner...</option>
              {villes.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Nom de la préfecture <span className="text-brand-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Anfa"
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-brand-error font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-bg transition-colors" disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-60">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}