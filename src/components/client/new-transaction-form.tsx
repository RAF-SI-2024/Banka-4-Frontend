'use client';

// For mock data
//   <NewTransactionForm
//   onSubmitAction={() => console.log('Form submitted with values:')}
//   isPending={false}
//   defaultValues={{
//     recipientName: '',
//     recipientAccount: '',
//     amount: 0,
//     referenceNumber: '',
//     paymentCode: '222',
//     paymentPurpose: '',
//     payerAccount: '',
//   }}
//   recepients={[
//     { name: 'John Doe', account: '11111111-2222-3333-4444-555555555555' },
//     { name: 'Jane Smith', account: '11111111-2222-3333-4444-555555555555' },
//     { name: 'Acme Corp', account: '11111111-2222-3333-4444-555555555555' },
//   ]}
//   accounts={mockAccounts}
// />

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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAYMENT_CODE_MAP } from '@/lib/payment-utils';
import { RecipientDto } from '@/api/response/recipient';
import { AccountDto } from '@/api/response/account';

export type NewTransactionFormValues = z.infer<typeof formSchema>;

const PAYMENT_CODES = Object.keys(PAYMENT_CODE_MAP) as [
  keyof typeof PAYMENT_CODE_MAP,
  ...(keyof typeof PAYMENT_CODE_MAP)[],
];

const formSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAccount: z.string().min(1, 'Recipient account is required'),
  amount: z.coerce.number().min(1, 'Amount is required'),
  referenceNumber: z.string().optional(),
  paymentCode: z.enum(PAYMENT_CODES, {
    required_error: 'Payment code is required',
  }),
  paymentPurpose: z.string().min(1, 'Payment purpose is required'),
  payerAccount: z.string().min(1, 'Payer account is required'),
});

export interface NewTransactionFormProps {
  onSubmitAction: (values: NewTransactionFormValues) => void;
  isPending: boolean;
  defaultValues: Partial<NewTransactionFormValues>;
  recepients: Array<RecipientDto>;
  accounts: Array<AccountDto>;
}

export default function NewTransactionForm({
  onSubmitAction,
  isPending,
  defaultValues,
  recepients,
  accounts,
}: NewTransactionFormProps) {
  const form = useForm<NewTransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });

  function _onSubmit(data: NewTransactionFormValues) {
    onSubmitAction(data);
  }

  const updatedRecipients = [
    { name: 'New recipient', account: '' },
    ...recepients,
  ];

  const handleRecipientChange = (value: string) => {
    const selectedRecipient = updatedRecipients.find(
      (recipient) => recipient.name === value
    );
    if (selectedRecipient) {
      form.setValue(
        'recipientName',
        selectedRecipient.name == 'New recipient' ? '' : selectedRecipient.name
      );
      form.setValue('recipientAccount', selectedRecipient.account);
    }
  };

  const handleAccountChange = (value: string) => {
    form.setValue('payerAccount', value);
  };

  return (
    <div className="w-full h-content flex flex-col gap-8 items-start justify-center">
      <div className="flex gap-5 items-center">
        <h3 className="text-xl font-semibold">Saved recipients</h3>
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={handleRecipientChange}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Select a recipient" />
            </SelectTrigger>
            <SelectContent>
              {updatedRecipients.map(
                (recipient: { name: string }, index: number) => (
                  <SelectItem key={index} value={recipient.name}>
                    {recipient.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(_onSubmit)}
          className="w-full grid grid-cols-2 gap-4"
        >
          {/* Payer Account */}
          <FormField
            control={form.control}
            name="payerAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Payer Account <span className="text-red-500">*</span>
                </FormLabel>
                <Select {...field} onValueChange={handleAccountChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((account, index) => (
                      <SelectItem key={index} value={account.accountNumber}>
                        {account.accountNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Recipient Name */}
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient Name <span className="text-red-500 ">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Recipient Name" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Recipient Account */}
          <FormField
            control={form.control}
            name="recipientAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Recipient Account <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Recipient Account" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Amount" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Reference Number */}
          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Reference Number" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Payment Purpose */}
          <FormField
            control={form.control}
            name="paymentPurpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Payment Purpose <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Payment Purpose" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Payment Code */}
          <FormField
            control={form.control}
            name="paymentCode"
            render={({ field }) => (
              <FormItem className="overflow-visible col-span-1">
                <FormLabel>
                  Payment Code <span className="text-red-500">*</span>
                </FormLabel>
                <Select {...field}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a recipient" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {Object.keys(PAYMENT_CODE_MAP).map((code) => (
                      <SelectItem
                        key={code}
                        value={code}
                        className="max-w-[600px] whitespace-normal"
                      >
                        {code}
                        {' - '}
                        {PAYMENT_CODE_MAP[code]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <div className="flex items-end justify-end w-full col-span-1">
            <Button
              disabled={isPending}
              type="submit"
              className="px-3 py-1 text-sm"
            >
              {isPending ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
