'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useHttpClient } from '@/context/HttpClientContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchClients } from '@/api/client';
import { DataTable } from '@/components/dataTable/DataTable';
import { clientsColumns } from '@/ui/dataTables/client/clientColumns';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar from '@/components/filters/FilterBar';
import { ClientResponseDto } from '@/api/response/client';

interface ClientFilter {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const clientFilterKeyToName = (key: keyof ClientFilter): string => {
  switch (key) {
    case 'firstName':
      return 'First Name';
    case 'lastName':
      return 'Last Name';
    case 'email':
      return 'Email';
    case 'phone':
      return 'Phone Number';
  }
};

const ClientOverviewPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'clients',
    { pageSize: 8, page: 0 }
  );
  const [searchFilter, setSearchFilter] = useState<ClientFilter>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const router = useRouter();
  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['client', page, pageSize, searchFilter],
    queryFn: async () => {
      const sanitizedFilters = {
        firstName: searchFilter.firstName || '',
        lastName: searchFilter.lastName || '',
        email: searchFilter.email || '',
        phone: searchFilter.phone || '',
      };
      const response = await searchClients(
        client,
        sanitizedFilters,
        pageSize,
        page
      );
      return response.data;
    },
    staleTime: 5000,
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Clients', url: '/e/client' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  return (
    <div className="p-8">
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Clients Overview</h1>
          <CardDescription>
            This table provides a clear and organized overview of key client
            details for quick reference and easy access.
          </CardDescription>
          <FilterBar<ClientFilter>
            filterKeyToName={clientFilterKeyToName}
            onSearch={(filter) => {
              setPage(0);
              setSearchFilter(filter);
            }}
            filter={searchFilter}
          />
        </CardHeader>
        <CardContent className="rounded-lg overflow-hidden">
          <DataTable<ClientResponseDto>
            onRowClick={(row) =>
              router.push(`/e/client/${row.original.id}/edit`)
            } //TODO()  i guess
            columns={clientsColumns}
            data={data?.content ?? []}
            isLoading={isLoading}
            pageCount={data?.page.totalPages ?? 0}
            pagination={{ page: page, pageSize }}
            onPaginationChange={(newPagination) => {
              setPage(newPagination.page);
              setPageSize(newPagination.pageSize);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverviewPage;
