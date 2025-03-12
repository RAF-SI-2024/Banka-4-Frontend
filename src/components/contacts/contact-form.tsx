'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader } from 'lucide-react';

const contactSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  accountNumber: z.string().min(1, 'Account Number is required'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactFormAction =
  | { update: true; data: ContactFormValues }
  | { update: false; data: ContactFormValues };

export interface ContactFormProps {
  contact?: ContactFormValues | null;
  onSubmit: (action: ContactFormAction) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ContactForm({
  contact,
  onSubmit,
  onCancel,
  isPending = false,
}: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nickname: contact?.nickname || '',
      accountNumber: contact?.accountNumber || '',
    },
  });

  const isEdit = Boolean(contact);

  const _onSubmit = (data: ContactFormValues) => {
    onSubmit({ update: isEdit, data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter nickname" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter account number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-md py-1 px-2 text-sm font-medium flex items-center gap-2"
            disabled={isPending}
          >
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
