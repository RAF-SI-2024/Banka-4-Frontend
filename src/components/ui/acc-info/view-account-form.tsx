'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { InfoForm } from './info-form';

export function MoreInfoDialog({
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
    <AlertDialog>
      <AlertDialogTrigger>More Information</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>More Information</AlertDialogTitle>
        </AlertDialogHeader>
        <InfoForm {...item} />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
