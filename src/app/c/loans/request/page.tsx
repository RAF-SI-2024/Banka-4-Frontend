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
import LoanForm, { LoanFormAction } from '@/components/loans/loan-form';
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
    if (action.update) {
      console.log('Updating existing loan request with data:', action.data);
    } else {
      console.log('Creating new loan request with data:', action.data);
    }
    // Adding API call later
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
            <LoanForm
              isUpdate={false}
              onSubmit={handleLoanSubmit}
              isPending={false} // Za sada
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
