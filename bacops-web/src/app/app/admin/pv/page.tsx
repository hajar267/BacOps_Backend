'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { pvService } from '@/services/pvService';
import { PV } from '@/types/pv';
import { DeleteConfirmModal } from '@/components/locations/DeleteConfirmModal';

export default function PvListPage() {
  const [pvs, setPvs] = useState<PV[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPv, setDeletingPv] = useState<PV | null>(null);

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">PV</h1>
          <p className="text-sm text-text-secondary mt-1">Gérer les procès-verbaux</p>
        </div>
        <Link
          href="/app/admin/pv/generate"
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
              pvs.map((pv) => (
                <PvRow key={pv.id} pv={pv} onChanged={load} onDelete={setDeletingPv} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {deletingPv && (
        <DeleteConfirmModal
          title="Supprimer le PV"
          itemLabel={deletingPv.pvNumber}
          onClose={() => setDeletingPv(null)}
          onConfirm={async () => {
            await pvService.delete(deletingPv.id);
            setPvs((prev) => prev.filter((pv) => pv.id !== deletingPv.id));
          }}
        />
      )}
    </div>
  );
}

function PvRow({
  pv,
  onChanged,
  onDelete,
}: {
  pv: PV;
  onChanged: () => void;
  onDelete: (pv: PV) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadError('Veuillez sélectionner un fichier PDF.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      await pvService.uploadSigned(pv.id, file);
      onChanged();
    } catch (error: unknown) {
      const responseMessage = (
        error as { response?: { data?: { message?: string; errors?: { file?: string[] } } } }
      ).response?.data;
      setUploadError(responseMessage?.errors?.file?.[0] ?? responseMessage?.message ?? 'Échec de l’import du PDF.');
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
            className="text-xs font-semibold px-3 py-1.5 border border-surface-border rounded-lg text-text-primary hover:bg-surface-bg inline-block"
          >
            Voir
          </a>
        ) : (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold px-3 py-1.5 border border-surface-border rounded-lg text-text-primary hover:bg-surface-bg cursor-pointer">
              {uploading ? '...' : 'Importer'}
              <input type="file" accept=".pdf" className="hidden" onChange={handleImport} disabled={uploading} />
            </label>
            <button
              onClick={() => onDelete(pv)}
              className="text-text-secondary hover:text-state-error disabled:opacity-50"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        {uploadError && (
          <p className="mt-2 text-xs text-state-error">{uploadError}</p>
        )}
      </td>
    </tr>
  );
}