import React, { useState } from 'react';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { DataTable } from '@/components/dataTable/DataTable';
import { ClientResponseDto } from '@/api/response/client';
import { clientsColumns } from '@/ui/dataTables/client/clientColumns';
import useTablePageParams from '@/hooks/useTablePageParams';
import { useQuery } from '@tanstack/react-query';
import { searchClients } from '@/api/client';
import { useHttpClient } from '@/context/HttpClientContext';

export interface ClientFilter {
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

const clientFilterColumns: Record<keyof ClientFilter, FilterDefinition> = {
  firstName: {
    filterType: 'string',
    placeholder: 'Enter first name',
  },
  lastName: {
    filterType: 'string',
    placeholder: 'Enter last name',
  },
  email: {
    filterType: 'string',
    placeholder: 'Enter email',
  },
  phone: {
    filterType: 'string',
    placeholder: 'Enter phone number',
  },
};

interface ClientFilterTableProps {
  onRowClick: (client: ClientResponseDto) => void;
}

export default function ClientFilterTable(props: ClientFilterTableProps) {
  const client = useHttpClient();

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

  return (
      <>
        <FilterBar<ClientFilter, typeof clientFilterColumns>
            filterKeyToName={clientFilterKeyToName}
            onSubmit={(filter) => {
              setPage(0);
              setSearchFilter(filter);
            }}
            filter={searchFilter}
            columns={clientFilterColumns}
        />
        <DataTable<ClientResponseDto>
            onRowClick={(row) => props.onRowClick(row.original)}
            columns={clientsColumns}
            data={data?.content ?? []}
            isLoading={isLoading}
            pageCount={data?.page.totalPages ?? 0}
            pagination={{ page, pageSize }}
            onPaginationChange={(newPagination) => {
              setPage(newPagination.page);
              setPageSize(newPagination.pageSize);
            }}
        />
      </>
  );
}
