'use client';

import { useState } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { userService } from '@/services/userService';
import { UserListItem } from '@/types/user';

interface DeleteUserModalProps {
  user: UserListItem;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export function DeleteUserModal({
  user,
  onClose,
  onDeleted,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await userService.delete(user.id);

      onDeleted(user.id);
      onClose();
    } catch {
      setError("Impossible de supprimer l'utilisateur.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm shadow-black/10">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-error/15">
              <Trash2 className="h-5 w-5 text-brand-error" />
            </div>

            <h2 className="text-lg font-bold text-text-primary">
              Supprimer lutilisateur
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}

        <div className="px-6 py-6">

          <p className="text-sm text-text-secondary leading-6">
            Cette action est
            <span className="font-semibold text-brand-error">
              {' '}irréversible{' '}
            </span>
            et supprimera définitivement cet utilisateur.
          </p>

          {/* <p className="mt-5 text-sm text-text-primary">
            Voulez-vous vraiment supprimer
          </p> */}

          <p className="mt-2 rounded-lg bg-surface-bg text-center font-semibold text-text-primary">
            {user.username}
          </p>

          {error && (
            <p className="mt-4 text-sm text-brand-error">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-surface-border px-6 py-5">

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-surface-border px-5 py-2.5 font-medium text-text-primary hover:bg-surface-bg disabled:opacity-60"
          >
            Annuler
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-brand-error px-5 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-70"
          >
            {isDeleting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>

        </div>

      </div>
    </div>
  );
}