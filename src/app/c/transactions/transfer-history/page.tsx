'use client';
import { getAllTransfers } from '@/api/transfer';
import { DataTable } from '@/components/dataTable/DataTable';
import GuardBlock from '@/components/GuardBlock';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useHttpClient } from '@/context/HttpClientContext';
import useTablePageParams from '@/hooks/useTablePageParams';
import { transferColumns } from '@/ui/dataTables/transfer/transferColumns';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function TransfersPage() {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'transfer-history',
    { pageSize: 8, page: 0 }
  );
  const client = useHttpClient();

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/c' },
        { title: 'Transactions', url: '/c/transactions' },
        { title: 'Transfer History' },
      ],
    });
  }, [dispatch]);

  const { data, isLoading } = useQuery({
    queryKey: ['transfer-history', page, pageSize],
    queryFn: async () => {
      const response = await getAllTransfers(client, page, pageSize);
      return response.data;
    },
  });

  return (
    <GuardBlock>
      <div className="p-8">
        <style>{'th, td {white-space: nowrap;}'}</style>
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Transfer History</h1>
            <CardDescription>
              A chronological view of all your transfers, sorted from newest to
              oldest.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={transferColumns}
              data={data?.content ?? []}
              isLoading={isLoading}
              pageCount={data?.page.totalPages ?? 0}
              pagination={{ page, pageSize }}
              onPaginationChange={(newPagination) => {
                setPage(newPagination.page);
                setPageSize(newPagination.pageSize);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </GuardBlock>
  );
}
