'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { locationService } from '@/services/locationService';
import { ArrondissementListItem } from '@/types/location';
import { LocationFormModal } from '@/components/locations/LocationFormModal';
import { DeleteLocationModal } from '@/components/locations/DeleteLocationModal';
import  { LocationsTable } from '@/components/locations/LocationsTable';

export default function ArrondPage() {
  const [items, setItems] = useState<ArrondissementListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [villeFilter, setVilleFilter] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ArrondissementListItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ArrondissementListItem | null>(null);

  useEffect(() => {
    locationService.list().then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  const villes = useMemo(
    () => Array.from(new Set(items.map((i) => i.prefectureVille.ville))).sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesVille = !villeFilter || item.prefectureVille.ville === villeFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.prefectureVille.ville.toLowerCase().includes(q) ||
        (item.prefectureVille.prefecture ?? '').toLowerCase().includes(q);

      return matchesVille && matchesSearch;
    });
  }, [items, search, villeFilter]);

  const handleSaved = (saved: ArrondissementListItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [...prev, saved];
    });
  };

  const handleDeleted = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Arrondissements & Préfectures
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gérer les villes, préfectures et arrondissements utilisés dans les installations
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter un arrondissement
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ville, préfecture ou arrondissement..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <select
          value={villeFilter}
          onChange={(e) => setVilleFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 sm:w-56"
        >
          <option value="">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <LocationsTable
        items={filteredItems}
        isLoading={isLoading}
        onEdit={setItemToEdit}
        onDelete={setItemToDelete}
      />

      {!isLoading && (
        <p className="text-xs text-text-secondary mt-3">
          {filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''}
          {items.length !== filteredItems.length && ` sur ${items.length} au total`}
        </p>
      )}

      {isCreateOpen && (
        <LocationFormModal
          onClose={() => setIsCreateOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {itemToEdit && (
        <LocationFormModal
          arrondissement={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSaved={handleSaved}
        />
      )}

      {itemToDelete && (
        <DeleteLocationModal
          arrondissement={itemToDelete}
          onClose={() => setItemToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}