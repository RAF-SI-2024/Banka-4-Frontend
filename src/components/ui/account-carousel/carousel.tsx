'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Item } from '@radix-ui/react-navigation-menu';


export function AccountCarousel({
  items,
  onSelect,
}: {
  items: {
    accountNumber: string;
    balance: number;
    valuta: string;
  }[];
  onSelect: (accountNumber: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedAccountNumber, setSelectedAccountNumber] = React.useState<string>(items[0]?.accountNumber);
  const [currentItem, setCurrentItem] = React.useState(items[0]);

  const updateSelectedAccount = React.useCallback(() => {
    console.log('updateSelectedAccount called');
    if (emblaApi) {
      const index = emblaApi.selectedScrollSnap(); 
      console.log('Current index:', index);
      if (index !== undefined && items[index]) {
        console.log('usao sam u updateSelectedAccount');
        setSelectedAccountNumber(items[index].accountNumber);
        setCurrentItem(items[index]);
        onSelect(items[index].accountNumber); 
      }
    }
  }, [emblaApi, items, onSelect]);

  
  React.useEffect(() => {
    if (emblaApi) {
        console.log('emblaApi initialized');
        emblaApi.on('select', updateSelectedAccount); 
    }else {
        console.log('emblaApi not initialized');
      }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', updateSelectedAccount); 
      }
    };
  }, [emblaApi, updateSelectedAccount]);

  React.useEffect(() => {
    console.log('emblaApi state changed', emblaApi);
  }, [emblaApi]);



  return (
    <div className="flex justify-center py-8">
    <Carousel className="w-full max-w-xl" ref={emblaRef}>
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
                  <Button variant="outline">New Payment</Button>
                  <Button>More Information</Button>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    <div className="mt-4">
        <h2>Trenutno prikazani račun:</h2>
        <p>Broj računa: {selectedAccountNumber}</p>
        <p>Stanje: {currentItem.balance.toLocaleString()} {currentItem.valuta}</p>
      </div>
  </div>
);
}
