'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputFieldWithCurrency } from '../ui/input-with-currency';

interface Account {
  id: string;
  accountNumber: string;
  balance: number /* TODO: this should be changed back to availableBalance in the coming sprints. */;
  currency: {
    code: string;
    symbol: string;
  };
}

interface TransferFormProps {
  accounts: Account[];
  onSubmit: (transferData: TransferFormValues) => void;
  isPending: boolean;
}

const transferSchema = z.object({
  fromAccount: z.string().min(1, 'Please select an account'),
  toAccount: z.string().min(1, 'Please select an account'),
  fromAmount: z.coerce.number({ invalid_type_error: 'Invalid amount' }),
});

export type TransferFormValues = z.infer<typeof transferSchema>;

export default function TransferForm({
  accounts,
  onSubmit,
  isPending,
}: TransferFormProps) {
  const form = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      fromAmount: 0,
    },
  });

  const fromAccount = form.watch('fromAccount');
  const amount = form.watch('fromAmount');
  const selectedFromAccount = accounts.find(
    (acc) => acc.accountNumber === fromAccount
  );

  const filteredToAccounts = accounts.filter(
    (acc) => acc.accountNumber !== fromAccount
  );

  function handleSubmit(data: {
    fromAccount: string;
    toAccount: string;
    fromAmount: number;
  }) {
    onSubmit(data);
  }

  const adjustedBalance =
    selectedFromAccount && amount
      ? Math.max(selectedFromAccount.balance - amount, 0)
      : selectedFromAccount?.balance;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* FROM Account */}
        <FormField
          control={form.control}
          name="fromAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Account</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.accountNumber}
                      >
                        {account.accountNumber} ({account.currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {selectedFromAccount && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Available:{' '}
                  <span className="font-semibold">
                    {adjustedBalance?.toLocaleString()}
                  </span>{' '}
                  {selectedFromAccount.currency.code}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TO Account */}
        <FormField
          control={form.control}
          name="toAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To Account</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} disabled={!fromAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredToAccounts.length > 0 ? (
                      filteredToAccounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.accountNumber}
                        >
                          {account.accountNumber} ({account.currency.symbol})
                        </SelectItem>
                      ))
                    ) : (
                      <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
                        No available accounts
                      </p>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="fromAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <InputFieldWithCurrency
                  currency={selectedFromAccount?.currency.code || 'RSD'}
                  field={{
                    ...field,
                    onChange: field.onChange,
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button aligned right */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-3 py-1 text-sm"
            disabled={!fromAccount || !filteredToAccounts.length || isPending}
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
