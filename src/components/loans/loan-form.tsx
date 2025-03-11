'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { getDirtyValues } from '@/lib/form-utils';

const loanTypes = [
  'CASH',
  'MORTGAGE',
  'AUTO',
  'REFINANCING',
  'STUDENT',
] as const;
const interestTypes = ['FIXED', 'VARIABLE', 'COMPOUND'] as const;
const employmentStatuses = ['PERMANENT', 'TEMPORARY', 'UNEMPLOYED'] as const;
const currencies = [
  'RSD',
  'EUR',
  'CHF',
  'USD',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
] as const;

const mortgagePeriods = [60, 120, 180, 240, 300, 360];
const defaultPeriods = [12, 24, 36, 48, 60, 72, 84];

const loanFormSchema = z.object({
  loanType: z.enum(loanTypes),
  interestType: z.enum(interestTypes),
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(1, 'Amount must be at least 1'),
  currency: z.enum(currencies),
  purposeOfLoan: z.string().min(1, 'Purpose is required'),
  monthlyIncome: z
    .number({ invalid_type_error: 'Monthly income is required' })
    .min(0, 'Income cannot be negative'),
  employmentStatus: z.enum(employmentStatuses),
  employmentPeriod: z
    .number({ invalid_type_error: 'Employment period is required' })
    .min(0, 'Employment period cannot be negative'),
  repaymentPeriod: z
    .number({ invalid_type_error: 'Repayment period is required' })
    .min(1, 'Repayment period must be at least 1'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;

export type LoanFormAction =
  | {
      update: true;
      data: Partial<LoanFormValues>;
    }
  | {
      update: false;
      data: LoanFormValues;
    };

interface LoanFormProps {
  isUpdate?: boolean;
  defaultValues?: Partial<LoanFormValues>;
  isPending?: boolean;
  onSubmit: (action: LoanFormAction) => void;
}

export default function LoanForm({
  isUpdate = false,
  defaultValues,
  isPending = false,
  onSubmit,
}: LoanFormProps) {
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanType: 'CASH',
      interestType: 'FIXED',
      currency: 'RSD',
      ...defaultValues,
    } as LoanFormValues,
  });

  const currentLoanType = useWatch({ control: form.control, name: 'loanType' });
  const currentCurrency = useWatch({ control: form.control, name: 'currency' });

  const clientAccounts = React.useMemo(
    () => [
      { accountNumber: '35123456789012345000', currency: 'RSD' },
      { accountNumber: '35123456789012345001', currency: 'EUR' },
      { accountNumber: '35123456789012345002', currency: 'RSD' },
    ],
    []
  );

  const filteredAccounts = React.useMemo(
    () => clientAccounts.filter((acc) => acc.currency === currentCurrency),
    [clientAccounts, currentCurrency]
  );

  function _onSubmit(values: LoanFormValues) {
    if (isUpdate) {
      onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, values),
      });
    } else {
      onSubmit({ update: false, data: values });
    }
  }

  const availableRepaymentPeriods =
    currentLoanType === 'MORTGAGE' ? mortgagePeriods : defaultPeriods;

  return (
    <div className="w-full max-w-[800px]">
      <Card>
        <CardHeader className="p-4">
          <h2 className="text-2xl font-semibold">
            {isUpdate ? 'Edit Loan Request' : 'New Loan Request'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isUpdate
              ? 'Update your existing loan request.'
              : 'Fill out the form below to request a new loan.'}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(_onSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              {/* Loan Type */}
              <FormField
                control={form.control}
                name="loanType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interest Type */}
              <FormField
                control={form.control}
                name="interestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interest type" />
                        </SelectTrigger>
                        <SelectContent>
                          {interestTypes.map((it) => (
                            <SelectItem key={it} value={it}>
                              {it}
                            </SelectItem>
                          ))}
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
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : +val);
                        }}
                        value={
                          field.value === undefined ? '' : String(field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((cur) => (
                            <SelectItem key={cur} value={cur}>
                              {cur}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Purpose of Loan */}
              <FormField
                control={form.control}
                name="purposeOfLoan"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter purpose" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Monthly Income */}
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter monthly income"
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : +val);
                        }}
                        value={
                          field.value === undefined ? '' : String(field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Status */}
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Period */}
              <FormField
                control={form.control}
                name="employmentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Period (years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : +val);
                        }}
                        value={
                          field.value === undefined ? '' : String(field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Repayment Period */}
              <FormField
                control={form.control}
                name="repaymentPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Period</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={String(field.value || '')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRepaymentPeriods.map((period) => (
                            <SelectItem key={period} value={String(period)}>
                              {period} months
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Phone */}
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+381..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Number */}
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredAccounts.length === 0 ? (
                            <SelectItem value="">
                              No matching accounts
                            </SelectItem>
                          ) : (
                            filteredAccounts.map((acc) => (
                              <SelectItem
                                key={acc.accountNumber}
                                value={acc.accountNumber}
                              >
                                {acc.accountNumber}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="col-span-2 flex justify-end mt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex gap-2"
                >
                  {isPending && <Loader className="w-4 h-4 animate-spin" />}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
