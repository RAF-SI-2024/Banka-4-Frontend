'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatAccountNumber } from '@/lib/account-utils';
import { AccountInfoDialog } from '@/components/account/account-info-dialog';
import { TransactionCarouselItem } from '@/types/transaction';

export function AccountCarousel({
  items,
  onSelect,
}: {
  items: TransactionCarouselItem[];
  onSelect: (accountNumber: string) => void;
}) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      onSelect(items[api.selectedScrollSnap()].accountNumber);
    });
  }, [api, onSelect, items]);

  return (
    <div className="flex justify-center py-8">
      <Carousel className="w-full max-w-xl" setApi={setApi}>
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.accountNumber}>
              <div className="p-4">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="font-normal text-md text-muted-foreground">
                      {formatAccountNumber(item.accountNumber)}
                    </CardTitle>
                    <span className="text-4xl font-bold">
                      {item.balance.toLocaleString()} {item.currencyCode}
                    </span>
                  </CardHeader>
                  <CardContent className="flex justify-center space-x-4">
                    <Button variant="default">
                      <Link href={`#`}>
                        <span>New Payment</span>
                      </Link>
                    </Button>
                    <AccountInfoDialog item={item} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
