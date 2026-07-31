'use client';

import { useMemo, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { arrondissementService } from '@/services/arrondissementService';
import { ArrondissementListItem, VilleListItem, PrefectureListItem } from '@/types/location';

interface ArrondissementFormModalProps {
  arrondissement?: ArrondissementListItem;
  villes: VilleListItem[];
  prefectures: PrefectureListItem[];
  onClose: () => void;
  onSaved: (a: ArrondissementListItem) => void;
}

export function ArrondissementFormModal({
  arrondissement,
  villes,
  prefectures,
  onClose,
  onSaved,
}: ArrondissementFormModalProps) {
  const isEditMode = !!arrondissement;
  const [villeId, setVilleId] = useState<number | ''>(arrondissement?.ville.id ?? '');
  const [prefectureId, setPrefectureId] = useState<number | ''>(arrondissement?.prefecture?.id ?? '');
  const [name, setName] = useState(arrondissement?.name ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prefecturesForVille = useMemo(
    () => prefectures.filter((p) => p.ville.id === villeId),
    [prefectures, villeId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!villeId) {
      setError('La ville est obligatoire.');
      return;
    }
    if (!name.trim()) {
      setError("Le nom de l'arrondissement est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ville_id: Number(villeId),
        prefecture_id: prefectureId ? Number(prefectureId) : null,
        name: name.trim(),
      };
      const result = isEditMode
        ? await arrondissementService.update(arrondissement!.id, payload)
        : await arrondissementService.create(payload);
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
      <div className="bg-white rounded-2xl border border-surface-border w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">
            {isEditMode ? "Modifier l'arrondissement" : 'Ajouter un arrondissement'}
          </h2>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Choisissez la ville, la préfecture si nécessaire, puis nommez l&apos;arrondissement.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Ville <span className="text-brand-error">*</span>
            </label>
            <select
              value={villeId}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : '';
                setVilleId(id);
                setPrefectureId('');
              }}
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
              Préfecture <span className="font-normal text-text-secondary">(optionnel)</span>
            </label>
            <select
              value={prefectureId}
              onChange={(e) => setPrefectureId(e.target.value ? Number(e.target.value) : '')}
              disabled={!villeId || prefecturesForVille.length === 0}
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:bg-surface-bg disabled:text-text-secondary"
            >
              <option value="">Aucune</option>
              {prefecturesForVille.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Arrondissement <span className="text-brand-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Sidi Belyout"
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
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