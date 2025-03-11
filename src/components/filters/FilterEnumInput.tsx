'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterEnumInputProps<T extends string> {
  propertyName: string;
  value: T;
  onChange: (propertyName: string, newValue: T) => void;
  options: T[];
  placeholder?: string;
  optionToString?: (option: T) => string;
}

const FilterEnumInput = <T extends string>({
                                             propertyName,
                                             value,
                                             onChange,
                                             options,
                                             placeholder,
                                             optionToString = (option: T) => option.toString(),
                                           }: FilterEnumInputProps<T>) => {
  return (
    <div className="filter-input w-full">
      <Select
        value={value}
        onValueChange={(newValue) => onChange(propertyName, newValue as T)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || `Select ${propertyName}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {optionToString(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterEnumInput;
