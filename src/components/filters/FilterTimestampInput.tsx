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
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

export interface FilterTimestampInputProps<TFilterKey> {
  propertyName: TFilterKey;
  value: string;
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

  const selectedDate = value ? dayjs(value, 'YYYY-MM-DD').toDate() : undefined;

  return (
    <div className="filter-input w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full ">
            <div className="flex w-full flex-row items-center justify-between">
              <p
                className={`w-full text-left ${value == null ? 'text-gray-400' : ''}`}>
                {value
                  ? value
                  : placeholder || `Filter by ${String(propertyName)}`}
              </p>
              <ChevronDown className="text-gray-400" aria-hidden="true" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange(propertyName, dayjs(date).format('YYYY-MM-DD'));
                setOpen(false);
              }
            }}
            initialFocus
          />
          <div className="p-2 flex justify-center">
            <Button
              className={'w-full'}
              variant="destructive"
              onClick={() => {
                onChange(propertyName, '');
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterTimestampInput;
