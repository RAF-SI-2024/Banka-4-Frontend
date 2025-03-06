'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { formatAccountNumber } from '@/lib/account-utils';
import { TransactionCarouselItem } from '@/types/transaction';

/* TODO: we should use another type here, works for now, time rush */
export function ViewAccountForm(transaction: TransactionCarouselItem) {
  return (
    <form className="grid grid-cols-2 gap-6">
      <div className="flex flex-col">
        <Label>Account number:</Label>
        <Input
          disabled
          type="AccNum"
          className={'disabled:cursor-default'}
          value={formatAccountNumber(transaction.accountNumber)}
        />
      </div>
      <div className="flex flex-col">
        <Label>Account owner:</Label>
        <Input
          disabled
          type="owner"
          className={'disabled:cursor-default'}
          value={transaction.owner}
        />
      </div>
      <div className="flex flex-col">
        <Label>Account type:</Label>
        <Input
          disabled
          type="type"
          className={'disabled:cursor-default'}
          value={transaction.type}
        />
      </div>
      <div className="flex flex-col">
        <Label>Available resources:</Label>
        <Input
          disabled
          type="avRes"
          className={'disabled:cursor-default'}
          value={`${transaction.availableBalance.toLocaleString()} ${transaction.currencyCode}`}
        />
      </div>
      <div className="flex flex-col">
        <Label>Reserved resources:</Label>
        <Input
          disabled
          type="resRes"
          className={'disabled:cursor-default'}
          value={`${transaction.reservedBalance.toLocaleString()} ${transaction.currencyCode}`}
        />
      </div>
      <div className="flex flex-col">
        <Label>Balance:</Label>
        <Input
          disabled
          type="EDate"
          className={'disabled:cursor-default'}
          value={`${transaction.balance.toLocaleString()} ${transaction.currencyCode}`}
        />
      </div>
    </form>
  );
}
