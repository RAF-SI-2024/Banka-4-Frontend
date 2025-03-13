'use client';

import React, { useEffect, useMemo } from 'react';
import GuardBlock from '@/components/GuardBlock';
import LoanFormCard, {
  LoanFormAction,
} from '@/components/loans/loan-form-card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useHttpClient } from '@/context/HttpClientContext';
import { toastRequestError } from '@/api/errors';
import { requestLoan } from '@/api/loan';
import { NewLoanRequest } from '@/api/request/loan';
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
    isError,
  } = useQuery<AccountDto[]>({
    queryKey: ['accounts'],
    queryFn: async () => (await getClientAccounts(client)).data,
  });

  React.useEffect(() => {
    if (isError) {
      toastRequestError(error);
    }
  }, [isError, error]);

  const accounts = useMemo(() => {
    if (!accountsData) return [];
    return accountsData.map((acc) => ({
      accountNumber: acc.accountNumber,
      currency: acc.currency.code,
    }));
  }, [accountsData]);

  const createLoanMutation = useMutation({
    mutationFn: async (data: NewLoanRequest) => {
      const response = await requestLoan(client, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        'Loan request processed successfully. One of our employees will get right to it!'
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
      <div className={'flex justify-center py-8'}>
        <LoanFormCard
          onSubmit={handleLoanSubmit}
          isPending={isLoading}
          accounts={accounts}
        />
        {error && (
          <p className="text-red-500 mt-4">
            Failed to load accounts. Please try again later.
          </p>
        )}
      </div>
    </GuardBlock>
  );
}
