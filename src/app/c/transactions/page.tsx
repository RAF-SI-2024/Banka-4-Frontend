'use client';
import { TransactionDto, TransactionStatus } from '@/api/response/transaction';
import { searchTransactions, TransactionFilters } from '@/api/transaction';
import { DataTable } from '@/components/dataTable/DataTable';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
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

  // Initial filter values
  const [paymentFilters, setPaymentFilters] = useState<TransactionFilters>({
    date: undefined,
    status: undefined,
    amount: undefined,
    accountNumber: params.get('an') ?? '',
  });

  const transactionFilterColumns: Record<
    keyof TransactionFilters,
    FilterDefinition
  > = {
    date: {
      filterType: 'timestamp',
      placeholder: 'Select date',
    },
    status: {
      filterType: 'enum',
      placeholder: 'Select status',
      options: Object.values(TransactionStatus),
      optionToString: (opt: string) => {
        switch (opt) {
          case TransactionStatus.REALIZED:
            return 'Realized';
          case TransactionStatus.REJECTED:
            return 'Rejected';
          case TransactionStatus.IN_PROGRESS:
            return 'In Progress';
          default:
            throw new Error('optionToString not implemented for case: ' + opt);
        }
      },
    },
    amount: {
      filterType: 'number',
      placeholder: 'Enter amount',
    },
    accountNumber: {
      filterType: 'string',
      placeholder: 'Enter account number',
    },
  };

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
    queryKey: ['transaction', page, pageSize, paymentFilters],
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
            <FilterBar<TransactionFilters, typeof transactionFilterColumns>
              onSubmit={(filter) => {
                setPage(0);
                setPaymentFilters(filter);
              }}
              filter={paymentFilters}
              columns={transactionFilterColumns}
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
}
