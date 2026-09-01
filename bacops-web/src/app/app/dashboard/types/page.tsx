'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { bacTypeService } from '@/services/bacTypeService';
import { BacTypeItem } from '@/types/bacType';
import { BacTypeCard } from '@/components/bacTypes/BacTypeCard';
import { BacTypeFormModal } from '@/components/bacTypes/BacTypeFormModal';

export default function BacTypesPage() {
  const [bacTypes, setBacTypes] = useState<BacTypeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BacTypeItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    bacTypeService
      .list()
      .then((data) => {
        setBacTypes(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSaved = (saved: BacTypeItem) => {
    setBacTypes((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      return exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved];
    });
  };

  const handleDelete = async (item: BacTypeItem) => {
    if (!confirm(`Supprimer le type "${item.nature}" ?`)) return;
    setDeletingId(item.id);
    try {
      await bacTypeService.remove(item.id);
      setBacTypes((prev) => prev.filter((t) => t.id !== item.id));
    } catch {
      alert('Échec de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Types de bacs</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gérer les types de bacs disponibles
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un type
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-secondary">Chargement...</p>
      ) : bacTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-sm font-medium text-text-secondary">Aucun type de bac</p>
          <p className="mt-1 text-xs text-text-secondary/70">
            Appuyez sur + pour en ajouter un
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {bacTypes.map((item) => (
            <BacTypeCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <p className="mt-3 text-xs text-text-secondary">{bacTypes.length} type(s)</p>
      )}

      {isCreateOpen && (
        <BacTypeFormModal
          onClose={() => setIsCreateOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {editingItem && (
        <BacTypeFormModal
          mode="edit"
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={(saved) => {
            handleSaved(saved);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}