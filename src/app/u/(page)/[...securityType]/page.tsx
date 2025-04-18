'use client';
import { notFound } from 'next/navigation';
import * as React from 'react';
import { use, useState } from 'react';
import { isValidSecurityType } from '../isValidSecurityType';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import OrderCreationDialog from '@/components/order/OrderCreationDialog';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import ListingCard from './ListingCard';
import { PopoverClose } from '@radix-ui/react-popover';
import { DateRange } from 'react-day-picker';
import { getAccounts, getEmployeeAccounts } from '@/api/account';
import { CreateOrderRequest, OrderPreviewRequest } from '@/api/request/orders';
import { calculateAveragePrice, createOrder } from '@/api/orders';
import GuardBlock from '@/components/GuardBlock';
import { useMe } from '@/hooks/use-me';

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
      getValue: () => {
        const today = new Date();
        return {
          from: subDays(today, 7),
          to: today,
        };
      },
    },
    {
      name: 'Last Month',
      getValue: () => {
        const today = new Date();
        return {
          from: subMonths(today, 1),
          to: today,
        };
      },
    },
    {
      name: 'Last Year',
      getValue: () => {
        const today = new Date();
        return {
          from: subYears(today, 1),
          to: today,
        };
      },
    },
    {
      name: 'Last 5 Years',
      getValue: () => {
        const today = new Date();
        return {
          from: subYears(today, 5),
          to: today,
        };
      },
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
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Presets</h4>
                <div className="flex flex-col gap-1">
                  {presets.map((preset) => (
                    <PopoverClose
                      key={preset.name}
                      className={cn(
                        '!text-start !justify-start !font-normal',
                        buttonVariants({ variant: 'ghost' })
                      )}
                      onClick={() => {
                        setDate(preset.getValue());
                      }}
                    >
                      {preset.name}
                    </PopoverClose>
                  ))}
                </div>
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
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [settlementDate, setSettlementDate] = useState<Date>(new Date());
  const client = useHttpClient();
  const { securityType: securityTypeParam } = use(params);
  const [securityType, id] = securityTypeParam;

  const me = useMe();
  const isEmployee = me.state === 'logged-in' && me.type === 'employee';

  const handleBuy = (securityId: string) => {
    setSelectedAssetId(securityId);
    setBuyDialogOpen(true);
  };

  const { data: accounts } = useQuery({
    queryKey: ['accounts', isEmployee ? 'employee' : 'client'],
    queryFn: async () => {
      if (isEmployee) {
        return (await getEmployeeAccounts(client)).data;
      } else {
        return (await getAccounts(client)).data;
      }
    },
  });

  const previewMutation = useMutation({
    mutationKey: ['order-preview'],
    mutationFn: (request: OrderPreviewRequest) =>
      calculateAveragePrice(client, request),
  });

  const orderMutation = useMutation({
    mutationKey: ['create-order'],
    mutationFn: (orderRequest: CreateOrderRequest) =>
      createOrder(client, orderRequest),
  });

  const { data: options, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['listings/options', id, settlementDate],
    queryFn: async () =>
      await getListingOptions(
        client,
        id,
        decodeURIComponent(settlementDate.toISOString())
      ),
  });
  const { data: priceChanges } = useQuery({
    queryKey: ['listings/priceChanges', id],
    queryFn: async () => await getPriceChanges(client, id),
  });

  const { data: details } = useQuery({
    queryKey: ['listings/detailed', id],
    queryFn: async () => await getListingDetails(client, id),
  });
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getChangeColorClass = (value: number) => {
    if (value > 0) return 'text-green-600 font-medium';
    if (value < 0) return 'text-red-600 font-medium';
    return 'text-gray-700 dark:text-gray-200';
  };

  const [date, setDate] = useState<DateRange | undefined>({
    from: addYears(new Date(), -5),
    to: new Date(),
  });

  const filteredPriceChanges = React.useMemo(() => {
    if (priceChanges?.data && date && date.from != null && date.to != null) {
      return priceChanges.data.filter(
        (x) => new Date(x.date) > date.from! && new Date(x.date) < date.to!
      );
    }
  }, [date, priceChanges]);

  if (!id || !securityType || !isValidSecurityType(securityType))
    return notFound();

  return (
    <GuardBlock requiredPrivileges={['ADMIN', 'SUPERVISOR', 'AGENT', 'TRADE']}>
      <div className="container mx-auto py-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{details?.data.ticker}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl">{details?.data.price.toFixed(2)}</span>
              <span
                className={cn(
                  'text-sm',
                  details && details?.data.change >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {details && details?.data.change >= 0 ? '+' : ''}
                {details?.data.change.toFixed(2)} (
                {details?.data.change.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Price History</CardTitle>
              <DateRangePicker date={date} setDate={setDate} />
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: {
                    label: 'Price',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px]"
              >
                <LineChart
                  accessibilityLayer
                  data={filteredPriceChanges}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return format(date, 'MMM');
                    }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `$${Number(value).toFixed(2)}`}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {details && (
            <ListingCard
              listing={details.data}
              assetId={id}
              onBuy={handleBuy}
            />
          )}
        </div>
        {details?.data.securityType === 'STOCK' && (
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Options Chain</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-fit">
                  Settlement Date:
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(settlementDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={settlementDate}
                      onSelect={(n) => n && setSettlementDate(n)}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead colSpan={5} className="text-center border-r">
                        Calls
                      </TableHead>
                      <TableHead
                        colSpan={2}
                        rowSpan={2}
                        className="text-center"
                      >
                        Strike
                      </TableHead>
                      <TableHead colSpan={5} className="text-center border-l">
                        Puts
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-right">Last Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% Change</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead className="text-right border-r">
                        Open Int.
                      </TableHead>
                      <TableHead className="text-right border-l">
                        Last Price
                      </TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% Change</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead className="text-right">Open Int.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {options?.data.map((option) => (
                      <TableRow
                        key={option.strike}
                        className={cn(
                          option.strike === 190 ? 'bg-muted/50' : ''
                        )}
                      >
                        <TableCell className="text-right">
                          {formatPrice(option?.callsLastPrice)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${getChangeColorClass(option?.callsLastPrice)}`}
                        >
                          {formatChange(option?.callsChange)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${getChangeColorClass(
                            option.callsLastPrice !== 0
                              ? (option.callsChange /
                                  (option.callsLastPrice -
                                    option.callsChange)) *
                                  100
                              : 0
                          )}`}
                        >
                          {formatPercent(
                            option.callsLastPrice !== 0
                              ? (option.callsChange /
                                  (option.callsLastPrice -
                                    option.callsChange)) *
                                  100
                              : 0
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {option?.callsVolume.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right border-r`}>
                          {option.callsOpenInterest.toLocaleString()}
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          className="text-center font-medium"
                        >
                          ${option.strike.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right border-l">
                          {formatPrice(option?.putsLastPrice)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${getChangeColorClass(option?.putsChange)}`}
                        >
                          {formatChange(option?.putsChange)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${getChangeColorClass(
                            option.putsLastPrice !== 0
                              ? (option.putsChange /
                                  (option.putsLastPrice - option.putsChange)) *
                                  100
                              : 0
                          )}`}
                        >
                          {formatPercent(
                            option.putsLastPrice !== 0
                              ? (option.putsChange /
                                  (option.putsLastPrice - option.putsChange)) *
                                  100
                              : 0
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {option?.putsVolume.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right`}>
                          {option.putsOpenInterest.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        {buyDialogOpen &&
          selectedAssetId &&
          accounts &&
          accounts.length > 0 && (
            <OrderCreationDialog
              open={buyDialogOpen}
              direction="BUY"
              assetId={selectedAssetId}
              accounts={accounts}
              onPreviewRequested={(request) =>
                previewMutation.mutateAsync(request).then((res) => res.data)
              }
              onOrderConfirmed={(orderRequest) =>
                orderMutation.mutateAsync(orderRequest).then(() => {})
              }
              onClose={() => {
                setBuyDialogOpen(false);
                setSelectedAssetId(null);
              }}
            />
          )}
      </div>
    </GuardBlock>
  );
}
