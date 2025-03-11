'use client';

import React from 'react';

export interface FilterNumberInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: number;
  onChange: (propertyName: keyof TFilterKey, newValue: number) => void;
  placeholder?: string;
}

const FilterNumberInput = <TFilterKey,>({
                                       propertyName,
                                       value,
                                       onChange,
                                       placeholder,
                                     }: FilterNumberInputProps<TFilterKey>) => {
  return null;
};

export default FilterNumberInput;
