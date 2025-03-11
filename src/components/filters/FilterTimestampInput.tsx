'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface FilterTimestampInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: Date | null;
  onChange: (propertyName: TFilterKey, newValue: string) => void;
  placeholder?: string;
}

const FilterTimestampInput = <TFilterKey,>({
  propertyName,
  value,
  onChange,
  placeholder,
}: FilterTimestampInputProps<TFilterKey>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="filter-input w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full text-left">
            {value
              ? dayjs(value).format('YYYY-MM-DD')
                 : placeholder || `Filter by ${propertyName}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(date) => {
              if (date) {
                onChange(propertyName, dayjs(date).toISOString());
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterTimestampInput;
