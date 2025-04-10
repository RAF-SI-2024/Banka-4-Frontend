'use client';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OptionDto } from '@/api/response/listing';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import StockCard from './ListingCard';
import ListingCard from './ListingCard';

export default function Page({
  params,
}: {
  params: Promise<{ securityType: string[] }>;
}) {
  const [settlementDate, setSettlementDate] = useState<Date>(new Date());
  const client = useHttpClient();
  const { securityType: securityTypeParam } = use(params);
  const [securityType, id] = securityTypeParam;

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

  if (!id || !securityType || !isValidSecurityType(securityType))
    return notFound();

  return (
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium min-w-fit">
            Settlement Date:
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal')}
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
              />{' '}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Price History</CardTitle>
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
                data={priceChanges?.data}
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
        {details && <ListingCard listing={details.data} />}
      </div>
      {details?.data.securityType === 'STOCK' && (
        <Card>
          <CardHeader>
            <CardTitle>Options Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={5} className="text-center border-r">
                      Calls
                    </TableHead>
                    <TableHead colSpan={2} rowSpan={2} className="text-center">
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
                      className={cn(option.strike === 190 ? 'bg-muted/50' : '')}
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
                                (option.callsLastPrice - option.callsChange)) *
                                100
                            : 0
                        )}`}
                      >
                        {formatPercent(
                          option.callsLastPrice !== 0
                            ? (option.callsChange /
                                (option.callsLastPrice - option.callsChange)) *
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
    </div>
  );
}
