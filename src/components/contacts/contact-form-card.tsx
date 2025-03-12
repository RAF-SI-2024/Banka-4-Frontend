'use client';

import * as React from 'react';
import ContactForm, {
  ContactFormAction,
  ContactFormValues,
} from '@/components/contacts/contact-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export type { ContactFormAction, ContactFormValues };

export interface ContactFormCardProps {
  contact?: ContactFormValues | null;
  onSubmit: (action: ContactFormAction) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ContactFormCard({
  contact,
  onSubmit,
  onCancel,
  isPending = false,
}: ContactFormCardProps) {
  const isEdit = Boolean(contact);
  return (
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
        <ContactForm
          contact={contact}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
}
