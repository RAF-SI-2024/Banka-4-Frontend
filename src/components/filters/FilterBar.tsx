'use client';

import React, { useEffect, useState } from 'react';
import FilterStringInput from './FilterStringInput';
import FilterNumberInput from './FilterNumberInput';
import FilterTimestampInput from './FilterTimestampInput';
import FilterEnumInput from './FilterEnumInput';
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
  value: number;
}

export interface TimestampFilterableColumn extends BaseFilterableColumn {
  filterType: 'timestamp';
  // Using Date or null for timestamp filters
  value: Date | null;
}

export interface EnumFilterableColumn extends BaseFilterableColumn {
  filterType: 'enum';
  value: string;
  options: string[];
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
                                                                       filterKeyToName,
                                                                     }: FilterBarProps<TFilter>) {
  const [filterState, setFilterState] = useState<TFilter>(filter);

  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  const handleFilterChange = (
    propertyName: keyof TFilter,
    newValue: string | Date | number
  ) => {
    setFilterState((prevFilters) => {
      const column = prevFilters[propertyName];
      switch (column.filterType) {
        case 'timestamp':
          return {
            ...prevFilters,
            [propertyName]: {
              ...column,
              value: newValue ? (newValue as Date) : null,
            },
          };
        case 'number':
          return {
            ...prevFilters,
            [propertyName]: {
              ...column,
              value:
                typeof newValue === 'number'
                  ? newValue
                  : parseFloat(newValue as string),
            },
          };
        default:
          return {
            ...prevFilters,
            [propertyName]: {
              ...column,
              value: newValue,
            },
          };
      }
    });
  };

  const renderFilterInput = (key: keyof TFilter) => {
    const column = filterState[key];
    const placeholder =
      column.placeholder || `Filter by ${filterKeyToName(key)}`;

    switch (column.filterType) {
      case 'string':
        return (
          <FilterStringInput
            key={String(key)}
            propertyName={(key)}
            value={(column as StringFilterableColumn).value}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'number':
        return (
          <FilterNumberInput<keyof TFilter>
            key={String(key)}
            propertyName={(key)}
            value={(column as NumberFilterableColumn).value}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'timestamp':
        return (
          <FilterTimestampInput
            key={String(key)}
            propertyName={(key)}
            value={(column as TimestampFilterableColumn).value}
            onChange={handleFilterChange}
            placeholder={placeholder}
          />
        );
      case 'enum':
        return (
          <FilterEnumInput
            key={String(key)}
            propertyName={(key)}
            value={(column as EnumFilterableColumn).value}
            onChange={handleFilterChange}
            placeholder={placeholder}
            options={(column as EnumFilterableColumn).options}
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
      {Object.keys(filter).map((key) =>
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
