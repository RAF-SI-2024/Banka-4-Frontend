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
import { getDirtyValues } from '@/lib/form-utils';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accountNumber: z.string().min(1, 'Account Number is required'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactFormAction =
  | { update: true; data: Partial<ContactFormValues> }
  | { update: false; data: ContactFormValues };

interface ContactFormProps {
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
      name: contact?.name || '',
      accountNumber: contact?.accountNumber || '',
    },
  });

  const _onSubmit = (data: ContactFormValues) => {
    if (contact) {
      onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      onSubmit({ update: false, data });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" />
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
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
