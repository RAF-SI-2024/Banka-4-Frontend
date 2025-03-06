'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Account {
  id: string;
  accountNumber: string;
  availableBalance: number;
  currency: {
    code: string;
    symbol: string;
  };
}

interface TransferFormProps {
  accounts: Account[];
  onSubmit: (transferData: {
    fromAccount: string;
    toAccount: string;
    fromAmount: number;
  }) => void;
}

const transferSchema = z.object({
  fromAccount: z.string().min(1, 'Please select an account'),
  toAccount: z.string().min(1, 'Please select an account'),
  fromAmount: z.coerce.number({ invalid_type_error: 'Invalid amount' }),
});

export default function TransferForm({
  accounts,
  onSubmit,
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
    (acc) =>
      acc.currency.code === selectedFromAccount?.currency.code &&
      acc.accountNumber !== fromAccount
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
      ? Math.max(selectedFromAccount.availableBalance - amount, 0)
      : selectedFromAccount?.availableBalance;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-[500px] shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/80 dark:bg-black/50 rounded-lg p-6 transition-all hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Transfer Funds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* FROM Account */}
              <FormField
                control={form.control}
                name="fromAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      From Account
                    </FormLabel>
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
                              {account.accountNumber} ({account.currency.symbol}
                              )
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      To Account
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        disabled={!fromAccount}
                      >
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
                                {account.accountNumber} (
                                {account.currency.symbol})
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
                        <Input
                          className="flex-1 border-none focus:ring-0 bg-transparent text-lg font-semibold text-gray-800 dark:text-white"
                          placeholder="Enter amount"
                          {...field}
                        />
                        <span className="ml-2 font-medium text-gray-500 dark:text-gray-400">
                          {selectedFromAccount
                            ? selectedFromAccount.currency.code
                            : 'RSD'}
                        </span>
                      </div>
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
                  disabled={!fromAccount || !filteredToAccounts.length}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
