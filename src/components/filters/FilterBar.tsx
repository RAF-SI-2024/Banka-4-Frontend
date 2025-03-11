'use client';

import React, { useEffect, useState } from 'react';
import FilterStringInput from './FilterInput';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface BaseFilterableColumn {
  filterType: 'string' | 'number' | 'timestamp' | 'enum';
  placeholder: string;
}

export interface StringFilterableColumn extends BaseFilterableColumn {
  filterType: 'string';
  value: string;
}

export interface NumberFilterableColumn extends BaseFilterableColumn {
  filterType: 'number';
  value: string;
}

export interface TimestampFilterableColumn extends BaseFilterableColumn {
  filterType: 'timestamp';
  value: string;
}

export interface EnumFilterableColumn extends BaseFilterableColumn {
  filterType: 'enum';
  value: string;
}

export type FilterableColumn =
  | StringFilterableColumn
  | NumberFilterableColumn
  | TimestampFilterableColumn
  | EnumFilterableColumn;

export type FilterableObject<TFilter> = {
  [K in keyof TFilter]: FilterableColumn;
};

interface FilterBarProps<TFilter extends FilterableObject<TFilter>> {
  onSubmit: (filters: TFilter) => void;
  filter: TFilter;
  filterKeyToName: (key: keyof TFilter) => string;
}

export function FilterBar<TFilter extends FilterableObject<TFilter>>({
  onSubmit,
  filter,
}: FilterBarProps<TFilter>) {
  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  const [filterState, setFilterState] = useState<TFilter>(filter);

  const handleFilterChange = (propertyName: string, newValue: string) => {
    setFilterState((prevFilters) => ({
      ...prevFilters,
      [propertyName]: {

      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(filterState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 space-x-2">
      {Object.keys(filter).map((key) => (
        <FilterStringInput
          key={key}
          propertyName={key}
          value={filterState[key as keyof TFilter].value}
          onChange={handleFilterChange}
          placeholder={`Filter by ${filterState[key as keyof TFilter].placeholder}`}
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
