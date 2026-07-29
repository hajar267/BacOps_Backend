'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, ShieldCheck, Crown } from 'lucide-react';
import { roleService } from '@/services/roleService';
import { permissionService } from '@/services/permissionService';
import { RoleListItem, PermissionCatalog } from '@/types/role';

interface RoleFormModalProps {
  role?: RoleListItem; // omit for create mode
  onClose: () => void;
  onSaved: (role: RoleListItem) => void;
}

export function RoleFormModal({ role, onClose, onSaved }: RoleFormModalProps) {
  const isEditMode = !!role;

  const [catalog, setCatalog] = useState<PermissionCatalog>({});
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  const [name, setName] = useState(role?.name ?? '');
  const [isFullAccess, setIsFullAccess] = useState(
    role?.permissions.includes('*') ?? false
  );
  const [selected, setSelected] = useState<string[]>(
    role && !role.permissions.includes('*') ? role.permissions : []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    permissionService.list().then((data) => {
      setCatalog(data);
      setIsCatalogLoading(false);
    });
  }, []);

  const modules = useMemo(() => Object.entries(catalog), [catalog]);

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du rôle est obligatoire.');
      return;
    }
    if (!isFullAccess && selected.length === 0) {
      setError('Sélectionnez au moins une permission, ou activez l\'accès complet.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        permissions: isFullAccess ? ['*'] : selected,
      };

      const result = isEditMode
        ? await roleService.update(role!.id, payload)
        : await roleService.create(payload);

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
      <div className="bg-white rounded-2xl border border-surface-border w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">
            {isEditMode ? 'Modifier le rôle' : 'Ajouter un rôle'}
          </h2>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Nommez le rôle et sélectionnez ses permissions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Nom du rôle <span className="text-brand-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Superviseur stock"
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFullAccess((prev) => !prev)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg border transition-colors ${
              isFullAccess
                ? 'bg-brand-primary/10 border-brand-primary/30'
                : 'border-surface-border'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <Crown className="w-4 h-4 text-brand-primary" />
              <div>
                <p className="text-sm font-semibold text-text-primary">Accès complet</p>
                <p className="text-xs text-text-secondary">
                  Ce rôle a accès à toutes les fonctionnalités (*)
                </p>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full relative flex-shrink-0 transition-colors ${
                isFullAccess ? 'bg-brand-primary' : 'bg-surface-border'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                  isFullAccess ? 'left-4' : 'left-0.5'
                }`}
              />
            </div>
          </button>

          <div className={isFullAccess ? 'opacity-40 pointer-events-none' : ''}>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Permissions détaillées
            </label>

            {isCatalogLoading && (
              <p className="text-sm text-text-secondary">Chargement...</p>
            )}

            <div className="space-y-3">
              {modules.map(([moduleName, perms]) => (
                <div
                  key={moduleName}
                  className="border border-surface-border rounded-lg p-3"
                >
                  <p className="text-xs font-semibold text-text-secondary mb-2">
                    {moduleName}
                  </p>
                  <div className="space-y-1.5">
                    {perms.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 text-sm text-text-primary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(perm)}
                          onChange={() => togglePermission(perm)}
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-error font-medium">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-bg transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}