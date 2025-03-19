'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ViewAccountForm } from '@/components/account/view-account-form';
import { AccountCarouselItem } from '@/types/account';
import ViewCompanyForm from '@/components/company/view-company-form';
import AccountViewLimits from '@/components/account/account-view-limits';

export function AccountInfoDialog({ item }: { item: AccountCarouselItem }) {
  return (
    <Dialog>
      <DialogTrigger className={'text-sm'}>More Information</DialogTrigger>
      <DialogContent className={'!max-w-2xl'}>
        <DialogHeader>
          <DialogTitle className={'text-2xl'}>Account Details</DialogTitle>
        </DialogHeader>
        <ViewAccountForm {...item} />
        <div className={'flex gap-6'}>
          {(item.type === 'CheckingBusiness' || item.type === 'FxBusiness') &&
            item.company && (
              <div className="w-full">
                <div>
                  <h2 className="text-xl mb-4 font-semibold">
                    Company Information
                  </h2>
                </div>
                <ViewCompanyForm company={item.company} />
              </div>
            )}
          <div className={'w-full'}>
            <AccountViewLimits
              currencyCode={item.currencyCode}
              monthlyLimit={item.monthlyLimit}
              dailyLimit={item.dailyLimit}
              onClickChangeLimits={item.onClickChangeLimits}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
