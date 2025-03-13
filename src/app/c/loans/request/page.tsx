'use client';

import React, { useEffect, useMemo } from 'react';
import GuardBlock from '@/components/GuardBlock';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoanFormCard, {
  LoanFormAction,
} from '@/components/loans/loan-form-card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { toastRequestError } from '@/api/errors';
import { requestLoan } from '@/api/loan';
import { NewLoanRequest } from '@/api/request/loan';
import { LoanRequestResponseDto } from '@/api/response/loan';
import { toast } from 'sonner';

import { AccountDto } from '@/api/response/account';
import { getClientAccounts } from '@/api/account';

export default function RequestLoanPage() {
  const { dispatch } = useBreadcrumb();
  const client = useHttpClient();

  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Loans', url: '/c/loans' },
        { title: 'Request' },
      ],
    });
  }, [dispatch]);

  const {
    data: accountsData = [],
    isLoading,
    error,
  } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => (await getClientAccounts(client)).data,
  });

  React.useEffect(() => {
    if (error) {
      toastRequestError(error);
    }
  }, [error]);

  const accounts = useMemo(() => {
    if (!accountsData) return [];
    return accountsData.map((acc) => ({
      accountNumber: acc.accountNumber,
      currency: acc.currency.code,
    }));
  }, [accountsData]);

  const createLoanMutation = useMutation<
    LoanRequestResponseDto,
    Error,
    NewLoanRequest
  >({
    mutationFn: async (data: NewLoanRequest) => {
      const response = await requestLoan(client, data);
      return response.data;
    },
    onSuccess: (loanResponse) => {
      toast.success(
        loanResponse.message || 'Loan request processed successfully!'
      );
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  function handleLoanSubmit(action: LoanFormAction) {
    createLoanMutation.mutate(action.data, {
      onSettled: () => {},
    });
  }

  return (
    <GuardBlock requiredUserType="client">
      <div className="flex justify-center items-center pt-8">
        <Card className="w-full max-w-[900px]">
          <CardHeader>
            <CardTitle>Loan Request</CardTitle>
            <CardDescription>
              Submit a new loan request using the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoanFormCard
              onSubmit={handleLoanSubmit}
              onCancel={() => {}}
              isPending={isLoading}
              accounts={accounts}
            />
            {error && (
              <p className="text-red-500 mt-4">
                Failed to load accounts. Please try again later.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
