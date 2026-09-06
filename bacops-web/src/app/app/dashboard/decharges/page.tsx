'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { dechargeService } from '@/services/dechargeService';
import { Decharge } from '@/types/decharge';
import DechargeCard from '@/components/decharge/DechargeCard';

export default function DechargeListPage() {
  const [decharges, setDecharges] = useState<Decharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dechargeService.list();
      setDecharges(data);
    } catch {
      setDecharges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [load]);

  return (
    <div className="w-full mx-auto p-8 ">
      <div className="mb-6 ">
        <h1 className="text-2xl font-bold text-text-primary">Décharges</h1>
        <p className="mt-1 text-sm text-text-secondary">Consulter les décharges bénéficiaires</p>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 " />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par ville, préfecture, arrondissement, CIN, téléphone..."
          className="w-full pl-9 pr-3 py-2 border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
        />
      </div>

      <div className="space-y-1.5">
        {loading ? (
          <p className="text-center py-8 text-text-secondary text-sm">Chargement...</p>
        ) : decharges.length === 0 ? (
          <p className="text-center py-8 text-text-secondary text-sm">Aucune décharge pour l&apos;instant</p>
        ) : (
          decharges.map((decharge) => <DechargeCard key={decharge.id} decharge={decharge} />)
        )}
      </div>
    </div>
  );
}