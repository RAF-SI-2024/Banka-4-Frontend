'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Card } from '@/types/card';
import { formatCardNumber } from '@/lib/card-number-utils';

export function CardInfoForm(card: Card) {
  return (
    <form className="grid grid-cols-2 gap-6">
      <div className="flex flex-col">
        <Label>Card number:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={formatCardNumber(card.cardNumber)}
        />
      </div>
      <div className="flex flex-col">
        <Label>Card type:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.cardType}
        />
      </div>
      <div className="flex flex-col">
        <Label>Card name:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.cardName}
        />
      </div>
      <div className="flex flex-col">
        <Label>Creation date:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.createdDate}
        />
      </div>
      <div className="flex flex-col">
        <Label>Expiration date:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.expiryDate}
        />
      </div>
      <div className="flex flex-col">
        <Label>Account number:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.accountNumber}
        />
      </div>
      <div className="flex flex-col">
        <Label>Limit:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.limit}
        />
      </div>
      <div className="flex flex-col">
        <Label>Status:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.status}
        />
      </div>
      <div className="flex flex-col">
        <Label>Card owner:</Label>
        <Input
          disabled
          className={'disabled:cursor-default'}
          value={card.cardOwner}
        />
      </div>
    </form>
  );
}
