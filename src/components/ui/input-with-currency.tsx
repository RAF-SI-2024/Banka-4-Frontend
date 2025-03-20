'use client';

import { Input } from '@/components/ui/input';

interface InputFieldWithCurrenctProps {
  currency: string;
  field: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    value: number | undefined;
    disabled?: boolean;
    name: string;
    ref: (instance: HTMLInputElement | null) => void;
  };
}

const InputFieldWithCurrenct: React.FC<InputFieldWithCurrenctProps> = ({
  currency,
  field,
}) => {
  return (
    <div className="flex items-center border rounded-md px-3 py-2">
      <Input
        className="flex-1 border-none focus:ring-0 text-lg font-semibold"
        placeholder="Enter amount"
        {...field}
      />
      <span className="ml-2 font-medium text-gray-500 dark:text-gray-400">
        {currency}
      </span>
    </div>
  );
};

export { InputFieldWithCurrenct };
