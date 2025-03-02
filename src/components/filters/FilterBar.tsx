'use client';

import React, { useState } from 'react';
import FilterInput from './FilterInput';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface BaseFilter {
  [key: string]: string;
}

interface FilterBarProps<TFilter extends BaseFilter> {
  onSearch: (filters: TFilter) => void;
  filters: TFilter;
}

export function FilterBar<TFilter extends BaseFilter>({
  onSearch,
  filters,
}: FilterBarProps<TFilter>) {
  const [vFilters, setVFilters] = useState<TFilter>(filters);

  const handleFilterChange = (propertyName: string, newValue: string) => {
    setVFilters((prevFilters) => ({
      ...prevFilters,
      [propertyName]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(vFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 space-x-2">
      {Object.keys(filters).map((key) => (
        <FilterInput
          key={key}
          propertyName={key}
          value={filters[key as keyof TFilter]}
          onChange={handleFilterChange}
          placeholder={`Filter by ${key}`}
        />
      ))}
      <Button type="submit">
        Search
        <Search className="w-4 h-4 mr-1" />
      </Button>
    </form>
  );
}

export default FilterBar;
