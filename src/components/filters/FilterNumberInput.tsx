'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { MaybePromise } from '@/types/MaybePromise';

export interface FilterNumberInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: number | null;
  onChange: (
    propertyName: TFilterKey,
    newValue: number | null
  ) => MaybePromise<unknown>;
  placeholder?: string;
}

const FilterNumberInput = <TFilterKey,>({
  propertyName,
  value,
  onChange,
  placeholder,
}: FilterNumberInputProps<TFilterKey>) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    await onChange(propertyName, isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="filter-input w-full">
      <Input
        className="w-full"
        type="number"
        name={String(propertyName)}
        placeholder={placeholder || `Filter by ${propertyName}`}
        value={value ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterNumberInput;
