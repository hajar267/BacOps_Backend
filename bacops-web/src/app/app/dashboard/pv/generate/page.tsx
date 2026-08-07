'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pvService } from '@/services/pvService';
import { locationService } from '@/services/locationService';
import { ArrondissementListItem } from '@/types/location';import { buildPvPdf } from '@/lib/pdf/buildPvPdf';
import { PreviewBacItem, PvFilters } from '@/types/pv';

const ALL = 'Tous';

export default function GeneratePvPage() {
  const router = useRouter();
  const [step, setStep] = useState<'filters' | 'preview'>('filters');
  const [filters, setFilters] = useState<PvFilters>({});
  const [items, setItems] = useState<PreviewBacItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const [arrondissements, setArrondissements] = useState<ArrondissementListItem[]>([]);

useEffect(() => {
  locationService.list().then(setArrondissements).catch(() => {});
}, []);
  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pvService.preview(filters);
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
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      doc.save(`PV_${Date.now()}.pdf`);
      router.push('/pv');
    } catch {
      setError('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-lg font-bold text-text-primary mb-6">Générer un rapport PV</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-brand-error/10 text-brand-error text-sm">
          {error}
        </div>
      )}

      {step === 'filters' && (
        <div className="bg-white border border-surface-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FilterSelect
              label="Nature"
              value={filters.nature ?? ALL}
              options={[ALL, 'plastique', 'metal']}
              onChange={(v) => setFilters((f) => ({ ...f, nature: v === ALL ? undefined : v }))}
            />
            <FilterSelect
              label="Capacité"
              value={filters.capacite ?? ALL}
              options={[ALL, '120L', '240L', '360L']}
              onChange={(v) => setFilters((f) => ({ ...f, capacite: v === ALL ? undefined : v }))}
            />
          </div>

<FilterSelect
  label="Arrondissement"
  value={filters.arrond ?? ALL}
  options={[ALL, ...arrondissements.map((a) => a.name)]}
  onChange={(v) => {
    const match = arrondissements.find((a) => a.name === v);
    setFilters((f) => ({
      ...f,
      arrond: v === ALL ? undefined : v,
      arrondissementId: match?.id,
    }));
  }}
/>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Date de début
              </label>
              <input
                type="date"
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm"
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Date de fin
              </label>
              <input
                type="date"
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm"
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
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
                {items.map((item, i) => (
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