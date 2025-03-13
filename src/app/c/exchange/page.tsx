'use client';

import React, { useEffect, useState } from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { exchangeColumns } from '@/ui/dataTables/exchange/exchange-column';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { exchange } from '@/api/response/exchange';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ExchangePage: React.FC = () => {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [{ title: 'Home', url: '/c' }, { title: 'Exchange' }],
    });
  }, [dispatch]);

  const [fromCurrency, setFromCurrency] = useState<string | undefined>(
    undefined
  );
  const [toCurrency, setToCurrency] = useState<string | undefined>(undefined);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [amount, setAmount] = useState(1);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const [exchangeData, setExchangeData] = useState<exchange[]>([]);

  const fetchExchangeRate = async () => {
    const x = await fetch('http://localhost:8080/exchange/exchange-rate');
    const y = await x.json();
    const { exchanges } = y;

    const formattedExchanges = Object.keys(exchanges).map((key) => ({
      Base: exchanges[key].Base,
      Quote: exchanges[key].Quote,
      Buy: exchanges[key].Buy,
      Neutral: exchanges[key].Neutral,
      Sell: exchanges[key].Sell,
    }));

    const uniqueCurrencies = [...new Set(Object.keys(exchanges))];

    console.log('Exchange Data:', formattedExchanges);
    console.log('Available Currencies:', uniqueCurrencies);

    setAvailableCurrencies(uniqueCurrencies);

    console.log(exchanges);
    setExchangeData(formattedExchanges);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  }

  //TODO: uraditi preko implementiranog DataTable-a kada se sredi ruta
  function DataTableTemporary<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeData: exchange[]
  ): number => {
    if (fromCurrency === toCurrency) return amount;

    if (fromCurrency === 'RSD') {
      const directExchange = exchangeData.find((e) => e.Base === toCurrency);
      return directExchange ? amount / directExchange.Sell : 0;
    }

    if (toCurrency === 'RSD') {
      const directExchange = exchangeData.find((e) => e.Base === fromCurrency);
      return directExchange ? amount * directExchange.Sell : 0;
    }

    const fromToRSD = exchangeData.find((e) => e.Base === fromCurrency);
    const rsdToTarget = exchangeData.find((e) => e.Base === toCurrency);

    if (fromToRSD && rsdToTarget) {
      const amountInRSD = amount * fromToRSD.Sell;
      return amountInRSD / rsdToTarget.Sell;
    }

    return 0;
  };

  return (
    <GuardBlock requiredUserType={'client'}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto p-4">
          <CardContent className="rounded-lg overflow-hidden  items-center">
            <DataTableTemporary columns={exchangeColumns} data={exchangeData} />
          </CardContent>
        </Card>
      </div>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto rounded-lg">
          <CardContent className="flex items-center gap-4 p-10">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Amount</span>
              <Input
                type="number"
                defaultValue="1.00"
                className="bg-gray-800 text-white w-32 rounded-md p-2"
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value));
                  setConvertedAmount(null);
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">From</span>
                <Select
                  value={fromCurrency}
                  onValueChange={(value) => {
                    setFromCurrency(value);
                    setConvertedAmount(null);
                  }}
                >
                  <SelectTrigger className="w-48 bg-gray-800 text-white rounded-md p-2">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={swapCurrencies}
                className="hover:bg-gray-700 rounded-md p-2"
              >
                <ArrowLeftRight className="text-white" />
              </Button>

              <div className="flex flex-col">
                <span className="text-sm text-gray-400">To</span>
                <Select
                  value={toCurrency}
                  onValueChange={(value) => {
                    setToCurrency(value);
                    setConvertedAmount(null);
                  }}
                >
                  <SelectTrigger className="w-48 bg-gray-800 text-white rounded-md p-2">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col">
              <Button
                onClick={() => {
                  if (fromCurrency && toCurrency) {
                    setConvertedAmount(
                      convertCurrency(
                        amount,
                        fromCurrency,
                        toCurrency,
                        exchangeData
                      )
                    );
                  }
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                Convert
              </Button>
            </div>
            {convertedAmount !== null && (
              <div className="flec flex-row text-lg font-semibold text-white mt-4">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
};

export default ExchangePage;
