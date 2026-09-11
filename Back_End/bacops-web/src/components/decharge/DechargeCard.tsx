import { Download, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { buildDechargePdf } from '@/lib/pdf/buildDechargePdf';
import { Decharge } from '@/types/decharge';

function dechargeRef(decharge: Decharge): string {
  const year = new Date(decharge.createdAt).getFullYear();
  return `${decharge.id}-${year}`;
}

export default function DechargeCard({ decharge }: { decharge: Decharge }) {
  const [downloading, setDownloading] = useState(false);
  const address = decharge.session?.address;
  const arrondissement = decharge.session?.arrondissement;
  const secondary = [address, arrondissement].filter(Boolean).join(', ');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const doc = await buildDechargePdf(decharge);
      doc.save(`Decharge_${decharge.id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group relative bg-white border border-surface-border rounded-xl overflow-hidden transition-shadow hover:shadow-md hover:border-brand-primary/30">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-sm font-bold text-text-primary tracking-tight">{dechargeRef(decharge)}</p>
          <p className="text-xs text-text-secondary mt-0.5">{secondary || '—'}</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center transition-colors hover:bg-brand-primary/20 disabled:opacity-40 disabled:hover:bg-brand-primary/10"
          aria-label="Télécharger"
          disabled={downloading}
        >
          {downloading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </button>
      </div>
      <div className="h-0.75 bg-brand-primary rounded-b-xl" />
    </div>
  );
}