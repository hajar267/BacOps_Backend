'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { bacTypeService } from '@/services/bacTypeService';
import { BacTypeItem, CreateBacTypePayload } from '@/types/bacType';

interface BacTypeFormModalProps {
  onClose: () => void;
  onSaved: (saved: BacTypeItem) => void;
}

export function BacTypeFormModal({ onClose, onSaved }: BacTypeFormModalProps) {
  const [natures, setNatures] = useState<string[]>([]);
  const [capacites, setCapacites] = useState<string[]>([]);
  const [matieres, setMatieres] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const [form, setForm] = useState<CreateBacTypePayload>({
    nature: '',
    capacite: '',
    variante: '',
    matiere: '',
    color: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      bacTypeService.natures(),
      bacTypeService.capacites(),
      bacTypeService.matieres(),
      bacTypeService.colors(),
    ])
      .then(([n, c, m, col]) => {
        setNatures(Array.isArray(n) ? n : []);
        setCapacites(Array.isArray(c) ? c : []);
        setMatieres(Array.isArray(m) ? m : []);
        setColors(Array.isArray(col) ? col : []);
      })
      .catch(() => {
        // Suggestions are a nice-to-have; the free-text inputs still work if this fails
      });
  }, []);

  const handleChange = (field: keyof CreateBacTypePayload, value: string) => {
    setForm((prev: CreateBacTypePayload) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nature.trim()) {
      setError('La nature est obligatoire.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload: CreateBacTypePayload = {
        nature: form.nature.trim(),
        capacite: form.capacite?.trim() || null,
        variante: form.variante?.trim() || null,
        matiere: form.matiere?.trim() || null,
        color: form.color?.trim() || null,
      };
      const saved = await bacTypeService.create(payload);
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
          <h2 className="text-base font-semibold text-text-primary">Nouveau type</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-state-error/10 px-3 py-2 text-xs text-state-error">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <Field
            label="Nature"
            value={form.nature}
            onChange={(v) => handleChange('nature', v)}
            listId="natures-list"
            suggestions={natures}
            placeholder="Bac roulant"
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Capacité"
              value={form.capacite ?? ''}
              onChange={(v) => handleChange('capacite', v)}
              listId="capacites-list"
              suggestions={capacites}
              placeholder="660 L"
            />
            <Field
              label="Matière"
              value={form.matiere ?? ''}
              onChange={(v) => handleChange('matiere', v)}
              listId="matieres-list"
              suggestions={matieres}
              placeholder="Plastique"
            />
          </div>

          <Field
            label="Couleur"
            value={form.color ?? ''}
            onChange={(v) => handleChange('color', v)}
            listId="colors-list"
            suggestions={colors}
            placeholder="Vert"
          />

          <Field
            label="Variante (optionnel)"
            value={form.variante ?? ''}
            onChange={(v) => handleChange('variante', v)}
            placeholder="Renforcée"
          />
        </div>

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

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  listId?: string;
  suggestions?: string[];
}

function Field({ label, value, onChange, placeholder, listId, suggestions }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-secondary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
      />
      {listId && suggestions && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}