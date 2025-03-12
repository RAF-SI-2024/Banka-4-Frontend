'use client';

import * as React from 'react';
import ContactForm, {
  ContactFormAction,
  ContactFormValues,
} from '@/components/contacts/contact-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type { ContactFormAction, ContactFormValues };

export interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  contact?: ContactFormValues | null;
  onSubmit: (action: ContactFormAction) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  onSubmit,
  onCancel,
  isPending = false,
}: ContactFormDialogProps) {
  const isEdit = Boolean(contact);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={'w-[400px]'}>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>
            {isEdit ? 'Edit Contact' : 'New Contact'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the contact details below.'
              : 'Create a new contact by filling out the form below.'}
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          contact={contact}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
