'use client';

import { useEffect, useState } from 'react';
import { MapPin, Package, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { searchService } from '@/services/searchService';
import { BacHistoryItem, BacSearchResult } from '@/types/search';

interface BacHistorySheetProps {
  bac: BacSearchResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BacHistorySheet({ bac, open, onOpenChange }: BacHistorySheetProps) {
  const [events, setEvents] = useState<BacHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !bac) return;
    setIsLoading(true);
    searchService
      .history(bac.id)
      .then(setEvents)
      .finally(() => setIsLoading(false));
  }, [open, bac]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historique du bac</SheetTitle>
          {bac && <p className="text-xs text-text-secondary">{bac.rfid}</p>}
        </SheetHeader>

        <div className="mt-6 px-4">
          {isLoading ? (
            <p className="text-sm text-text-secondary">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-text-secondary">Aucun événement</p>
          ) : (
            <ol className="space-y-6">
              {events.map((event, index) => (
                <li key={index} className="relative flex gap-3 pl-1">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                      {event.type === 'installation' ? (
                        <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                      ) : (
                        <Package className="h-3.5 w-3.5 text-brand-primary" />
                      )}
                    </div>
                    {index < events.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-text-primary">
                        {event.type === 'installation' ? 'Installation' : 'Entrée stock'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {event.address && (
                      <p className="mt-1 text-xs text-text-secondary">{event.address}</p>
                    )}
                    {event.person && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                        <User className="h-3 w-3" />
                        {event.person}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}