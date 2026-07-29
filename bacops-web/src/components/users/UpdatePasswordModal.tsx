'use client';

import { useState } from 'react';
import { X, Key } from 'lucide-react';
import { userService } from '@/services/userService';
import { UserListItem } from '@/types/user';

interface UpdatePasswordModalProps {
  user: UserListItem;
  onClose: () => void;
  onUpdated?: () => void;
}

export function UpdatePasswordModal({
  user,
  onClose,
  onUpdated,
}: UpdatePasswordModalProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.updatePassword(user.id, {
        password,
        passwordConfirmation,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour du mot de passe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl border border-surface-border w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Key className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">
            Modifier le mot de passe
          </h2>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Utilisateur : <span className="font-semibold">{user.username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="••••••••"
            />
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
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}