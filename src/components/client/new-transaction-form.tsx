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
import { useForm, useWatch } from 'react-hook-form';
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
import { AccountDto } from '@/api/response/account';
import { Switch } from '@/components/ui/switch';
import { SomePartial } from '@/types/utils';
import { ClientContactResponseDto } from '@/api/response/client';
import { formatAccountNumber } from '@/lib/account-utils';

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
  saveRecipient: z.boolean(),
});

export interface NewTransactionFormProps {
  onSubmitAction: (values: NewTransactionFormValues) => void;
  isPending: boolean;
  defaultValues?: SomePartial<NewTransactionFormValues, 'paymentCode'>;
  recipients: Array<ClientContactResponseDto>;
  accounts: Array<AccountDto>;
}

export default function NewTransactionForm({
  onSubmitAction,
  isPending,
  recipients,
  accounts,
  defaultValues,
}: NewTransactionFormProps) {
  const finalDefaultValues: NewTransactionFormValues = {
    recipientName: '',
    recipientAccount: '',
    amount: 0,
    referenceNumber: '',
    paymentCode: '289', // Preselect Payment Code "289"
    paymentPurpose: '',
    payerAccount: '',
    saveRecipient: true,
    ...(defaultValues || {}),
  };

  const form = useForm<NewTransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: finalDefaultValues,
    mode: 'onBlur',
  });

  const watchedRecipientName = useWatch({
    control: form.control,
    name: 'recipientName',
  });

  function _onSubmit(data: NewTransactionFormValues) {
    onSubmitAction(data);
  }

  const updatedRecipients = [
    { nickname: 'New recipient', accountNumber: '' },
    ...recipients,
  ];

  const handleRecipientChange = (value: string) => {
    const selectedRecipient = updatedRecipients.find(
      (recipient) => recipient.nickname === value
    );
    if (selectedRecipient) {
      form.setValue(
        'recipientName',
        selectedRecipient.nickname === 'New recipient'
          ? ''
          : selectedRecipient.nickname
      );
      form.setValue('recipientAccount', selectedRecipient.accountNumber);
      form.clearErrors(['recipientName', 'recipientAccount']);
    }
  };

  return (
    <div className="w-full h-content flex flex-col gap-4 items-start justify-center">
      <div className="flex gap-5 items-center">
        {/* Choose from saved recipients select */}
        <h5 className="text-xl font-semibold">Saved recipients</h5>
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={handleRecipientChange}>
            <SelectTrigger
              id={'savedRecipient'}
              name={'savedRecipient'}
              className="min-w-[200px]"
            >
              <SelectValue placeholder="Select a recipient" />
            </SelectTrigger>
            <SelectContent>
              {updatedRecipients.map(
                (
                  recipient:
                    | ClientContactResponseDto
                    | {
                        nickname: string;
                        accountNumber: string;
                      },
                  index: number
                ) => (
                  <SelectItem key={index} value={recipient.nickname}>
                    {recipient.nickname}
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
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id={'payerAccount'}>
                      <SelectValue placeholder="Select your account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((account, index) => (
                      <SelectItem key={index} value={account.accountNumber}>
                        <div className="space-x-1">
                          <span>
                            {formatAccountNumber(account.accountNumber)}
                          </span>
                          <span
                            id={`account-${index}`}
                            className="text-muted-foreground"
                          >
                            ({account.currency.code})
                          </span>
                        </div>
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
                  Recipient Name <span className="text-red-500">*</span>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a payment code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(PAYMENT_CODE_MAP).map((code) => (
                      <SelectItem
                        key={code}
                        value={code}
                        className="max-w-[600px] whitespace-normal"
                      >
                        {code} - {PAYMENT_CODE_MAP[code]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex items-end justify-between w-full col-span-2">
            {/* Save as new recipient */}
            <FormField
              control={form.control}
              name="saveRecipient"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <Switch
                    id="saveRecipient"
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    disabled={watchedRecipientName !== ''}
                  />
                  <FormLabel htmlFor="saveRecipient" className="!mt-0">
                    Save as new recipient
                  </FormLabel>
                </FormItem>
              )}
            />
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
