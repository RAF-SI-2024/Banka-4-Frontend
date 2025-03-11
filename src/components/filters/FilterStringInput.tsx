'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

export interface FilterStringInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: string;
  onChange: (propertyName: TFilterKey, newValue: string) => void;
  placeholder?: string;
}

const FilterStringInput = <TFilterKey,>({
                                       propertyName,
                                       value,
                                       onChange,
                                       placeholder,
                                     }: FilterStringInputProps<TFilterKey>) => {
  return (
    <div className="filter-input w-full">
      <Input
        className="w-full"
        type="text"
        name={String(propertyName)}
        placeholder={placeholder || `Filter by ${String(propertyName)}`}
        value={value}
        onChange={(e) => onChange(propertyName, e.target.value)}
      />
    </div>
  );
};

export default FilterStringInput;
