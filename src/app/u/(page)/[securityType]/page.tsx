'use client';

import { getListings } from '@/api/listing';
import { GetListingsFilters } from '@/api/request/listing';
import { DataTable } from '@/components/dataTable/DataTable';
import FilterBar from '@/components/filters/FilterBar';
import { useHttpClient } from '@/context/HttpClientContext';
import useTablePageParams from '@/hooks/useTablePageParams';
import { SecurityType } from '@/types/securities';
import {
  listingColumns,
  listingFilterColumns,
} from '@/ui/dataTables/listings/listingColumns';
import { useQuery } from '@tanstack/react-query';
import { use, useState } from 'react';
import { useListingFilters } from './ListingFilters';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cleanObject } from '@/lib/request-utils';
import GuardBlock from '@/components/GuardBlock';

export default function Page({
  params,
}: {
  params: Promise<{ securityType: string }>;
}) {
  const { securityType: securityTypeParam } = use(params);
  const { filters, page, setPage, pageSize, setPageSize } =
    useListingFilters(securityTypeParam);
  const router = useRouter();
  const securityType: SecurityType | undefined =
    securityTypeParam === 'stocks'
      ? 'STOCK'
      : securityTypeParam === 'futures'
        ? 'FUTURE'
        : securityTypeParam === 'forex-pairs'
          ? 'FOREX_PAIR'
          : undefined!;
  const client = useHttpClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [securityType, filters, page, pageSize],
    queryFn: async () => {
      const data = await getListings(
        client,
        // Infinity gets serialized to null, clear it here
        { ...cleanObject(JSON.parse(JSON.stringify(filters))), securityType },
        page,
        pageSize
      );
      return data.data;
    },
    staleTime: 10000,
    refetchInterval: 10000,
  });

  const refresh = async () => {
    toast.promise(refetch(), {
      loading: 'Loading...',
      success: `Success`,
      error: 'Network error',
    });
  };

  return (
    <GuardBlock requiredPrivileges={['ADMIN', 'SUPERVISOR', 'AGENT', 'TRADE']}>
      <div className="justify-end flex flex-row gap-2 pb-4">
        <Button disabled={isLoading} onClick={refresh}>
          Refresh
        </Button>
      </div>
      <DataTable
        columns={listingColumns}
        data={data?.content ?? []}
        isLoading={isLoading}
        pageCount={data?.page.totalPages ?? 0}
        pagination={{ page, pageSize }}
        onPaginationChange={(newPagination) => {
          setPage(newPagination.page);
          setPageSize(newPagination.pageSize);
        }}
        onRowClick={(row) =>
          router.push(`/u/${securityTypeParam}/${row.original.securityId}`)
        }
      />
    </GuardBlock>
  );
}
