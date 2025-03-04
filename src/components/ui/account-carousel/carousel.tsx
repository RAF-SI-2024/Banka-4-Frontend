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

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { MoreInfoDialog } from '@/components/ui/acc-info/view-account-form';

export function AccountCarousel({
  items,
  onSelect,
}: {
  items: {
    accountNumber: string;
    balance: number;
    valuta: string;
    owner: string;
    type: string;
    availableResources: number;
    reservedResources: number;
  }[];
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
                    <CardTitle className="font-normal text-m text-muted-foreground">
                      {item.accountNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label className="text-2xl font-bold">
                      {item.balance.toLocaleString()} {item.valuta}
                    </Label>
                  </CardContent>
                  <CardFooter className="flex justify-center space-x-4">
                    <Button variant="outline">
                      <Link href={`#`}>
                        <span>New Payment</span>
                      </Link>
                    </Button>
                    <MoreInfoDialog item={item} />
                  </CardFooter>
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
