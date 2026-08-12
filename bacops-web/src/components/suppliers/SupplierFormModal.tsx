'use client';

import { useState, useRef } from 'react';
import { X, Upload, Factory } from 'lucide-react';
import { supplierService } from '@/services/suppliersService';
import { SupplierItem } from '@/types/supplier';

interface SupplierFormModalProps {
  onClose: () => void;
  onSaved: (saved: SupplierItem) => void;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export function SupplierFormModal({ onClose, onSaved }: SupplierFormModalProps) {
  const [nom, setNom] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format non supporté. Utilisez PNG ou JPG.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Le fichier dépasse 2 Mo.');
      return;
    }

    setError(null);
    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!nom.trim()) {
      setError('Le nom du fournisseur est obligatoire.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved = await supplierService.create({ nom: nom.trim(), logo: logoFile });
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
          <h2 className="text-base font-semibold text-text-primary">Nouveau fournisseur</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-state-error/10 px-3 py-2 text-xs text-state-error">
            {error}
          </p>
        )}

        <div className="mb-4 flex items-center gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-background"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Logo preview" className="h-full w-full object-cover" />
            ) : (
              <Factory className="h-6 w-6 text-text-secondary/50" />
            )}
          </div>
          <div>
            <p className="mb-1 text-xs text-text-secondary">Logo</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-background"
            >
              <Upload className="h-3.5 w-3.5" />
              Choisir un fichier
            </button>
            <p className="mt-1 text-[11px] text-text-secondary/70">PNG, JPG jusqu à 2 Mo</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <label className="mb-1 block text-xs text-text-secondary">Nom</label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Sotramex"
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