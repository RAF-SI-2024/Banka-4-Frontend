'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ViewAccountForm } from '@/components/account/view-account-form';
import { TransactionCarouselItem } from '@/types/transaction';

export function AccountInfoDialog({
  item,
}: {
  item: TransactionCarouselItem /* TODO: we should use another type here, works for now, time rush */;
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
