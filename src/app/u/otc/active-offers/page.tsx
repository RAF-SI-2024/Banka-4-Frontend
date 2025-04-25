'use client';

import {
  acceptOtcRequest,
  getMyRequests,
  getMyRequestsUnread,
  rejectOtcRequest,
  updateOtcRequest,
} from '@/api/otc';
import { OtcRequestUpdateDto } from '@/api/request/otc';
import { OtcRequestDto } from '@/api/response/otc';
import { DataTable } from '@/components/dataTable/DataTable';
import GuardBlock from '@/components/GuardBlock';
import { OfferDialog } from '@/components/otc/offer-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useHttpClient } from '@/context/HttpClientContext';
import useTablePageParams from '@/hooks/useTablePageParams';
import { formatDateTime } from '@/lib/utils';
import { Currency } from '@/types/currency';
import { otcActiveOffersColumns } from '@/ui/dataTables/otc/otcActiveOffersColumns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'sonner';
import { ForeignBankId } from '@/types/otc';

export default function Page() {
  const client = useHttpClient();
  const [unreadRequestsCount, setUnreadRequestsCount] = useState(0);
  const [currency, setCurrency] = useState<Currency>();
  const [selectedOffer, setSelectedOffer] = useState<OtcRequestDto>();
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const { page, pageSize, setPage, setPageSize } = useTablePageParams('otcs', {
    pageSize: 8,
    page: 0,
  });

  const unreadRequests = useQuery({
    queryKey: ['active-offers', 'unread'],
    queryFn: async () =>
      /* we do a little trolling. */
      (await getMyRequestsUnread(client, 0, 99_999)).data,
    staleTime: 100,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (unreadRequests.isSuccess) {
      const unreadCount = unreadRequests.data.page.totalElements;
      if (unreadCount > unreadRequestsCount) {
        toast.info('You have unread offers!');
      }
      setUnreadRequestsCount(unreadRequests.data.page.totalElements);
    }
  }, [unreadRequests, unreadRequestsCount]);

  const {
    data: activeOffers,
    isLoading,
    dataUpdatedAt,
  } = useQuery({
    queryFn: async () => getMyRequests(client, page, pageSize),
    queryKey: ['active-offers', page, pageSize],
    staleTime: 100,
    refetchInterval: 10_000,
  });
  const { mutate: acceptMutation } = useMutation({
    mutationFn: async (id: ForeignBankId) =>
      acceptOtcRequest(client, id.id, id.routingNumber),
    mutationKey: ['active-offers'],
  });
  const { mutate: rejectMutation } = useMutation({
    mutationFn: async (id: ForeignBankId) =>
      rejectOtcRequest(client, id.id, id.routingNumber),
    mutationKey: ['active-offers'],
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: async (body: Partial<OtcRequestUpdateDto>) =>
      selectedOffer &&
      updateOtcRequest(
        client,
        selectedOffer.id.id,
        selectedOffer.id.routingNumber,
        body
      ),
    mutationKey: ['active-offers'],
    onSuccess: () => {
      setOfferDialogOpen(false);
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'OTC', url: '/u/otc' },
        { title: 'Active Offers' },
      ],
    });
  }, [dispatch]);

  return (
    <GuardBlock requiredPrivileges={['ADMIN', 'SUPERVISOR', 'AGENT', 'TRADE']}>
      {selectedOffer && (
        <OfferDialog
          isUpdate={true}
          isPending={false}
          defaultValues={{
            pricePerStock: selectedOffer.pricePerStock.amount,
            amount: selectedOffer.amount,
            premium: selectedOffer.premium.amount,
            settlementDate: new Date(selectedOffer.settlementDate),
          }}
          onSubmit={async (body) => {
            if (currency && body.update)
              updateMutation({
                pricePerStock:
                  body.data.pricePerStock !== undefined
                    ? {
                        currency,
                        amount: body.data.pricePerStock,
                      }
                    : undefined,
                premium:
                  body.data.premium !== undefined
                    ? {
                        currency,
                        amount: body.data.premium,
                      }
                    : undefined,
                settlementDate:
                  body.data.settlementDate !== undefined
                    ? moment(body.data.settlementDate).format('YYYY-MM-DD')
                    : undefined,
                amount: body.data.amount,
              });
          }}
          open={offerDialogOpen}
          onOpenChange={(val) => setOfferDialogOpen(val)}
        />
      )}

      <div className={'p-8'}>
        <Card className="max-w-full mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">OTC Active Offers</h1>
            <CardDescription>
              This table provides an overview of all active offers.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={otcActiveOffersColumns({
                accept: acceptMutation,
                reject: rejectMutation,
                counterOffer: (row: OtcRequestDto) => {
                  setOfferDialogOpen(true);
                  setSelectedOffer(row);
                  setCurrency(row.pricePerStock.currency);
                },
              })}
              data={activeOffers?.data.content ?? []}
              isLoading={isLoading}
              pageCount={activeOffers?.data?.page.totalPages ?? 0}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
              shouldHighlightRow={(row) =>
                unreadRequests.data !== undefined &&
                unreadRequests.data.content
                  .map((r) => r.id.routingNumber + r.id.id)
                  .includes(row.original.id.routingNumber + row.original.id.id)
              }
            />

            <div className="flex w-full justify-end mt-6">
              <p className={'text-sm text-muted-foreground'}>
                data last updated: {formatDateTime(new Date(dataUpdatedAt))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
