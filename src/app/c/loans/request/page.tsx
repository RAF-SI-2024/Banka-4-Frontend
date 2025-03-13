'use client';

import React, { useEffect } from 'react';
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

export default function RequestLoanPage() {
  const { dispatch } = useBreadcrumb();

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

  function handleLoanSubmit(action: LoanFormAction) {
    console.log('Creating new loan request with data:', action.data);
    // API call will be added later.
  }

  // Pass a static array of accounts as a prop (in a real scenario, fetched from API)
  const accounts = [
    { accountNumber: '35123456789012345000', currency: 'RSD' },
    { accountNumber: '35123456789012345001', currency: 'EUR' },
    { accountNumber: '35123456789012345002', currency: 'RSD' },
  ];

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
              isPending={false}
              accounts={accounts}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
