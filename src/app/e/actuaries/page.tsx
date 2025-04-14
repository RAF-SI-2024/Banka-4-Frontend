'use client';

import React, { useEffect, useState } from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import useTablePageParams from '@/hooks/useTablePageParams';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ActuariesFilter } from '@/api/request/actuaries';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { useHttpClient } from '@/context/HttpClientContext';
import { useQuery } from '@tanstack/react-query';
import { searchActuaries } from '@/api/actuaries';
import { DataTable } from '@/components/dataTable/DataTable';
import { actuariesColumns } from '@/ui/dataTables/actuaries/actuaries-columns';
import { ActuaryItem } from '@/types/actuary';

const actuariesFilterColumns: Record<keyof ActuariesFilter, FilterDefinition> =
  {
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
    position: {
      filterType: 'string',
      placeholder: 'Enter position',
    },
  };

const ActuariesPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'actuaries',
    { pageSize: 8, page: 0 }
  );

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Actuaries ', url: '/e/actuaries' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  const [searchFilter, setSearchFilter] = useState<ActuariesFilter>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
  });

  const client = useHttpClient();

  const [actuaryItems, setActuaryItems] = useState<ActuaryItem[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['actuaries', page, pageSize, searchFilter],
    queryFn: async () => {
      const response = await searchActuaries(
        client,
        searchFilter,
        page,
        pageSize
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.content) {
      setActuaryItems(data.content);
    }
  }, [data]);

  return (
    <GuardBlock requiredUserType={'employee'} requiredPrivileges={['ADMIN']}>
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Actuaries</h1>
          <FilterBar<ActuariesFilter, typeof actuariesFilterColumns>
            onSubmit={(filter) => {
              setPage(0);
              setSearchFilter(filter);
            }}
            filter={searchFilter}
            columns={actuariesFilterColumns}
          />
        </CardHeader>

        <CardContent className="rounded-lg overflow-hidden">
          <DataTable
            columns={actuariesColumns}
            data={actuaryItems ?? []}
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
    </GuardBlock>
  );
};

export default ActuariesPage;
