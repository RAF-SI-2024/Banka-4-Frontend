'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

export interface FilterInputProps {
  propertyName: string;
  value: string;
  onChange: (propertyName: string, newValue: string) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  propertyName,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="filter-input w-full">
      <Input
        className={'w-full'}
        type="text"
        name={propertyName}
        placeholder={placeholder || `Filter by ${propertyName}`}
        value={value}
        onChange={(e) => onChange(propertyName, e.target.value)}
      />
    </div>
  );
};

export default FilterInput;
