'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Contact {
  id?: string;
  name: string;
  accountNumber: string;
}

interface ContactFormProps {
  contact?: Contact | null;
  onClose: () => void;
}

export default function ContactForm({ contact, onClose }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Contact>({
    defaultValues: {
      name: contact?.name || '',
      accountNumber: contact?.accountNumber || '',
    },
  });

  const onSubmit = (data: Contact) => {
    if (contact) {
      // Pozovi API metod za ažuriranje kontakta
      console.log('Updating contact', data);
    } else {
      // Pozovi API metod za kreiranje novog kontakta
      console.log('Creating contact', data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input {...register('name', { required: 'Name is required' })} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label>Account Number</Label>
        <Input
          {...register('accountNumber', {
            required: 'Account Number is required',
          })}
        />
        {errors.accountNumber && (
          <p className="text-red-500 text-sm">{errors.accountNumber.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
