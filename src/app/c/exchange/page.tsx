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
import useTablePageParams from '@/hooks/useTablePageParams';
import { useHttpClient } from '@/context/HttpClientContext';
import { searchExchanges } from '@/api/exchange';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/dataTable/DataTable';

const ExchangePage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'accounts',
    { pageSize: 8, page: 0 }
  );

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

  const client = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: ['exchange', page, pageSize],
    queryFn: async () => {
      const response = await searchExchanges(client, pageSize, page);

      const uniqueCurrencies = [
        ...new Set(Object.keys(response.data.exchanges)),
        'RSD',
      ];

      setAvailableCurrencies(uniqueCurrencies);

      const formattedExchanges = Object.values(response.data.exchanges).map(
        (exchange) => ({
          Base: exchange.Base,
          Quote: exchange.Quote,
          Buy: exchange.Buy,
          Neutral: exchange.Neutral,
          Sell: exchange.Sell,
        })
      );
      setExchangeData(formattedExchanges);
      return formattedExchanges;
    },
  });

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
      <div className="p-4">
        <Card className="max-w-[900px] mx-auto rounded-lg p-6">
          <CardContent className="flex flex-col items-center gap-6 p-10">
            <div className="flex items-end gap-6 w-full justify-center">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-1">
                  Amount
                </span>
                <Input
                  type="number"
                  defaultValue="1"
                  className="w-32 rounded-md p-2 text-center"
                  onChange={(e) => {
                    setAmount(parseFloat(e.target.value));
                    setConvertedAmount(null);
                  }}
                />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">
                    From
                  </span>
                  <Select
                    value={fromCurrency}
                    onValueChange={(value) => {
                      setFromCurrency(value);
                      setConvertedAmount(null);
                    }}
                  >
                    <SelectTrigger className="w-48 rounded-md p-2">
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
                <Button variant="ghost" size="icon" onClick={swapCurrencies}>
                  <ArrowLeftRight />
                </Button>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-1">To</span>
                  <Select
                    value={toCurrency}
                    onValueChange={(value) => {
                      setToCurrency(value);
                      setConvertedAmount(null);
                    }}
                  >
                    <SelectTrigger className="w-48 rounded-md p-2">
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
              <div className="flex flex-col items-center">
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
                  variant={'default'}
                >
                  Convert
                </Button>
              </div>
            </div>
            {convertedAmount !== null && (
              <div className="text-2xl font-semibold mt-6 text-center">
                {amount.toLocaleString()} {fromCurrency} ={' '}
                {convertedAmount.toLocaleString()} {toCurrency}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        <Card className="max-w-[900px] mx-auto p-4">
          <CardContent className="rounded-lg overflow-hidden items-center">
            <DataTable
              columns={exchangeColumns}
              data={data ?? []}
              isLoading={isLoading}
              pageCount={0}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
};

export default ExchangePage;
