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
import { AccountCarouselItem } from '@/types/account';
import { useMutation } from '@tanstack/react-query';
import { SetAccountLimitsDto } from '@/api/request/account';
import { useHttpClient } from '@/context/HttpClientContext';
import { setAccountLimits } from '@/api/account';
import { toast } from 'sonner';
import { ChangeAccountLimitsDialog } from './account-limits-dialog';
import { Dialog2FA } from '../Dialog2FA';
import { AccountLimitsFormValues } from './account-limits-form';

export function AccountCarousel({
  items,
  onSelect,
}: {
  items: AccountCarouselItem[];
  onSelect: (accountNumber: string) => void;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const client = useHttpClient();
  const initialChangeLimitsState = {
    formDialogOpen: false,
    otpDialogOpen: false,
    formData: undefined,
    currentAccount: undefined,
  };
  const [changeLimitsState, setChangeLimitsState] = useState<{
    formData: AccountLimitsFormValues | undefined;
    currentAccount:
      | {
          accountNumber: string;
          monthly: number;
          daily: number;
        }
      | undefined;
    formDialogOpen: boolean;
    otpDialogOpen: boolean;
  }>(initialChangeLimitsState);
  const { isPending, mutate: mutateAccountLimits } = useMutation({
    mutationKey: ['accounts'],
    mutationFn: async ({
      accountNumber,
      data,
    }: {
      accountNumber: string;
      data: SetAccountLimitsDto;
    }) => setAccountLimits(client, accountNumber, data),
    onSuccess: () => {
      toast.success('Account limits changed successfully.');
      setChangeLimitsState(initialChangeLimitsState);
    },
    onError: (error) => {
      setChangeLimitsState((prev) => ({ ...prev, otpDialogOpen: false }));
    },
  });
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
      <ChangeAccountLimitsDialog
        open={changeLimitsState.formDialogOpen}
        onOpenChange={(n) =>
          setChangeLimitsState((prev) => ({ ...prev, formDialogOpen: n }))
        }
        formProps={{
          isPending: isPending,
          onSubmit: (data) =>
            setChangeLimitsState((prev) => ({
              ...prev,
              otpDialogOpen: true,
              formData: data,
            })),
          defaultValues: { ...changeLimitsState.currentAccount },
        }}
      />
      <Dialog2FA
        open={changeLimitsState.otpDialogOpen}
        onSubmit={async (otp) => {
          if (
            changeLimitsState.formData &&
            changeLimitsState.formData.accountNumber ===
              changeLimitsState.currentAccount?.accountNumber
          ) {
            const accountNumber = changeLimitsState.formData.accountNumber;
            await mutateAccountLimits({
              accountNumber,
              data: {
                ...changeLimitsState.formData,
                otpCode: otp,
              },
            });
          }
        }}
        onCancel={() =>
          setChangeLimitsState((prev) => ({ ...prev, otpDialogOpen: false }))
        }
      />
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
                    {item.company && (
                      <p className="text-sm text-muted-foreground">
                        Company: {item.company.name}
                      </p>
                    )}
                    <span className="text-4xl font-bold">
                      {item.balance.toLocaleString()} {item.currencyCode}
                    </span>
                  </CardHeader>
                  <CardContent className="flex justify-center space-x-4">
                    <Link href={`/c/transactions/new-payment`}>
                      <Button variant="default">New Payment</Button>
                    </Link>
                    <AccountInfoDialog
                      item={{
                        ...item,
                        onClickChangeLimits: () => {
                          setChangeLimitsState((prev) => ({
                            ...prev,
                            formDialogOpen: true,
                            currentAccount: {
                              monthly: item.monthlyLimit,
                              daily: item.dailyLimit,
                              accountNumber: item.accountNumber,
                            },
                          }));
                        },
                      }}
                    />
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
