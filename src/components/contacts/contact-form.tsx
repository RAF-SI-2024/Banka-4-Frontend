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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader } from 'lucide-react';

const contactSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
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
      nickname: contact?.nickname || '',
      accountNumber: contact?.accountNumber || '',
    },
  });

  const isEdit = Boolean(contact);

  const _onSubmit = (data: ContactFormValues) => {
    if (isEdit) {
      onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      onSubmit({ update: false, data });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-[348px] rounded-lg border p-4">
        <CardHeader className="w-full p-4 text-left">
          <h2 className="text-2xl font-semibold">
            {isEdit ? 'Edit Contact' : 'New Contact'}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {isEdit
              ? 'Update the contact details below.'
              : 'Create a new contact by filling out the form below.'}
          </p>
        </CardHeader>

        <CardContent className="px-4 pb-4">
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
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
