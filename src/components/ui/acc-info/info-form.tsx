'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';

export function InfoForm({
  accountNumber,
  balance,
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
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="font-normal text-m text-muted-foreground">
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label>Account nubmer:</Label>
            <Input disabled type="AccNum" placeholder={accountNumber} />
          </div>
          <div className="flex flex-col">
            <Label>Account owner:</Label>
            <Input disabled type="owner" placeholder={owner} />
          </div>
          <div className="flex flex-col">
            <Label>Account type:</Label>
            <Input disabled type="type" placeholder={type} />
          </div>
          <div className="flex flex-col">
            <Label>Available resources:</Label>
            <Input
              disabled
              type="avRes"
              placeholder={availableResources.toLocaleString()}
            />
          </div>
          <div className="flex flex-col">
            <Label>Reserved resources:</Label>
            <Input
              disabled
              type="resRes"
              placeholder={reservedResources.toLocaleString()}
            />
          </div>
          <div className="flex flex-col">
            <Label>Balance:</Label>
            <Input
              disabled
              type="EDate"
              placeholder={balance.toLocaleString()}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
