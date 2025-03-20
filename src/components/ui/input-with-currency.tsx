'use client';

import { Input } from '@/components/ui/input';

interface InputFieldWithCurrencyProps {
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

const InputFieldWithCurrency: React.FC<InputFieldWithCurrencyProps> = ({
  currency,
  field,
}) => {
  return (
    <div className="flex items-center border rounded-md px-3 py-2">
      <Input
        className="flex-1 border-none focus:ring-0 text-lg !h-fit font-semibold"
        placeholder="Enter amount"
        {...field}
      />
      <span className="ml-2 font-medium text-gray-500 dark:text-gray-400">
        {currency}
      </span>
    </div>
  );
};

export { InputFieldWithCurrency };
