'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supplierService } from '@/services/suppliersService';
import { SupplierItem } from '@/types/supplier';
import { SupplierCard } from '@/components/suppliers/SupplierCard';
import { SupplierFormModal } from '@/components/suppliers/SupplierFormModal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    supplierService
      .list()
      .then((data: SupplierItem[]) => {
        setSuppliers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSaved = (saved: SupplierItem) => {
    setSuppliers((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Fournisseurs</h1>
          <p className="mt-1 text-sm text-text-secondary">Gérer la liste des fournisseurs</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un fournisseur
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-text-secondary">Chargement...</p>
      ) : suppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-sm font-medium text-text-secondary">Aucun fournisseur</p>
          <p className="mt-1 text-xs text-text-secondary/70">
            Appuyez sur + pour en ajouter un
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((item) => (
            <SupplierCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && (
        <p className="mt-3 text-xs text-text-secondary">{suppliers.length} fournisseur(s)</p>
      )}

      {isCreateOpen && (
        <SupplierFormModal onClose={() => setIsCreateOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}