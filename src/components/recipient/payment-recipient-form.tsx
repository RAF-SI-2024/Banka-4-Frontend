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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDirtyValues } from '@/lib/form-utils';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
});

export type RecipientFormAction =
  | {
      update: true;
      data: Partial<RecipientFormValues>;
    }
  | {
      update: false;
      data: RecipientFormValues;
    };

export type RecipientFormValues = z.infer<typeof formSchema>;

export interface RecipientFormProps {
  onSubmit: (values: RecipientFormAction) => void;
  isPending: boolean;
  isUpdate: boolean;
  defaultValues: RecipientFormValues;
}

export default function RecipientForm({
  onSubmit,
  isPending,
  defaultValues,
  isUpdate,
}: RecipientFormProps) {
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function _onSubmit(data: RecipientFormValues) {
    if (isUpdate) {
      onSubmit({
        update: true,
        data: getDirtyValues(form.formState.dirtyFields, data),
      });
    } else {
      onSubmit({
        update: false,
        data,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
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
              <FormLabel>
                Account Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="12345678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
