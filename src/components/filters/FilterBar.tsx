'use client';

import React, { useEffect, useState } from 'react';
import FilterInput from './FilterInput';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FilterBarProps<TFilter extends { [K in keyof TFilter]: unknown }> {
  onSearch: (filters: TFilter) => void;
  filter: TFilter;
  filterKeyToName: (key: keyof TFilter) => string;
}

export function FilterBar<TFilter extends { [K in keyof TFilter]: unknown }>({
  onSearch,
  filter,
  filterKeyToName,
}: FilterBarProps<TFilter>) {
  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  const [filterState, setFilterState] = useState<TFilter>(filter);

  const handleFilterChange = (propertyName: string, newValue: string) => {
    setFilterState((prevFilters) => ({
      ...prevFilters,
      [propertyName]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(filterState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 space-x-2">
      {Object.keys(filter).map((key) => (
        <FilterInput
          key={key}
          propertyName={key}
          value={filterState[key as keyof TFilter] as string}
          onChange={handleFilterChange}
          placeholder={`Filter by ${filterKeyToName(key as keyof TFilter)}`}
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
