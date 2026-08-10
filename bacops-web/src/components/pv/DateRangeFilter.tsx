'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            'w-full flex items-center gap-2 border border-surface-border rounded-lg px-3 py-2 text-sm text-left',
            !value && 'text-text-secondary'
          )}
        >
          <CalendarIcon className="w-4 h-4 shrink-0" />
          {value ? format(value, 'dd/MM/yyyy') : 'JJ/MM/AAAA'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false); // close after picking
            }}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}