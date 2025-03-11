'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterEnumInputProps<TFilterKey, T extends string> {
  propertyName: TFilterKey;
  value: T;
  onChange: (propertyName: TFilterKey, newValue: T) => void;
  options: T[];
  placeholder?: string;
  optionToString?: (option: T) => string;
}

const FilterEnumInput = <TFilterKey, T extends string>({
  propertyName,
  value,
  onChange,
  options,
  placeholder,
  optionToString = (option: T) => option.toString(),
}: FilterEnumInputProps<TFilterKey, T>) => {
  return (
    <div className="filter-input w-full">
      <Select
        value={value}
        onValueChange={(newValue) => {
          if (newValue === '_____CLEAR_____') {
            onChange(propertyName, '' as T);
          } else {
            onChange(propertyName, newValue as T);
          }
        }}
      >
        <SelectTrigger className="w-full h-full">
          <SelectValue
            placeholder={placeholder || `Select ${String(propertyName)}`}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectItem key="clear" value="_____CLEAR_____">
            &nbsp;
          </SelectItem>

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
