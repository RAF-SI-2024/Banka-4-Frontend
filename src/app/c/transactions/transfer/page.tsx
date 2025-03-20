'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import TransferForm, {
  TransferFormValues,
} from '@/components/transfer/transfer-form';
import { postNewTransfer } from '@/api/transfer';
import { AccountDto } from '@/api/response/account';
import { useHttpClient } from '@/context/HttpClientContext';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getClientAccounts } from '@/api/account';
import { toastRequestError } from '@/api/errors';
import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Dialog2FA } from '@/components/Dialog2FA';
import { NewTransferRequest } from '@/api/request/transfer';
import { toast } from 'sonner';

export default function TransferPage() {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Transactions', url: '/c/transactions' },
        { title: 'New Transfer' },
      ],
    });
  }, [dispatch]);
  const client = useHttpClient();

  const {
    data: accounts = [],
    isLoading,
    error,
    isError,
  } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => (await getClientAccounts(client)).data,
  });

  useEffect(() => {
    if (isError) {
      toastRequestError(error);
    }
  }, [isError, error]);

  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<TransferFormValues>();

  const mutation = useMutation({
    mutationFn: (transferData: NewTransferRequest) =>
      postNewTransfer(client, transferData),
    onSuccess: () => {
      toast.success('Transfer was successful.');
    },
  });

  const handleTransferSubmit = (formData: TransferFormValues) => {
    setPendingTransfer(formData);
    setIs2FAOpen(true);
  };

  const handle2FASubmit = async (otp: string) => {
    if (pendingTransfer === undefined) {
      throw Error('illegal state.');
    }

    setIs2FAOpen(false);
    mutation.mutate({ ...pendingTransfer, otpCode: otp });
  };

  return (
    <GuardBlock requiredUserType={'client'}>
      <div className="flex justify-center items-center pt-12">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
            <CardDescription>
              Fill in the details below to transfer funds between accounts.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TransferForm
              accounts={accounts}
              onSubmit={handleTransferSubmit}
              isPending={isLoading}
            />
          </CardContent>

          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Transaction details are required to process the transfer.
            </p>
          </CardFooter>
        </Card>
      </div>
      <Dialog2FA
        open={is2FAOpen}
        onSubmit={handle2FASubmit}
        onCancel={() => setIs2FAOpen(false)}
      />
    </GuardBlock>
  );
}
