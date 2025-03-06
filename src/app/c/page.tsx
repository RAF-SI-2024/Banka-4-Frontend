'use client';

import { TransactionDto } from '@/api/response/transaction';
import { AccountDto } from '@/api/response/account';
import { ColumnDef } from '@tanstack/react-table';
import { fetchTransactions } from '@/api/transactions';
import { fetchAccounts } from '@/api/accounts';
import React, { useState, useEffect } from 'react';
import { AccountCarousel } from '@/components/account/account-carousel';
import { DataTable } from '@/components/dataTable/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { formatAccountNumber } from '@/lib/account-utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { transactionColumns } from '@/ui/dataTables/transactions/transactionColumns';

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
    <div>
      {accounts && (
        <AccountCarousel
          items={accounts.map((account) => ({
            accountNumber: account.accountNumber,
            balance: account.balance,
            currencyCode: account.currency.code,
            owner: account.client.firstName + ' ' + account.client.lastName,
            type: account.accountType,
            availableBalance: account.availableBalance,
            reservedBalance: 0 /* TODO(marko): this sprint, reservedBalance is always 0, fix this when the time comes */,
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
        <div className={'flex flex-col items-center justify-center'}>
          <Card className="max-w-[900px] w-full mx-auto">
            <CardHeader>
              <h1 className="text-2xl font-bold">
                Transactions for Account:{' '}
                {formatAccountNumber(selectedAccount.accountNumber)}
              </h1>
              <CardDescription>
                This table provides a clear and organized overview of key
                transactions details for quick reference and easy access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={transactionColumns}
                data={transactions || []}
                isLoading={!transactions}
                pagination={{ page: 0, pageSize: 8 }}
                onPaginationChange={() => {}}
                pageCount={Math.ceil((transactions?.length || 0) / 8)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientHomePage;
