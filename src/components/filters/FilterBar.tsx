'use client';

import React, { useEffect, useState } from 'react';
import FilterStringInput from './FilterStringInput';
import FilterNumberInput from './FilterNumberInput';
import FilterTimestampInput from './FilterTimestampInput';
import FilterEnumInput from './FilterEnumInput';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface BaseFilterDefinition {
  filterType: 'string' | 'number' | 'timestamp' | 'enum';
  placeholder: string;
}

export interface StringFilterDefinition extends BaseFilterDefinition {
  filterType: 'string';
}

export interface NumberFilterDefinition extends BaseFilterDefinition {
  filterType: 'number';
}

export interface TimestampFilterDefinition extends BaseFilterDefinition {
  filterType: 'timestamp';
}

export interface EnumFilterDefinition extends BaseFilterDefinition {
  filterType: 'enum';
  options: string[];
  optionToString?: (option: string) => string;
}

export type FilterDefinition =
  | StringFilterDefinition
  | NumberFilterDefinition
  | TimestampFilterDefinition
  | EnumFilterDefinition;

export type FilterBarProps<
  TFilter, // filter values (e.g. { firstName: string; age: number; ... })
  TColumns extends Record<keyof TFilter, FilterDefinition>,
> = {
  onSubmit: (filters: TFilter) => void;
  filter: TFilter; // values only
  columns: TColumns; // definitions for each filter field
};

export function FilterBar<
  TFilter,
  TColumns extends Record<keyof TFilter, FilterDefinition>,
>({
  onSubmit,
  filter,
  columns,
}: FilterBarProps<TFilter, TColumns>) {
  const [filterState, setFilterState] = useState<TFilter>(filter);

  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  const handleFilterChange = (
    propertyName: keyof TFilter,
    newValue: string | Date | number | null
  ) => {
    setFilterState((prevFilters) => ({
      ...prevFilters,
      [propertyName]: newValue,
    }));
  };

  const renderFilterInput = (key: keyof TFilter) => {
    const columnDef = columns[key];
    const value = filterState[key];
    const placeholder =
        columnDef.placeholder || `Filter by ${String(key)}`;

    switch (columnDef.filterType) {
      case 'string':
        return (
          <FilterStringInput
            key={String(key)}
            propertyName={key}
            value={value as string}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'number':
        return (
          <FilterNumberInput<keyof TFilter>
            key={String(key)}
            propertyName={key}
            value={value as number}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'timestamp':
        return (
          <FilterTimestampInput
            key={String(key)}
            propertyName={key}
            value={value as Date | null}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'enum':
        return (
          <FilterEnumInput
            key={String(key)}
            propertyName={key}
            value={value as string}
            onChange={handleFilterChange}
            placeholder={placeholder}
            optionToString={columnDef.optionToString}
            options={columnDef.options}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(filterState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4 space-x-2">
      {Object.keys(columns).map((key) =>
        renderFilterInput(key as keyof TFilter)
      )}
      <Button type="submit">
        Search
        <Search className="w-4 h-4 mr-1" />
      </Button>
    </form>
  );
}

export default FilterBar;
