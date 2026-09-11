'use client';

import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { searchService } from '@/services/searchService';
import { BacLocation, BacSearchResult } from '@/types/search';
import { SearchBar } from '@/components/search/SearchBar';
import { BacResultCard } from '@/components/search/BacResultCard';
import { BacMapPanel } from '@/components/search/BacMapPanel';
import { BacHistorySheet } from '@/components/search/BacHistorySheet';

export default function SearchPage() {
  const [result, setResult] = useState<BacSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<BacLocation[]>([]);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    searchService.locations().then(setLocations).catch(() => setLocations([]));
  }, []);

  const focusResult = (bac: BacSearchResult) => {
    const installation = bac.currentInstallation;
    if (installation?.locationLat != null && installation?.locationLng != null) {
      setFlyTarget({ lat: installation.locationLat, lng: installation.locationLng });
    }
  };

  const handleSearch = async (rfid: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await searchService.infos(rfid);
      setResult(data);
      focusResult(data);
    } catch (err) {
      const status = (err as AxiosError).response?.status;
      setError(status === 404 ? 'Aucun bac trouvé pour ce RFID' : 'Erreur serveur. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerClick = async (loc: BacLocation) => {
    if (!loc.rfid) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchService.infos(loc.rfid);
      setResult(data);
      focusResult(data);
    } catch {
      setError('Impossible de charger ce bac');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
    setFlyTarget(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Rechercher un bac</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Recherchez par tag RFID ou sélectionnez un bac sur la carte
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4 overflow-y-auto">
          <SearchBar isLoading={isLoading} onSearch={handleSearch} onClear={handleClear} />

          {error && (
            <div className="rounded-lg border border-state-error/40 bg-state-error/10 p-3 text-sm text-state-error">
              {error}
            </div>
          )}

          {result && (
            <BacResultCard result={result} onShowHistory={() => setHistoryOpen(true)} />
          )}
        </div>

        <BacMapPanel
          locations={locations}
          selectedId={result?.id ?? null}
          flyTarget={flyTarget}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <BacHistorySheet bac={result} open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
}