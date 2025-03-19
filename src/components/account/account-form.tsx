'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '../ui/switch';
import { ALL_CURRENCIES, ALL_CURRENCIES_ } from '@/types/currency';

const formSchema = z.object({
  amount: z.coerce.number().min(0),
  currency: z.enum(ALL_CURRENCIES_),
  makeCard: z.boolean(),
});

export type AccountFormData = z.infer<typeof formSchema>;

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => void;
  isPending: boolean;
}

export default function AccountForm({ onSubmit, isPending }: AccountFormProps) {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: 0, currency: 'RSD', makeCard: false },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Amount <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  onChange={field.onChange}
                  placeholder="Enter amount"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>
                Currency <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="makeCard"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <FormItem>
                <FormControl>
                  <Switch
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormLabel>Make a card</FormLabel>
            </div>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
