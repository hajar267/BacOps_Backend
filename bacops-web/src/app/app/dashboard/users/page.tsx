'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { userService } from '@/services/userService';
import { UserListItem } from '@/types/user';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { DeleteUserModal } from '@/components/users/DeleteUserModal';
import { EditUserModal } from '@/components/users/EditUserModal';

const ROLE_BADGE_STYLES: Record<string, string> = {
  admin: 'bg-brand-primary/15 text-text-primary',
  magasin: 'bg-brand-success/20 text-text-primary',
  install: 'bg-brand-error/15 text-text-primary',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [userToEdit, setUserToEdit] =
  useState<UserListItem | null>(null);

  useEffect(() => {
    userService.list().then((data) => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  const handleUserCreated = (newUser: UserListItem) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUserDeleted = (id: number) => {
  setUsers((prev) => prev.filter((u) => u.id !== id));
};

const handleUserUpdated = (updatedUser: UserListItem) => {
  setUsers((prev) =>
    prev.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
};

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestion des utilisateurs</h1>
          <p className="text-sm text-text-secondary mt-1">Gérer les utilisateurs du système</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Créer un utilisateur
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-bg border-b border-surface-border">
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                Nom d&apos;utilisateur
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                Rôle
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

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id} className="border-b border-surface-border last:border-0">
                <td className="px-6 py-4 text-sm text-text-primary">{user.username}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      ROLE_BADGE_STYLES[user.role.name] ?? 'bg-surface-border text-text-primary'
                    }`}
                  >
                    {user.role.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        /* TODO: open edit-user modal/page */
                        setUserToEdit(user)
                      }}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                      aria-label="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user)
                        /* TODO: confirm + delete user */
                      }}
                      className="text-brand-error hover:text-brand-error/80 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateUserModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleUserCreated}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          onDeleted={handleUserDeleted}
        />
      )}

      {userToEdit && (
  <EditUserModal
    user={userToEdit}
    onClose={() => setUserToEdit(null)}
    onUpdated={handleUserUpdated}
  />
)}
    </div>
  );
}