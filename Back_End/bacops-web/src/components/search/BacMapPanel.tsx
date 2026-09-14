'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { BacLocation } from '@/types/search';

const BacMapInner = dynamic(() => import('./BacMapInner'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-xl" />,
});

interface BacMapPanelProps {
  locations: BacLocation[];
  selectedId: number | null;
  flyTarget: { lat: number; lng: number } | null;
  onMarkerClick: (loc: BacLocation) => void;
}

export function BacMapPanel(props: BacMapPanelProps) {
  return (
    <div className="h-full min-h-[55svh] w-full overflow-hidden rounded-xl border border-border lg:min-h-0">
      <BacMapInner {...props} />
    </div>
  );
}