'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import { isValidSecurityType } from '../isValidSecurityType';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import {
  getListingDetails,
  getListingOptions,
  getPriceChanges,
} from '@/api/listing';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { addYears, format, subDays, subMonths, subYears } from 'date-fns';
import ListingCard from './ListingCard';
import { PopoverClose } from '@radix-ui/react-popover';
import { DateRange } from 'react-day-picker';

import OrderCreationDialog from '@/components/orders/OrderCreationDialog';
import { calculateAveragePrice, createOrder } from '@/api/orders';
import { getAccounts } from '@/api/account';
import { CreateOrderRequest, OrderPreviewRequest } from '@/api/request/orders';
import { OrderPreviewDto } from '@/api/response/orders';
import { OrderFormValues } from '@/components/orders/OrderCreationDialog'; // optional ako tip izvozimo

const DateRangePicker = ({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) => {
  const presets = [
    {
      name: 'Last Week',
      getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      name: 'Last Month',
      getValue: () => ({ from: subMonths(new Date(), 1), to: new Date() }),
    },
    {
      name: 'Last Year',
      getValue: () => ({ from: subYears(new Date(), 1), to: new Date() }),
    },
    {
      name: 'Last 5 Years',
      getValue: () => ({ from: subYears(new Date(), 5), to: new Date() }),
    },
  ];

  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col p-3 border-r border-border">
              <h4 className="text-sm font-medium mb-1">Presets</h4>
              <div className="flex flex-col gap-1">
                {presets.map((preset) => (
                  <PopoverClose
                    key={preset.name}
                    className={cn(
                      '!text-start !justify-start !font-normal',
                      buttonVariants({ variant: 'ghost' })
                    )}
                    onClick={() => setDate(preset.getValue())}
                  >
                    {preset.name}
                  </PopoverClose>
                ))}
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default function Page({
  params,
}: {
  params: Promise<{ securityType: string[] }>;
}) {
  const [settlementDate, setSettlementDate] = useState<Date>(new Date());
  const client = useHttpClient();
  const { securityType: securityTypeParam } = use(params);
  const [securityType, id] = securityTypeParam;

  const { data: options } = useQuery({
    queryKey: ['listings/options', id, settlementDate],
    queryFn: () =>
      getListingOptions(
        client,
        id,
        decodeURIComponent(settlementDate.toISOString())
      ),
  });

  const { data: priceChanges } = useQuery({
    queryKey: ['listings/priceChanges', id],
    queryFn: () => getPriceChanges(client, id),
  });

  const { data: details } = useQuery({
    queryKey: ['listings/detailed', id],
    queryFn: () => getListingDetails(client, id),
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: addYears(new Date(), -5),
    to: new Date(),
  });

  const filteredPriceChanges = React.useMemo(() => {
    if (priceChanges?.data && date?.from && date?.to) {
      return priceChanges.data.filter(
        (x) => new Date(x.date) > date.from! && new Date(x.date) < date.to!
      );
    }
    return [];
  }, [date, priceChanges]);

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getAccounts(client).then((res) =>
      setAccounts(res.data.map((a) => ({ id: a.id, name: a.accountNumber })))
    );
  }, [client]);

  const handlePreview = async (
    req: OrderPreviewRequest
  ): Promise<OrderPreviewDto> => {
    return (await calculateAveragePrice(client, req)).data;
  };

  const handleConfirm = async (formValues: OrderFormValues) => {
    const mapped: CreateOrderRequest = {
      ...formValues,
      limitValue: {
        amount: formValues.limitValue,
        currency: formValues.currency,
      },
      stopValue: {
        amount: formValues.stopValue,
        currency: formValues.currency,
      },
    };
    await createOrder(client, mapped);
  };

  if (!id || !securityType || !isValidSecurityType(securityType))
    return notFound();

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{details?.data.ticker}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xl">{details?.data.price.toFixed(2)}</span>
            {details?.data.change != null && (
              <span
                className={cn(
                  'text-sm',
                  details.data.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {details.data.change >= 0 ? '+' : ''}
                {details.data.change.toFixed(2)} (
                {details.data.change.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log('Opening native button');
            setOrderDialogOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Order (native)
        </button>
      </div>

      {details && <ListingCard listing={details.data} />}

      <OrderCreationDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        accounts={accounts}
        onPreview={handlePreview}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
