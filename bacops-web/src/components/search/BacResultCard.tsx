'use client';

import { History, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BacSearchResult } from '@/types/search';
import { StatusBadge } from './StatusBadge';

interface BacResultCardProps {
  result: BacSearchResult;
  onShowHistory: () => void;
}

export function BacResultCard({ result, onShowHistory }: BacResultCardProps) {
  const installation = result.currentInstallation;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">{result.serialNumber}</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              {result.bacType.nature}
              {result.bacType.matiere ? ` · ${result.bacType.matiere}` : ''}
            </p>
          </div>
          <StatusBadge status={result.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoChip label="RFID" value={result.rfid} />
          <InfoChip label="Capacité" value={result.bacType.capacite ?? '-'} />
          <InfoChip label="Couleur" value={result.bacType.couleur ?? '-'} />
          <InfoChip label="Variante" value={result.bacType.variante ?? '-'} />
        </div>

        {installation?.address && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{installation.address}</span>
          </div>
        )}

        <Button onClick={onShowHistory} className="mt-4 w-full">
          <History className="mr-2 h-4 w-4" />
          Voir l&apos;historique
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background px-2.5 py-2">
      <p className="text-[10px] text-text-secondary">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-text-primary">{value}</p>
    </div>
  );
}