'use client';

import { Building, MapPinned, MapPin } from 'lucide-react';

export type LocationTab = 'villes' | 'prefectures' | 'arrondissements';

interface LocationsTabsProps {
  active: LocationTab;
  onChange: (tab: LocationTab) => void;
  counts: { villes: number; prefectures: number; arrondissements: number };
}

const TABS: { key: LocationTab; label: string; icon: typeof Building }[] = [
  { key: 'villes', label: 'Villes', icon: Building },
  { key: 'prefectures', label: 'Préfectures', icon: MapPinned },
  { key: 'arrondissements', label: 'Arrondissements', icon: MapPin },
];

export function LocationsTabs({ active, onChange, counts }: LocationsTabsProps) {
  return (
    <div className="flex gap-6 border-b border-surface-border mb-5">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 pb-2.5 text-sm transition-colors ${
            active === key
              ? 'font-semibold text-text-primary border-b-2 border-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
          <span className="bg-surface-bg text-text-secondary text-xs px-2 py-0.5 rounded-full">
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
