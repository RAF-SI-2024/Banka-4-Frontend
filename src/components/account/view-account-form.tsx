'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { formatAccountNumber } from '@/lib/account-utils';
import { TransactionCarouselItem } from '@/types/transaction';
import { Button } from '../ui/button';

/* TODO: we should use another type here, works for now, time rush */
export function ViewAccountForm(props: TransactionCarouselItem) {
  return (
    <form className="grid grid-cols-2 gap-6">
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
      <div className="col-span-2">
        <div className="flex flex-row">
          <h2 className="font-semibold text-xl mb-4">Limits</h2>
          {props.onClickChangeLimits != null && (
            <Button
              className="ml-auto"
              onClick={async (e) => {
                e.preventDefault();
                await props.onClickChangeLimits?.();
              }}
            >
              Change
            </Button>
          )}
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col flex-1">
            <Label>Daily Limit:</Label>
            <Input
              disabled
              className={'disabled:cursor-default'}
              value={`${props.monthlyLimit.toLocaleString()} ${props.currencyCode}`}
            />
          </div>
          <div className="flex flex-col flex-1">
            <Label>Monthly Limit:</Label>
            <Input
              disabled
              className={'disabled:cursor-default'}
              value={`${props.dailyLimit.toLocaleString()} ${props.currencyCode}`}
            />
          </div>
        </div>
      </div>
      {(transaction.type === 'CheckingBusiness' ||
        transaction.type === 'FxBusiness') &&
        transaction.company && (
          <>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold">Company Information</h3>
            </div>
            <div className="flex flex-col col-span-1">
              <Label>Company Name:</Label>
              <Input
                disabled
                type="text"
                className={'disabled:cursor-default'}
                value={transaction.company.name}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <Label>Tax Identification Number:</Label>
              <Input
                disabled
                type="text"
                className={'disabled:cursor-default'}
                value={transaction.company.tin}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <Label>Company Registration Number:</Label>
              <Input
                disabled
                type="text"
                className={'disabled:cursor-default'}
                value={transaction.company.crn}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <Label>Address:</Label>
              <Input
                disabled
                type="text"
                className={'disabled:cursor-default'}
                value={transaction.company.address}
              />
            </div>
            <div className="flex flex-col col-span-1">
              <Label>Activity Code:</Label>
              <Input
                disabled
                type="text"
                className={'disabled:cursor-default'}
                value={transaction.company.activityCode}
              />
            </div>
          </>
        )}
    </form>
  );
}
