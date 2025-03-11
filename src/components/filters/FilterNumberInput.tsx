'use client';

export interface FilterNumberInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: number;
  onChange: (propertyName: TFilterKey, newValue: number) => void;
  placeholder?: string;
}

// TODO: implement
const FilterNumberInput = <TFilterKey,>({
  propertyName,
  value,
  onChange,
  placeholder,
}: FilterNumberInputProps<TFilterKey>) => {
  return null;
};

export default FilterNumberInput;
