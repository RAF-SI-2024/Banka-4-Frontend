import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/dataTable/DataTable';
import { TransactionDto } from '@/api/response/transaction';
import { transactionColumns } from '@/ui/dataTables/transactions/transactionColumns';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTransactions } from '@/api/transaction';
import useTablePageParams from '@/hooks/useTablePageParams';
import { AccountDto } from '@/api/response/account';
import { useHttpClient } from '@/context/HttpClientContext';
import { formatAccountNumber } from '@/lib/account-utils';

interface TransactionsCardProps {
  selectedAccount: AccountDto;
}

export default function TransactionsCard(props: TransactionsCardProps) {
  const client = useHttpClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto | null>(null);
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'transactions',
    {
      pageSize: 10,
      page: 0,
    }
  );

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [
      'transactions',
      props.selectedAccount.accountNumber,
      page,
      pageSize,
    ],
    queryFn: async () => {
      const response = await searchTransactions(
        client,
        { accountNumber: props.selectedAccount.accountNumber },
        page,
        pageSize
      );
      return response.data;
    },
  });

  return (
    <Card className="mt-4 shadow-md">
      <CardHeader>
        <CardTitle>
          Transactions on{' '}
          {formatAccountNumber(props.selectedAccount.accountNumber)}
        </CardTitle>
        <CardDescription>
          View all transactions related to your accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable<TransactionDto>
          onRowClick={(row) => setSelectedTransaction(row.original)}
          columns={transactionColumns}
          data={transactions?.content ?? []}
          isLoading={isLoadingTransactions}
          pageCount={transactions?.page.totalPages ?? 0}
          pagination={{ page, pageSize }}
          onPaginationChange={(newPagination) => {
            setPage(newPagination.page);
            setPageSize(newPagination.pageSize);
          }}
        />
      </CardContent>
    </Card>
  );
}
