'use client';
import { TransactionDto } from '@/api/response/transaction';
import { searchTransactions, TransactionFilters } from '@/api/transaction';
import { DataTable } from '@/components/dataTable/DataTable';
import FilterBar from '@/components/filters/FilterBar';
import GuardBlock from '@/components/GuardBlock';
import { TransactionDialog } from '@/components/transaction/TransactionDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useHttpClient } from '@/context/HttpClientContext';
import useTablePageParams from '@/hooks/useTablePageParams';
import { transactionColumns } from '@/ui/dataTables/transactions/transactionColumns';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TransactionsPage() {
  const params = useSearchParams();
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'transactions',
    { pageSize: 8, page: 0 }
  );
  const client = useHttpClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto>();

  const [paymentFilters, setPaymentFilters] = useState<TransactionFilters>({
    date: undefined,
    status: undefined,
    amount: undefined,
    accountNumber: params.get('an') ?? '',
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Transactions', url: '/c/transactions' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const { data, isLoading } = useQuery({
    queryKey: ['payment', page, pageSize],
    queryFn: async () => {
      const response = await searchTransactions(
        client,
        paymentFilters,
        page,
        pageSize
      );
      return response.data;
    },
  });

  const transactionFilterKeyToName = (
    key: keyof TransactionFilters
  ): string => {
    switch (key) {
      case 'amount':
        return 'Amount';
      case 'date':
        return 'Date';
      case 'status':
        return 'Status';
      case 'accountNumber':
        return 'account number';
    }
  };

  return (
    <GuardBlock>
      <div className="p-8">
        <style>{'th, td {white-space: nowrap;}'}</style>
        {selectedTransaction && (
          <TransactionDialog
            dto={selectedTransaction}
            open={true}
            setOpen={(open) =>
              setSelectedTransaction(open ? selectedTransaction : undefined)
            }
          />
        )}
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Transactions Overview</h1>
            <CardDescription>
              This table provides a clear and organized overview of key
              transaction details for quick reference and easy access.
            </CardDescription>
            {/* TODO: date, enum and number filters */}
            <FilterBar<TransactionFilters>
              filterKeyToName={transactionFilterKeyToName}
              onSearch={(filter) => {
                setPage(0);
                setPaymentFilters(filter);
              }}
              filter={paymentFilters}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              onRowClick={(row) => {
                setSelectedTransaction(row.original);
              }}
              columns={transactionColumns}
              data={data?.content ?? []}
              isLoading={isLoading}
              pageCount={data?.page.totalPages ?? 0}
              pagination={{ page: page, pageSize }}
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
}
