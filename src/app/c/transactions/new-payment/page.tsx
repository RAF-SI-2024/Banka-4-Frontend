'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import NewTransactionForm, {
  NewTransactionFormValues,
} from '@/components/client/new-transaction-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Dialog2FA } from '@/components/Dialog2FA';
import { getAccounts } from '@/api/account';
import { createPayment, getSavedClientContacts } from '@/api/client';
import GuardBlock from '@/components/GuardBlock';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { toast, Toaster } from 'sonner';
import { NewPaymentRequest } from '@/api/request/transaction';

export default function NewPaymentPage() {
  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Transactions', url: '/c/transactions' },
        { title: 'New Payment' },
      ],
    });
  }, [dispatch]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentData, setPaymentData] =
    useState<NewTransactionFormValues | null>(null);

  const client = useHttpClient();

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return (await getAccounts(client)).data;
    },
  });

  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['recipients'],
    queryFn: async () => {
      return (await getSavedClientContacts(client)).data;
    },
  });

  const { mutate: makePayment, isPending } = useMutation({
    mutationKey: ['payment'],
    mutationFn: async (paymentRequest: NewPaymentRequest) =>
      await createPayment(client, paymentRequest),
    onSuccess: () => {
      setIsDialogOpen(false);
      setPaymentData(null);
      toast.success('Payment was successful.');
    },
  });

  const handleCreatePayment = async (data: NewTransactionFormValues) => {
    setPaymentData(data);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (otp: string) => {
    if (!paymentData) {
      throw Error('invalid state.');
    }

    if (paymentData.payerAccount === paymentData.recipientAccount) {
      toast.error('You cannot make a payment to the same account.');
      setIsDialogOpen(false);
      return;
    }

    makePayment({
      fromAccount: paymentData.payerAccount,
      toAccount: paymentData.recipientAccount,
      recipient: paymentData.recipientName,
      fromAmount: paymentData.amount,
      paymentCode: paymentData.paymentCode,
      paymentPurpose: paymentData.paymentPurpose,
      referenceNumber: paymentData.referenceNumber ?? '',
      saveRecipient: paymentData.saveRecipient,
      otpCode: otp,
    });
  };

  return (
    <GuardBlock requiredUserType={'client'}>
      <div className={'pt-8 flex justify-center'}>
        <Card className="w-[800px]">
          <CardHeader>
            <h1 className="text-2xl font-bold">Make a new payment</h1>
            <CardDescription>
              Quickly send money to another account with just a few taps. Fast,
              secure, and hassle-free.
            </CardDescription>
          </CardHeader>
          <hr className={'mx-6'} />
          <CardContent className={'pt-6'}>
            <NewTransactionForm
              onSubmitAction={handleCreatePayment}
              accounts={accounts ?? []}
              recipients={recipients ?? []}
              isPending={isPending || isLoadingAccounts || isLoadingRecipients}
            />
            <Dialog2FA
              open={isDialogOpen}
              onSubmit={handleDialogSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
