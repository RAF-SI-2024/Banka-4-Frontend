'use client';

import React from 'react';

export interface FilterNumberInputProps {
  propertyName: string;
  value: number;
  onChange: (propertyName: string, newValue: number) => void;
  placeholder?: string;
}

const FilterNumberInput: React.FC<FilterNumberInputProps> = ({
  propertyName,
  value,
  onChange,
  placeholder,
}) => {
  return null;
};

export default FilterNumberInput;
