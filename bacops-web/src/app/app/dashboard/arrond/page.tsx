'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { villeService } from '@/services/villeService';
import { prefectureService } from '@/services/prefectureService';
import { arrondissementService } from '@/services/arrondissementService';
import { VilleListItem, PrefectureListItem, ArrondissementListItem } from '@/types/location';
import { LocationsTabs, LocationTab } from '@/components/locations/LocationsTabs';
import { VilleFormModal } from '@/components/locations/VilleFormModal';
import { PrefectureFormModal } from '@/components/locations/PrefectureFormModal';
import { ArrondissementFormModal } from '@/components/locations/ArrondissementFormModal';
import { DeleteConfirmModal } from '@/components/locations/DeleteConfirmModal';
import { villeService as vSvc } from '@/services/villeService';

const TAB_CONFIG = {
  villes: { label: 'Ajouter une ville', placeholder: 'Rechercher une ville' },
  prefectures: { label: 'Ajouter une préfecture', placeholder: 'Rechercher une préfecture' },
  arrondissements: { label: 'Ajouter un arrondissement', placeholder: 'Rechercher un arrondissement' },
};

export default function LocationsPage() {
  const [activeTab, setActiveTab] = useState<LocationTab>('villes');

  const [villes, setVilles] = useState<VilleListItem[]>([]);
  const [prefectures, setPrefectures] = useState<PrefectureListItem[]>([]);
  const [arrondissements, setArrondissements] = useState<ArrondissementListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [villeToEdit, setVilleToEdit] = useState<VilleListItem | null>(null);
  const [prefectureToEdit, setPrefectureToEdit] = useState<PrefectureListItem | null>(null);
  const [arrondToEdit, setArrondToEdit] = useState<ArrondissementListItem | null>(null);
interface PendingDelete {
  type: LocationTab;
  id: number;
  label: string;
}
const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);  useEffect(() => {
    Promise.all([villeService.list(), prefectureService.list(), arrondissementService.list()]).then(
      ([v, p, a]) => {
        setVilles(v);
        setPrefectures(p);
        setArrondissements(a);
        setIsLoading(false);
      }
    );
  }, []);

  const filteredVilles = useMemo(
    () => villes.filter((v) => v.name.toLowerCase().includes(search.toLowerCase())),
    [villes, search]
  );
  const filteredPrefectures = useMemo(
    () =>
      prefectures.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.ville.name.toLowerCase().includes(search.toLowerCase())
      ),
    [prefectures, search]
  );
  const filteredArrondissements = useMemo(
    () =>
arrondissements.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.ville?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (a.prefecture?.name ?? '').toLowerCase().includes(search.toLowerCase())
    ),    [arrondissements, search]
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Gestion des lieux</h1>
        <p className="text-sm text-text-secondary mt-1">
          Villes, préfectures et arrondissements utilisés dans les installations
        </p>
      </div>

      <LocationsTabs
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setSearch('');
        }}
        counts={{
          villes: villes.length,
          prefectures: prefectures.length,
          arrondissements: arrondissements.length,
        }}
      />

      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={TAB_CONFIG[activeTab].placeholder}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-surface-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {TAB_CONFIG[activeTab].label}
        </button>
      </div>

      {/* VILLES TABLE */}
      {activeTab === 'villes' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Ville</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Préfectures</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">Chargement...</td></tr>
              )}
              {!isLoading && filteredVilles.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">Aucune ville trouvée</td></tr>
              )}
              {filteredVilles.map((v) => (
                <tr key={v.id} className="border-b border-surface-border last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{v.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {v.prefecturesCount > 0 ? v.prefecturesCount : <span className="italic text-text-secondary/70">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setVilleToEdit(v)} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Modifier">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPendingDelete({ type: 'villes', id: v.id, label: v.name })}
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
      )}

      {/* PREFECTURES TABLE */}
      {activeTab === 'prefectures' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Préfecture</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Ville</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">Chargement...</td></tr>
              )}
              {!isLoading && filteredPrefectures.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-text-secondary">Aucune préfecture trouvée</td></tr>
              )}
              {filteredPrefectures.map((p) => (
                <tr key={p.id} className="border-b border-surface-border last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{p.ville.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setPrefectureToEdit(p)} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Modifier">
                        ✎
                      </button>
                      <button
                        onClick={() => setPendingDelete({ type: 'prefectures', id: p.id, label: p.name })}
                        className="text-brand-error hover:text-brand-error/80 transition-colors"
                        aria-label="Supprimer"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ARRONDISSEMENTS TABLE */}
      {activeTab === 'arrondissements' && (
        <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Ville</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Préfecture</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Arrondissement</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-text-secondary">Chargement...</td></tr>
              )}
              {!isLoading && filteredArrondissements.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-text-secondary">Aucun résultat trouvé</td></tr>
              )}
{filteredArrondissements.map((a) => (
  <tr key={a.id} className="border-b border-surface-border last:border-0">
    {/* 💡 Modified this line below to add optional chaining (?.) and a fallback string */}
    <td className="px-6 py-4 text-sm font-medium text-text-primary">
      {a.ville?.name ?? <span className="italic text-text-secondary/70">—</span>}
    </td>
    <td className="px-6 py-4 text-sm text-text-secondary">
      {a.prefecture?.name ?? <span className="italic text-text-secondary/70">—</span>}
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-text-primary">
        {a.name}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-end gap-3">
        <button onClick={() => setArrondToEdit(a)} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Modifier">
          ✎
        </button>
        <button
          onClick={() => setPendingDelete({ type: 'arrondissements', id: a.id, label: a.name })}
          className="text-brand-error hover:text-brand-error/80 transition-colors"
          aria-label="Supprimer"
        >
          🗑
        </button>
      </div>
    </td>
  </tr>
              ))}
            </tbody>          
            </table>
        </div>
      )}

      {/* CREATE MODALS */}
      {isCreateOpen && activeTab === 'villes' && (
        <VilleFormModal
          onClose={() => setIsCreateOpen(false)}
          onSaved={(v) => setVilles((prev) => [...prev, v])}
        />
      )}
      {isCreateOpen && activeTab === 'prefectures' && (
        <PrefectureFormModal
          villes={villes}
          onClose={() => setIsCreateOpen(false)}
          onSaved={(p) => setPrefectures((prev) => [...prev, p])}
        />
      )}
      {isCreateOpen && activeTab === 'arrondissements' && (
        <ArrondissementFormModal
          villes={villes}
          prefectures={prefectures}
          onClose={() => setIsCreateOpen(false)}
          onSaved={(a) => setArrondissements((prev) => [...prev, a])}
        />
      )}

      {/* EDIT MODALS */}
      {villeToEdit && (
        <VilleFormModal
          ville={villeToEdit}
          onClose={() => setVilleToEdit(null)}
          onSaved={(v) => setVilles((prev) => prev.map((x) => (x.id === v.id ? v : x)))}
        />
      )}
      {prefectureToEdit && (
        <PrefectureFormModal
          prefecture={prefectureToEdit}
          villes={villes}
          onClose={() => setPrefectureToEdit(null)}
          onSaved={(p) => setPrefectures((prev) => prev.map((x) => (x.id === p.id ? p : x)))}
        />
      )}
      {arrondToEdit && (
        <ArrondissementFormModal
          arrondissement={arrondToEdit}
          villes={villes}
          prefectures={prefectures}
          onClose={() => setArrondToEdit(null)}
          onSaved={(a) => setArrondissements((prev) => prev.map((x) => (x.id === a.id ? a : x)))}
        />
      )}

      {/* DELETE MODAL */}
      {pendingDelete && (
        <DeleteConfirmModal
          title={
            pendingDelete.type === 'villes'
              ? 'Supprimer la ville'
              : pendingDelete.type === 'prefectures'
              ? 'Supprimer la préfecture'
              : "Supprimer l'arrondissement"
          }
          itemLabel={pendingDelete.label}
          onClose={() => setPendingDelete(null)}
          onConfirm={async () => {
            if (pendingDelete.type === 'villes') {
              await villeService.delete(pendingDelete.id);
              setVilles((prev) => prev.filter((v) => v.id !== pendingDelete.id));
            } else if (pendingDelete.type === 'prefectures') {
              await prefectureService.delete(pendingDelete.id);
              setPrefectures((prev) => prev.filter((p) => p.id !== pendingDelete.id));
            } else {
              await arrondissementService.delete(pendingDelete.id);
              setArrondissements((prev) => prev.filter((a) => a.id !== pendingDelete.id));
            }
          }}
        />
      )}
    </div>
  );
}