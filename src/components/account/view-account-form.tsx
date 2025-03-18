'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { formatAccountNumber } from '@/lib/account-utils';
import { AccountCarouselItem } from '@/types/account';

export function ViewAccountForm(props: AccountCarouselItem) {
  return (
    <>
      <form className="grid grid-cols-2 gap-6 w-full">
        <div className="flex flex-col">
          <Label>Account number:</Label>
          <Input
            disabled
            type="AccNum"
            className={'disabled:cursor-default'}
            value={formatAccountNumber(props.accountNumber)}
          />
        </div>
        <div className="flex flex-col">
          <Label>Account owner:</Label>
          <Input
            disabled
            type="owner"
            className={'disabled:cursor-default'}
            value={props.owner}
          />
        </div>
        <div className="flex flex-col">
          <Label>Account type:</Label>
          <Input
            disabled
            type="type"
            className={'disabled:cursor-default'}
            value={props.type}
          />
        </div>
        <div className="flex flex-col">
          <Label>Available resources:</Label>
          <Input
            disabled
            type="avRes"
            className={'disabled:cursor-default'}
            value={`${props.availableBalance.toLocaleString()} ${props.currencyCode}`}
          />
        </div>
        <div className="flex flex-col">
          <Label>Reserved resources:</Label>
          <Input
            disabled
            type="resRes"
            className={'disabled:cursor-default'}
            value={`${props.reservedBalance.toLocaleString()} ${props.currencyCode}`}
          />
        </div>
        <div className="flex flex-col">
          <Label>Balance:</Label>
          <Input
            disabled
            type="EDate"
            className={'disabled:cursor-default'}
            value={`${props.balance.toLocaleString()} ${props.currencyCode}`}
          />
        </div>
      </form>
    </>
  );
}
