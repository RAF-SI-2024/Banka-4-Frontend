'use client';

import GuardBlock from '@/components/GuardBlock';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { DataTable } from '@/components/dataTable/DataTable';
import React, { useEffect, useState } from 'react';
import { otcOverviewColumns } from '@/ui/dataTables/otc/otcOverviewColumns';
import { useHttpClient } from '@/context/HttpClientContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOtcRequest, getPublicStocks } from '@/api/otc';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { OfferDialog } from '@/components/otc/offer-dialog';
import { OfferFormAction, OfferFormValues } from '@/components/otc/offer-form';
import { Currency } from '@/types/currency';
import moment from 'moment';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import { ForeignBankId } from '@/types/otc';

export default function OtcOverviewPage() {
  const client = useHttpClient();
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [userId, setUserId] = useState<ForeignBankId>();
  const [assetId, setAssetId] = useState<string>();
  const [currency, setCurrency] = useState<Currency>();

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['otcs'],
    queryFn: async () => (await getPublicStocks(client)).data,
    staleTime: 100,
    refetchInterval: 10_000,
  });

  const { mutate: makeOffer } = useMutation({
    mutationKey: ['otcs'],
    mutationFn: ({
      userId,
      assetId,
      currency,
      data,
    }: {
      userId: ForeignBankId;
      assetId: string;
      currency: Currency;
      data: OfferFormValues;
    }) =>
      createOtcRequest(client, {
        userId,
        assetId,
        pricePerStock: {
          amount: data.pricePerStock,
          currency: currency,
        },
        premium: {
          amount: data.premium,
          currency: currency,
        },
        amount: data.amount,
        settlementDate: moment(data.settlementDate).format('YYYY-MM-DD'),
      }),
    onSuccess: () => {
      setOfferDialogOpen(false);
      toast.success('Offer sent successfully!');
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'OTC', url: '/u/otc' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const handleMakeOffer = (action: OfferFormAction) => {
    if (
      !action.update &&
      userId !== undefined &&
      assetId !== undefined &&
      currency !== undefined
    ) {
      makeOffer({ userId, assetId, currency, data: action.data });
    }
  };

  return (
    <GuardBlock requiredPrivileges={['ADMIN', 'SUPERVISOR', 'AGENT', 'TRADE']}>
      <div className={'p-8'}>
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">OTC Overview</h1>
            <CardDescription>
              This table provides an overview of all public stocks.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={otcOverviewColumns((userId, assetId, currency) => {
                setOfferDialogOpen(true);
                setUserId(userId);
                setAssetId(assetId);
                setCurrency(currency);
              })}
              data={data ?? []}
              isLoading={isLoading}
              pageCount={1}
              pagination={{ page: 0, pageSize: 8 }}
              onPaginationChange={() => {}}
            />

            <div className="flex w-full justify-end mt-6">
              <p className={'text-sm text-muted-foreground'}>
                data last updated: {formatDateTime(new Date(dataUpdatedAt))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {offerDialogOpen && (
        <OfferDialog
          isUpdate={false}
          isPending={false}
          defaultValues={{
            amount: 0,
            settlementDate: undefined,
            premium: 0,
            pricePerStock: 0,
          }}
          onSubmit={handleMakeOffer}
          open={offerDialogOpen}
          onOpenChange={(val) => setOfferDialogOpen(val)}
        />
      )}
    </GuardBlock>
  );
}
