export interface FilterTimestampInputProps {
  propertyName: string;
  value: string;
  onChange: (propertyName: string, newValue: string) => void;
  placeholder?: string;
}