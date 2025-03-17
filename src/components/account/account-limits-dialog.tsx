'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AccountLimitsForm, {
  AccountLimitsFormProps,
} from './account-limits-form';

export function ChangeAccountLimitsDialog({
  open,
  onOpenChange,
  formProps,
}: {
  open: boolean;
  onOpenChange: (newOpen: boolean) => unknown;
  formProps: AccountLimitsFormProps;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Set Account Limits</DialogTitle>
        </DialogHeader>
        <AccountLimitsForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
