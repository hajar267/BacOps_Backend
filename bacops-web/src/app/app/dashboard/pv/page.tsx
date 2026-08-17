'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { pvService } from '@/services/pvService';
import { PV } from '@/types/pv';

export default function PvListPage() {
  const [pvs, setPvs] = useState<PV[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pvService.list();
      setPvs(data);
    } catch {
      setPvs([]);
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-text-primary">PV</h1>
          <p className="text-sm text-text-secondary">Gérer les procès-verbaux</p>
        </div>
        <Link
          href="/app/dashboard/pv/generate"
          className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold"
        >
          + Générer PV
        </Link>
      </div>

      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-bg text-text-secondary text-xs">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Numéro de contrat</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Statut</th>
              <th className="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Chargement...</td></tr>
            ) : pvs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Aucun PV généré pour l&apos;instant</td></tr>
            ) : (
              pvs.map((pv) => <PvRow key={pv.id} pv={pv} onChanged={load} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PvRow({ pv, onChanged }: { pv: PV; onChanged: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await pvService.uploadSigned(pv.id, file);
      onChanged();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <tr className="border-t border-surface-border">
      <td className="px-4 py-3 text-text-primary">{pv.pvNumber}</td>
      <td className="px-4 py-3 text-text-secondary">
        {new Date(pv.createdAt).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          pv.isSigned ? 'bg-state-success/15 text-state-success' : 'bg-state-error/15 text-state-error'
        }`}>
          {pv.isSigned ? 'Signé' : 'Non signé'}
        </span>
      </td>
      <td className="px-4 py-3">
        {pv.isSigned ? (
          <a
  href={pv.signedPdfUrl!}
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs font-semibold px-3 py-1.5 border border-surface-border rounded-lg text-text-primary hover:bg-surface-bg"          >
            Voir
          </a>
        ) : (
          <label className="text-xs font-semibold px-3 py-1.5 border border-surface-border rounded-lg text-text-primary hover:bg-surface-bg cursor-pointer">
            {uploading ? '...' : 'Importer'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleImport} disabled={uploading} />
          </label>
        )}
      </td>
    </tr>
  );
}
