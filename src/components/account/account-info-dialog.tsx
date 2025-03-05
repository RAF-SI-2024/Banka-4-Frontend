'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ViewAccountForm } from '@/components/account/view-account-form';

export function AccountInfoDialog({
  item,
}: {
  item: {
    accountNumber: string;
    balance: number;
    valuta: string;
    owner: string;
    type: string;
    availableResources: number;
    reservedResources: number;
  };
}) {
  return (
    <Dialog>
      <DialogTrigger className={'text-sm'}>More Information</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Account Details</DialogTitle>
        </DialogHeader>
        <ViewAccountForm {...item} />
      </DialogContent>
    </Dialog>
  );
}
