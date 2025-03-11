export interface FilterEnumInputProps<T extends string> {
  propertyName: string;
  value: T;
  onChange: (propertyName: string, newValue: T) => void;
  options: T[];
  placeholder?: string;
  optionToString?: (option: T) => string;
}