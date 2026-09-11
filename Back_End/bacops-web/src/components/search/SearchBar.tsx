'use client';

import { useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  isLoading: boolean;
  onSearch: (rfid: string) => void;
  onClear: () => void;
}

export function SearchBar({ isLoading, onSearch, onClear }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (value.trim()) onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onClear();
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-3">
      <Search className="h-4 w-4 shrink-0 text-text-secondary" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="ex: RT-00123"
        className="border-none shadow-none focus-visible:ring-0"
      />
      {value && (
        <button type="button" onClick={handleClear} aria-label="Effacer">
          <X className="h-4 w-4 text-text-secondary" />
        </button>
      )}
      <Button onClick={handleSearch} disabled={isLoading} size="sm">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Chercher'}
      </Button>
    </div>
  );
}