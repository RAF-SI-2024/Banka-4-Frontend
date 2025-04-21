import { BaseAccountDto } from '@/api/response/account';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatAccountNumber } from '@/lib/account-utils';

interface BuyOptionDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  accounts: BaseAccountDto[];
  onSubmit: (accountNumber: string, amount: number) => void;
}

const formSchema = z.object({
  accountNumber: z.string(),
  amount: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function BuyOptionDialog(props: BuyOptionDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: '',
      amount: 0,
    },
  });

  function onFormSubmit(data: FormValues) {
    console.log(data);
    props.onSubmit(data.accountNumber, data.amount);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Option</DialogTitle>
          <DialogDescription>
            Please select account and amount to proceed with the purchase of
            selected option.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name={'accountNumber'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {props.accounts.map((acc) => {
                          return (
                            <SelectItem
                              key={acc.accountNumber}
                              value={acc.accountNumber}
                            >
                              {`${formatAccountNumber(acc.accountNumber)} - ${acc.availableBalance.toLocaleString()} ${acc.currency}`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'secondary'}>Cancel</Button>
              </DialogClose>
              <Button>Buy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
