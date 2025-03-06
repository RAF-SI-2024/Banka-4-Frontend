'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import TransferForm from '@/components/transfer/transfer-form';
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
import { getAccounts } from '@/api/account';
import { toastRequestError } from '@/api/errors';

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
    queryFn: async () => (await getAccounts(client)).data,
  });

  const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);

  const mutation = useMutation({
    mutationFn: (transferData: TransferData) =>
      postNewTransfer(client, transferData),
    onSuccess: () => {
      setIsTransferSuccessful(true);
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const handleTransferSubmit = (transferData: TransferData) => {
    mutation.mutate(transferData);
  };

  return (
    <div className="flex justify-center items-center pt-12">
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
