'use client';

import { TransactionDto } from '@/api/response/transaction';
import { AccountDto } from '@/api/response/account';
import { ColumnDef } from '@tanstack/react-table';
import { fetchTransactions } from '@/api/transactions';
import { fetchAccounts } from '@/api/accounts';
import React, { useState, useEffect } from 'react';
import { AccountCarousel } from '@/components/account/account-carousel';
import { DataTable } from '@/components/dataTable/DataTable';
import { useHttpClient } from '@/context/HttpClientContext';
import { useQuery } from '@tanstack/react-query';

export const transactionsColumns: ColumnDef<TransactionDto>[] = [
  {
    header: 'Transaction Number',
    accessorKey: 'transactionNumber',
  },
  {
    header: 'From Account',
    accessorKey: 'fromAccount',
  },
  {
    header: 'To Account',
    accessorKey: 'toAccount',
  },
  {
    header: 'Amount',
    accessorKey: 'fromAmount',
  },
  {
    header: 'Currency',
    accessorKey: 'fromCurrency',
  },
  {
    header: 'Recipient',
    accessorKey: 'recipient',
  },
  {
    header: 'Payment Purpose',
    accessorKey: 'paymentPurpose',
  },
  {
    header: 'Date',
    accessorKey: 'paymentDateTime',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
];

const ClientHomePage: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null
  );
  const client = useHttpClient();

  const { data: accounts } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetchAccounts(client);
      return response.data;
    },
  });

  const { data: transactions } = useQuery<TransactionDto[]>({
    queryKey: ['transactions', selectedAccount?.accountNumber],
    queryFn: async () => {
      const response = await fetchTransactions(
        client,
        selectedAccount?.accountNumber
      );
      return response;
    },
    enabled: !!selectedAccount,
  });

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Client Accounts</h1>
      {accounts && (
        <AccountCarousel
          items={accounts.map((account) => ({
            accountNumber: account.accountNumber,
            balance: account.balance,
            valuta: account.currency.code,
            owner: account.client.firstName + ' ' + account.client.lastName,
            type: account.accountType,
            availableResources: account.availableBalance,
            reservedResources: account.accountMaintenance,
          }))}
          onSelect={(accountNumber: string) => {
            const account =
              accounts?.find((acc) => acc.accountNumber === accountNumber) ||
              null;
            setSelectedAccount(account);
          }}
        />
      )}
      {selectedAccount && (
        <div className="w-full mt-4">
          <h2 className="text-xl font-semibold">
            Transactions for Account: {selectedAccount.accountNumber}
          </h2>
          <DataTable
            columns={transactionsColumns}
            data={transactions || []}
            isLoading={!transactions}
            pagination={{ page: 0, pageSize: 10 }}
            onPaginationChange={() => {}}
            pageCount={Math.ceil((transactions?.length || 0) / 10)}
          />
        </div>
      )}
    </div>
  );
};

export default ClientHomePage;
