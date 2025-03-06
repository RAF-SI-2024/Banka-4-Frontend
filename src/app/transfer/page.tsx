'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import TransferForm from '@/components/transfer/transfer-form';
import { getAllAccounts } from '@/api/account';
import { postNewTransfer } from '@/api/transfer';
import { AccountDto } from '@/api/response/account';
import { useHttpClient } from '@/context/HttpClientContext';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

interface TransferData {
  fromAccount: string;
  toAccount: string;
  fromAmount: number;
}

export default function TransferPage() {
  const client = useHttpClient();

  const {
    data: accounts = [],
    isLoading,
    error,
  } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: () => getAllAccounts(client),
  });

  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);

  const mutation = useMutation({
    mutationFn: (transferData: TransferData) =>
      postNewTransfer(client, transferData),
    onSuccess: () => {
      setIsTransferSuccessful(true);
    },
    onError: () => {
      alert('Failed to complete the transfer. Please try again later.');
    },
  });

  const handleTransferSubmit = (transferData: TransferData) => {
    console.log(transferData);
    mutation.mutate(transferData);
  };

  if (isLoading) return <p>Loading accounts...</p>;
  if (error) return <p>Error loading accounts</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card>
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
          <CardDescription>
            Fill in the details below to transfer funds between accounts.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TransferForm accounts={accounts} onSubmit={handleTransferSubmit} />
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Transaction details are required to process the transfer.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
