'use client';
import { TransactionDto } from '@/api/response/transaction';
import { PaymentFilters, searchPayments } from '@/api/transaction';
import { DataTable } from '@/components/dataTable/DataTable';
import FilterBar from '@/components/filters/FilterBar';
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

export default function TransactionsPage() {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'transactions',
    { pageSize: 8, page: 0 }
  );
  const client = useHttpClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto>();

  const [paymentFilters, setPaymentFilters] = useState<PaymentFilters>({
    date: undefined,
    status: undefined,
    amount: undefined,
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Transactions', url: '/c/transactions' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const { data, isLoading } = useQuery({
    queryKey: ['payment', page, pageSize],
    queryFn: async () => {
      const response = await searchPayments(
        client,
        paymentFilters,
        page,
        pageSize
      );
      return response.data;
    },
  });

  const transactionFilterKeyToName = (key: keyof PaymentFilters): string => {
    switch (key) {
      case 'amount':
        return 'Amount';
      case 'date':
        return 'Date';
      case 'status':
        return 'Status';
    }
  };

  return (
    <div className="p-8">
      <style>{'th, td {white-space: nowrap;}'}</style>
      <TransactionDialog
        dto={selectedTransaction}
        open={modalOpen}
        setOpen={setModalOpen}
      />
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Transactions Overview</h1>
          <CardDescription>
            This table provides a clear and organized overview of key
            transaction details for quick reference and easy access.
          </CardDescription>
          {/* TODO: date, enum and number filters */}
          <FilterBar<PaymentFilters>
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
              setModalOpen(true);
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
  );
}
