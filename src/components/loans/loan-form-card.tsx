'use client';

import * as React from 'react';
import LoanForm, {
  LoanFormAction,
  LoanFormValues,
} from '@/components/loans/loan-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export type { LoanFormAction, LoanFormValues };

export interface LoanFormCardProps {
  defaultValues?: Partial<LoanFormValues>;
  isPending: boolean;
  onSubmit: (action: LoanFormAction) => void;
  accounts: { accountNumber: string; currency: string }[];
}

export default function LoanFormCard({
  defaultValues,
  isPending,
  onSubmit,
  accounts,
}: LoanFormCardProps) {
  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader className="p-4">
        <h2 className="text-2xl font-semibold">New Loan Request</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Fill out the form below to request a new loan.
        </p>
      </CardHeader>
      <CardContent>
        <LoanForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isPending={isPending}
          accounts={accounts}
        />
      </CardContent>
    </Card>
  );
}
