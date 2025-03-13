import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AuthorizedPersonForm, {
  AuthorizedPersonFormValues,
} from '@/components/company/authorized-person-form';

export type RequestCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (authorizedUser: AuthorizedPersonFormValues) => void;
  title: string;
  description: string;
};

export const AuthorizedPersonDialogForm = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: RequestCardDialogProps) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AuthorizedPersonForm onSubmitAction={onConfirm} isPending={false} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
