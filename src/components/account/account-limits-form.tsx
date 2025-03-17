'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaybePromise } from '@/types/MaybePromise';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  accountNumber: z.string(),
  daily: z.coerce.number(),
  monthly: z.coerce.number(),
});
export type AccountLimitsFormValues = z.infer<typeof formSchema>;

export interface AccountLimitsFormProps {
  onSubmit: (values: AccountLimitsFormValues) => MaybePromise<unknown>;
  isPending: boolean;
  defaultValues: Partial<AccountLimitsFormValues>;
}

export default function AccountLimitsForm({
  onSubmit,
  isPending,
  defaultValues,
}: AccountLimitsFormProps) {
  const form = useForm<AccountLimitsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Account number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter account number"
                  readOnly
                  disabled
                  className="disabled:cursor-default"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="daily"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Daily Limit <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" step={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthly"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Monthly Limit <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" step={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          Confirm
        </Button>
      </form>
    </Form>
  );
}
