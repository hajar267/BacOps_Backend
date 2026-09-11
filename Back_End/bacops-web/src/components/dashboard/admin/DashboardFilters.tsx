'use client';

import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DatePickerField } from '@/components/pv/DateRangeFilter';
import { bacTypeService } from '@/services/bacTypeService';
import { BacTypeItem } from '@/types/bacType';
import { DashboardFilters as DashboardFiltersType } from '@/types/dashboard';

const ALL = 'Tous';

interface DashboardFiltersProps {
  value: DashboardFiltersType;
  onApply: (filters: DashboardFiltersType) => void;
}

export function DashboardFilters({ value, onApply }: DashboardFiltersProps) {
  const [open, setOpen] = useState(false);
  const [bacTypes, setBacTypes] = useState<BacTypeItem[]>([]);
  const [draft, setDraft] = useState<DashboardFiltersType>(value);

  useEffect(() => {
    bacTypeService.list().then(setBacTypes).catch(() => {
      // Suggestions are a nice-to-have; the popover still works without them
    });
  }, []);

  // Re-sync the draft to whatever filters are actually applied each time the popover opens,
  // so a closed-without-applying edit doesn't linger.
//   useEffect(() => {
//     if (open) setDraft(value);
//   }, [open, value]);

  const availableNatures = useMemo(
    () => Array.from(new Set(bacTypes.map((b) => b.nature))).sort(),
    [bacTypes]
  );

  const availableCapacites = useMemo(() => {
    const pool = draft.nature ? bacTypes.filter((b) => b.nature === draft.nature) : bacTypes;
    return Array.from(new Set(pool.map((b) => b.capacite))).sort();
  }, [bacTypes, draft.nature]);

  const availableMatieres = useMemo(() => {
    const pool = bacTypes.filter(
      (b) =>
        (!draft.nature || b.nature === draft.nature) &&
        (!draft.capacite || b.capacite === draft.capacite)
    );
    return Array.from(new Set(pool.map((b) => b.matiere))).sort();
  }, [bacTypes, draft.nature, draft.capacite]);

//   const activeCount = Object.values(value).filter(Boolean).length;

  const handleReset = () => {
    const cleared: DashboardFiltersType = {};
    setDraft(cleared);
    onApply(cleared);
    setOpen(false);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'gap-2 border-border bg-white text-sm text-text-primary hover:bg-background'
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtres
        {/* {activeCount > 0 && (
          <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )} */}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 space-y-4 border-border p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">Filtrer le tableau de bord</p>
          {/* <p className="mt-0.5 text-xs text-text-secondary">
            Affine les statistiques par type de bac et par période.
          </p> */}
        </div>

        <FilterSelect
          label="Nature"
          value={draft.nature ?? ALL}
          options={[ALL, ...availableNatures]}
          onChange={(v) =>
            setDraft((f) => ({
              ...f,
              nature: v === ALL ? undefined : v,
              capacite: undefined, // reset downstream
              matiere: undefined,
            }))
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <FilterSelect
            label="Capacité"
            value={draft.capacite ?? ALL}
            options={[ALL, ...availableCapacites]}
            onChange={(v) =>
              setDraft((f) => ({
                ...f,
                capacite: v === ALL ? undefined : v,
                matiere: undefined, // reset downstream
              }))
            }
          />
          <FilterSelect
            label="Matière"
            value={draft.matiere ?? ALL}
            options={[ALL, ...availableMatieres]}
            onChange={(v) => setDraft((f) => ({ ...f, matiere: v === ALL ? undefined : v }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DatePickerField
            label="Date de début"
            value={draft.from ? new Date(draft.from) : undefined}
            onChange={(date) =>
              setDraft((f) => ({ ...f, from: date ? format(date, 'yyyy-MM-dd') : undefined }))
            }
          />
          <DatePickerField
            label="Date de fin"
            value={draft.to ? new Date(draft.to) : undefined}
            onChange={(date) =>
              setDraft((f) => ({ ...f, to: date ? format(date, 'yyyy-MM-dd') : undefined }))
            }
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-text-secondary hover:bg-background"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={handleApply}
            className="bg-brand-primary text-white hover:bg-brand-primary/90"
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}