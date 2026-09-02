'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { cadreCommandeService } from '@/services/cadreCommandeService';
import { CadreCommandeItem } from '@/types/cadreCommande';
import { CadreCommandeCard } from '@/components/cadreCommande/CadreCommandeCard';
import { CadreCommandeFormModal } from '@/components/cadreCommande/CadreCommandeFormModal';
import { CadreCommandeDeleteModal } from '@/components/cadreCommande/CadreCommandeDeleteModal';

export default function CadreCommandePage() {
  const [items, setItems] = useState<CadreCommandeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CadreCommandeItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CadreCommandeItem | null>(null);

  useEffect(() => {
    cadreCommandeService
      .list()
      .then((data: CadreCommandeItem[]) => {
        setItems(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSaved = (saved: CadreCommandeItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved];
    });
  };

  const handleDeleted = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Cadre de commande</h1>
          <p className="mt-1 text-sm text-text-secondary">Gérez le cadre de commande ici.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un cadre
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-secondary">Chargement...</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-sm font-medium text-text-secondary">Aucun cadre de commande</p>
          <p className="mt-1 text-xs text-text-secondary/70">Appuyez sur + pour en ajouter un</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CadreCommandeCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={setDeletingItem}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <p className="mt-3 text-xs text-text-secondary">{items.length} cadre(s)</p>
      )}

      {isCreateOpen && (
        <CadreCommandeFormModal onClose={() => setIsCreateOpen(false)} onSaved={handleSaved} />
      )}

      {editingItem && (
        <CadreCommandeFormModal
          mode="edit"
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={(saved) => {
            handleSaved(saved);
            setEditingItem(null);
          }}
        />
      )}

{deletingItem && (
  <CadreCommandeDeleteModal
    item={deletingItem}
    onClose={() => setDeletingItem(null)}
    onDeleted={handleDeleted}
  />
)}    </div>
  );
}