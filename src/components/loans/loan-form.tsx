'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ALL_DEFAULT_PERIODS,
  ALL_EMPLOYMENT_STATUSES,
  ALL_EMPLOYMENT_STATUSES_,
  ALL_INTEREST_TYPES,
  ALL_INTEREST_TYPES_,
  ALL_LOAN_TYPES,
  ALL_LOAN_TYPES_,
  ALL_MORTGAGE_PERIODS,
} from '@/types/loan';
import { ALL_CURRENCIES, ALL_CURRENCIES_ } from '@/types/currency';
import { SomePartials } from '@/types/utils';
import { numberEnum } from '@/lib/form-utils';

const loanFormSchema = z
  .object({
    loanType: z.enum(ALL_LOAN_TYPES_),
    interestType: z.enum(ALL_INTEREST_TYPES_),
    amount: z.coerce
      .number({ invalid_type_error: 'Amount is required' })
      .min(1, 'Amount must be at least 1'),
    currency: z.enum(ALL_CURRENCIES_),
    purposeOfLoan: z.string().min(1, 'Purpose is required'),
    monthlyIncome: z.coerce
      .number({ invalid_type_error: 'Monthly income is required' })
      .min(0, 'Income cannot be negative'),
    employmentStatus: z.enum(ALL_EMPLOYMENT_STATUSES_),
    employmentPeriod: z.coerce
      .number({ invalid_type_error: 'Employment period is required' })
      .min(0, 'Employment period cannot be negative'),
    repaymentPeriod: z.union([
      z.number().superRefine(numberEnum(ALL_MORTGAGE_PERIODS)),
      z.number().superRefine(numberEnum(ALL_DEFAULT_PERIODS)),
    ]),
    contactPhone: z
      .string()
      .regex(/^(\+3816|06)(\d{7,8}|(77|78)\d{5,6})$/, 'Invalid phone number'),
    accountNumber: z.string().min(1, 'Account number is required'),
  })
  .refine(
    (data) => {
      if (data.loanType === 'MORTGAGE') {
        return ALL_MORTGAGE_PERIODS.some((p) => p === data.repaymentPeriod);
      } else {
        return ALL_DEFAULT_PERIODS.some((p) => p === data.repaymentPeriod);
      }
    },
    {
      message: 'Please select a valid repayment period',
      path: ['repaymentPeriod'],
    }
  );

export type LoanFormValues = z.infer<typeof loanFormSchema>;

export type LoanFormAction = { data: LoanFormValues };

export interface LoanFormProps {
  defaultValues?: SomePartials<
    LoanFormValues,
    [
      'loanType',
      'repaymentPeriod',
      'employmentStatus',
      'interestType',
      'currency',
      'employmentPeriod',
    ]
  >;
  isPending: boolean;
  onSubmit: (action: LoanFormAction) => void;
  accounts: { accountNumber: string; currency: string }[];
}

export default function LoanForm({
  defaultValues = {
    loanType: undefined,
    interestType: undefined,
    amount: 0,
    currency: undefined,
    purposeOfLoan: '',
    monthlyIncome: 0,
    employmentStatus: undefined,
    employmentPeriod: undefined,
    contactPhone: '',
    accountNumber: '',
  },
  isPending,
  onSubmit,
  accounts,
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

  // Use the accounts passed as a prop
  const filteredAccounts = React.useMemo(
    () => accounts.filter((acc) => acc.currency === currentCurrency),
    [accounts, currentCurrency]
  );

  const _onSubmit = (values: LoanFormValues) => {
    onSubmit({ data: values });
  };

  const availableRepaymentPeriods =
    currentLoanType === 'MORTGAGE' ? ALL_MORTGAGE_PERIODS : ALL_DEFAULT_PERIODS;

  return (
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
              <FormLabel>
                Loan Type <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_LOAN_TYPES.map((type) => (
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
              <FormLabel>
                Interest Type <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interest type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_INTEREST_TYPES.map((it) => (
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
              <FormLabel>
                Amount <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="100" // Increased step to 100
                  placeholder="Enter amount"
                  min={1}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : +val);
                  }}
                  value={field.value === undefined ? '' : String(field.value)}
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
              <FormLabel>
                Currency <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_CURRENCIES.map((cur) => (
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
              <FormLabel>
                Purpose <span className={'text-red-500'}>*</span>
              </FormLabel>
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
              <FormLabel>
                Monthly Income <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="100" // Increased step to 100
                  placeholder="Enter monthly income"
                  min={1}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : +val);
                  }}
                  value={field.value === undefined ? '' : String(field.value)}
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
              <FormLabel>
                Employment Status <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_EMPLOYMENT_STATUSES.map((status) => (
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
              <FormLabel>
                Employment Period (years){' '}
                <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min={0}
                  placeholder="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : +val);
                  }}
                  value={field.value === undefined ? '' : String(field.value)}
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
              <FormLabel>
                Repayment Period <span className={'text-red-500'}>*</span>
              </FormLabel>
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
              <FormLabel>
                Contact Phone <span className={'text-red-500'}>*</span>
              </FormLabel>
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
              <FormLabel>
                Account Number <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc) => (
                        <SelectItem
                          key={acc.accountNumber}
                          value={acc.accountNumber}
                        >
                          {acc.accountNumber}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                        No available accounts for selected currency
                      </div>
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
          <Button type="submit" disabled={isPending} className="flex gap-2">
            {isPending && <Loader className="w-4 h-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
