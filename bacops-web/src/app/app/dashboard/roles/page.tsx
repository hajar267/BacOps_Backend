'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { roleService } from '@/services/roleService';
import { RoleListItem } from '@/types/role';
import { RoleFormModal } from '@/components/roles/RoleFormModal';
import { DeleteRoleModal } from '@/components/roles/DeleteRoleModal';
import { RolesTable } from '@/components/roles/RolesTable';

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleListItem | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleListItem | null>(null);

useEffect(() => {
  roleService.list().then((data) => {
    // Force it to be an array even if the API structure changes unexpectedly
    setRoles(Array.isArray(data) ? data : []);
    setIsLoading(false);
  }).catch(() => setIsLoading(false));
}, []);

  const handleSaved = (saved: RoleListItem) => {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [...prev, saved];
    });
  };

  const handleDeleted = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Rôles et permissions</h1>
          <p className="text-sm text-text-secondary mt-1">
            Gérer les rôles et leurs droits d&apos;accès
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter un rôle
        </button>
      </div>

      <RolesTable
        roles={roles}
        isLoading={isLoading}
        onEdit={setRoleToEdit}
        onDelete={setRoleToDelete}
      />

      {!isLoading && (
        <p className="text-xs text-text-secondary mt-3">{roles.length} rôle(s)</p>
      )}

      {isCreateOpen && (
        <RoleFormModal onClose={() => setIsCreateOpen(false)} onSaved={handleSaved} />
      )}

      {roleToEdit && (
        <RoleFormModal
          role={roleToEdit}
          onClose={() => setRoleToEdit(null)}
          onSaved={handleSaved}
        />
      )}

      {roleToDelete && (
        <DeleteRoleModal
          role={roleToDelete}
          onClose={() => setRoleToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}