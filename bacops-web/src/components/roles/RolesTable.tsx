'use client';

import { Crown, Pencil, Trash2 } from 'lucide-react';
import { RoleListItem } from '@/types/role';

interface RolesTableProps {
  roles: RoleListItem[];
  isLoading: boolean;
  onEdit: (role: RoleListItem) => void;
  onDelete: (role: RoleListItem) => void;
}

export function RolesTable({ roles, isLoading, onEdit, onDelete }: RolesTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-bg border-b border-surface-border">
            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
              Rôle
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
              Permissions
            </th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">
                Chargement...
              </td>
            </tr>
          )}

          {!isLoading && roles.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">
                Aucun rôle trouvé
              </td>
            </tr>
          )}

          {roles.map((role) => {
            const isFullAccess = role.permissions.includes('*');

            return (
              <tr key={role.id} className="border-b border-surface-border last:border-0">
                <td className="px-6 py-4 text-sm font-medium text-text-primary">
                  {role.name}
                </td>
                <td className="px-6 py-4">
                  {isFullAccess ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-text-primary">
                      <Crown className="w-3 h-3" />
                      Accès complet
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-success/15 text-text-primary"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(role)}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                      aria-label="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(role)}
                      disabled={isFullAccess}
                      className="text-brand-error hover:text-brand-error/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Supprimer"
                      title={isFullAccess ? 'Le rôle super-admin ne peut pas être supprimé' : undefined}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}