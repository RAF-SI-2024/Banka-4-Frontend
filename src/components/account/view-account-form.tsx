'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { formatAccountNumber } from '@/lib/account-utils';

export function ViewAccountForm({
  accountNumber,
  balance,
  valuta,
  owner,
  type,
  availableResources,
  reservedResources,
}: {
  accountNumber: string;
  balance: number;
  valuta: string;
  owner: string;
  type: string;
  availableResources: number;
  reservedResources: number;
}) {
  return (
    <form className="grid grid-cols-2 gap-6">
      <div className="flex flex-col">
        <Label>Account number:</Label>
        <Input
          disabled
          type="AccNum"
          className={'disabled:cursor-default'}
          value={formatAccountNumber(accountNumber)}
        />
      </div>
      <div className="flex flex-col">
        <Label>Account owner:</Label>
        <Input
          disabled
          type="owner"
          className={'disabled:cursor-default'}
          value={owner}
        />
      </div>
      <div className="flex flex-col">
        <Label>Account type:</Label>
        <Input
          disabled
          type="type"
          className={'disabled:cursor-default'}
          value={type}
        />
      </div>
      <div className="flex flex-col">
        <Label>Available resources:</Label>
        <Input
          disabled
          type="avRes"
          className={'disabled:cursor-default'}
          value={`${availableResources.toLocaleString()} ${valuta}`}
        />
      </div>
      <div className="flex flex-col">
        <Label>Reserved resources:</Label>
        <Input
          disabled
          type="resRes"
          className={'disabled:cursor-default'}
          value={`${reservedResources.toLocaleString()} ${valuta}`}
        />
      </div>
      <div className="flex flex-col">
        <Label>Balance:</Label>
        <Input
          disabled
          type="EDate"
          className={'disabled:cursor-default'}
          value={`${balance.toLocaleString()} ${valuta}`}
        />
      </div>
    </form>
  );
}
