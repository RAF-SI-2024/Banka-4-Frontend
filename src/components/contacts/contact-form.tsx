'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input {...form.register('name')} placeholder="Enter name" />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label>Account Number</Label>
        <Input
          {...form.register('accountNumber')}
          placeholder="Enter account number"
        />
        {form.formState.errors.accountNumber && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.accountNumber.message}
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
