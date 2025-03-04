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
    amount: number;
  }) => void;
}

const transferSchema = z.object({
  fromAccount: z.string().min(1, 'Please select an account'),
  toAccount: z.string().min(1, 'Please select an account'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
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
      amount: '',
    },
  });

  const fromAccount = form.watch('fromAccount');
  const selectedFromAccount = accounts.find((acc) => acc.id === fromAccount);

  const filteredToAccounts = accounts.filter(
    (acc) =>
      acc.currency.code === selectedFromAccount?.currency.code &&
      acc.id !== fromAccount
  );

  function handleSubmit(data: {
    fromAccount: string;
    toAccount: string;
    amount: string;
  }) {
    onSubmit({
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      amount: parseFloat(data.amount),
    });
  }

  return (
    <div className="flex justify-center items-center pt-16">
      <Card className="w-[500px] shadow-lg border bg-white p-6 transition-all hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold text-gray-800">
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
                    <FormLabel>From Account</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.accountNumber} ({account.currency.symbol}
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {selectedFromAccount && (
                      <p className="text-sm text-gray-600 mt-1">
                        Available:{' '}
                        <span className="font-semibold">
                          {selectedFromAccount.availableBalance}
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
                              <SelectItem key={account.id} value={account.id}>
                                {account.accountNumber} (
                                {account.currency.symbol})
                              </SelectItem>
                            ))
                          ) : (
                            <p className="text-gray-500 p-2 text-sm">
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <Input
                          className="flex-1 border-none focus:ring-0 text-lg font-semibold"
                          placeholder="Enter amount"
                          {...field}
                        />
                        <span className="ml-2 text-gray-500 font-medium">
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="px-3 py-1 text-sm"
                disabled={!fromAccount || !filteredToAccounts.length}
              >
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
