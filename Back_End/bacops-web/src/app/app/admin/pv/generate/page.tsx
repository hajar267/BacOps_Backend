'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pvService } from '@/services/pvService';
import { locationService } from '@/services/locationService';
import { bacTypeService } from '@/services/bacTypeService';
import { buildPvPdf } from '@/lib/pdf/buildPvPdf';
import { PreviewBacItem, PvFilters } from '@/types/pv';
import { ArrondissementListItem } from '@/types/location';
import { BacTypeItem } from '@/types/bacType';
import { DatePickerField } from '@/components/pv/DateRangeFilter';
import { format } from 'date-fns';

const ALL = 'Tous';

export default function GeneratePvPage() {
  const router = useRouter();
  const [step, setStep] = useState<'filters' | 'preview'>('filters');
  const [filters, setFilters] = useState<PvFilters>({});
  const [items, setItems] = useState<PreviewBacItem[]>([]);

  const [bacTypes, setBacTypes] = useState<BacTypeItem[]>([]);
  const [arrondissementQuery, setArrondissementQuery] = useState('');
  const [arrondissementOptions, setArrondissementOptions] = useState<ArrondissementListItem[]>([]);
  const [selectedArrondissement, setSelectedArrondissement] = useState<ArrondissementListItem | null>(null);
  const [searchingArrondissements, setSearchingArrondissements] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bacTypeService.list().then(setBacTypes).catch(() => {});
  }, []);

  useEffect(() => {
    const query = arrondissementQuery.trim();

    if (selectedArrondissement || query.length < 2) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSearchingArrondissements(true);
      try {
        setArrondissementOptions(await locationService.searchArrondissements(query));
      } catch {
        setArrondissementOptions([]);
      } finally {
        setSearchingArrondissements(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [arrondissementQuery, selectedArrondissement]);

  const availableNatures = useMemo(
    () => Array.from(new Set(bacTypes.map((b) => b.nature))).sort(),
    [bacTypes]
  );

  const availableCapacites = useMemo(() => {
    const pool = filters.nature ? bacTypes.filter((b) => b.nature === filters.nature) : bacTypes;
    return Array.from(new Set(pool.map((b) => b.capacite))).sort();
  }, [bacTypes, filters.nature]);

  const availableMatieres = useMemo(() => {
    const pool = bacTypes.filter(
      (b) =>
        (!filters.nature || b.nature === filters.nature) &&
        (!filters.capacite || b.capacite === filters.capacite)
    );
    return Array.from(new Set(pool.map((b) => b.matiere))).sort();
  }, [bacTypes, filters.nature, filters.capacite]);

  // ...handlePreview, handleDownloadAndSave stay the same as before
const handlePreview = async () => {
  setLoading(true);
  setError(null);
  try {
    if (arrondissementQuery.trim() && !selectedArrondissement) {
      setError('Sélectionnez un arrondissement dans les suggestions ou choisissez « Tous ».');
      return;
    }

    const data = await pvService.preview(filters);
    if (!Array.isArray(data)) {
      setError('Réponse inattendue du serveur');
      return;
    }
    if (data.length === 0) {
      setError('Aucun bac trouvé pour ces critères');
      return;
    }
    setItems(data);
    setStep('preview');
  } catch {
    setError('Erreur lors de la récupération des données');
  } finally {
    setLoading(false);
  }
};

  const handleDownloadAndSave = async () => {
    setLoading(true);
    try {
      const doc = await buildPvPdf({
        items,
        contractNum: '2/GD/CR/2022',
        date: new Date().toLocaleDateString('fr-FR'),
        societeDelegataire: 'ARMA RABAT',
        representant: '.................................',
      });

      await pvService.create({
        contractNum: '2/GD/CR/2022',
        filterCapacite: filters.capacite !== ALL ? filters.capacite : undefined,
        filterMatiere: filters.matiere !== ALL ? filters.matiere : undefined,
        arrondissement_id: filters.arrondissement_id,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      doc.save(`PV_${Date.now()}.pdf`);
      router.push('/app/admin/pv');
    } catch {
      setError('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="text-lg font-bold text-text-primary mb-6">Générer un rapport PV</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-brand-error/10 text-brand-error text-sm">
          {error}
        </div>
      )}

      {step === 'filters' && (
        <div className="bg-white border border-surface-border rounded-xl p-6 space-y-4">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
<FilterSelect
  label="Nature"
  value={filters.nature ?? ALL}
  options={[ALL, ...availableNatures]}
  onChange={(v) =>
    setFilters((f) => ({
      ...f,
      nature: v === ALL ? undefined : v,
      capacite: undefined, // reset downstream
      matiere: undefined,
    }))
  }
/>
<FilterSelect
  label="Capacité"
  value={filters.capacite ?? ALL}
  options={[ALL, ...availableCapacites]}
  onChange={(v) =>
    setFilters((f) => ({
      ...f,
      capacite: v === ALL ? undefined : v,
      matiere: undefined, // reset downstream
    }))
  }
/></div>

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
<FilterSelect
  label="Matière"
  value={filters.matiere ?? ALL}
  options={[ALL, ...availableMatieres]}
  onChange={(v) => setFilters((f) => ({ ...f, matiere: v === ALL ? undefined : v }))}
/>
<div>
  <label className="block text-sm font-semibold text-text-primary mb-1">Arrondissement</label>
  <div className="relative">
    <input
      value={selectedArrondissement ? `${selectedArrondissement.name}, ${selectedArrondissement.ville.name}` : arrondissementQuery}
      onChange={(event) => {
        setSelectedArrondissement(null);
        setArrondissementQuery(event.target.value);
        setFilters((f) => ({ ...f, arrondissement_id: undefined }));
      }}
      placeholder="Rechercher par arrondissement ou ville"
      className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm"
    />
    <button
      type="button"
      onClick={() => {
        setSelectedArrondissement(null);
        setArrondissementQuery('');
        setArrondissementOptions([]);
        setFilters((f) => ({ ...f, arrondissement_id: undefined }));
      }}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-primary"
    >
      Tous
    </button>
    {!selectedArrondissement && arrondissementQuery.trim().length >= 2 && (
      <div className="absolute z-10 mt-1 w-full rounded-lg border border-surface-border bg-white shadow-lg">
        {searchingArrondissements ? (
          <p className="px-3 py-2 text-sm text-text-secondary">Recherche...</p>
        ) : arrondissementOptions.length > 0 ? (
          arrondissementOptions.map((arrondissement) => (
            <button
              type="button"
              key={arrondissement.id}
              onClick={() => {
                setSelectedArrondissement(arrondissement);
                setArrondissementQuery('');
                setArrondissementOptions([]);
                setFilters((f) => ({ ...f, arrondissement_id: arrondissement.id }));
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-bg"
            >
              {arrondissement.name}, {arrondissement.ville.name}
            </button>
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-text-secondary">Aucun résultat</p>
        )}
      </div>
    )}
  </div>
</div></div>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <DatePickerField
    label="Date de début"
    value={filters.startDate ? new Date(filters.startDate) : undefined}
    onChange={(date) =>
      setFilters((f) => ({ ...f, startDate: date ? format(date, 'yyyy-MM-dd') : undefined }))
    }
  />
  <DatePickerField
    label="Date de fin"
    value={filters.endDate ? new Date(filters.endDate) : undefined}
    onChange={(date) =>
      setFilters((f) => ({ ...f, endDate: date ? format(date, 'yyyy-MM-dd') : undefined }))
    }
  />
</div>
          <button
            onClick={handlePreview}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm disabled:opacity-60"
          >
            {loading ? 'Chargement...' : 'Générer un aperçu'}
          </button>
        </div>
      )}

      {step === 'preview' && (
        <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-bg text-text-secondary">
                <tr>
                  {['Type', 'Capacité', 'N° CUVE', 'Arrond.', 'Date', 'Adresse'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(items) && items.map((item, i) => (
                  <tr key={i} className="border-t border-surface-border">
                    <td className="px-3 py-2">{item.nature}</td>
                    <td className="px-3 py-2">{item.capacite}</td>
                    <td className="px-3 py-2">{item.serialNumber}</td>
                    <td className="px-3 py-2">{item.arrond}</td>
                    <td className="px-3 py-2">{item.installedAt.slice(0, 10)}</td>
                    <td className="px-3 py-2">{item.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 p-4 border-t border-surface-border">
            <button
              onClick={() => setStep('filters')}
              className="flex-1 py-3 rounded-xl border border-surface-border text-text-primary font-semibold text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleDownloadAndSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm disabled:opacity-60"
            >
              {loading ? 'Génération...' : 'Télécharger'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}