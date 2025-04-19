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
import GuardBlock from '@/components/GuardBlock';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/dataTable/DataTable';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { toastRequestError } from '@/api/errors';
import { toast } from 'sonner';
import {
  getTaxSummary,
  collectTaxForUser,
  triggerMonthlyTax,
} from '@/api/taxes';
import { taxesColumns } from '@/ui/dataTables/taxes/taxesColumns';
import { TaxSummaryFilters } from '@/api/request/taxes';
import { Button } from '@/components/ui/button';

const taxFilterColumns: Record<keyof TaxSummaryFilters, FilterDefinition> = {
  firstName: {
    filterType: 'string',
    placeholder: 'Enter first name',
  },
  lastName: {
    filterType: 'string',
    placeholder: 'Enter last name',
  },
};

const TaxesOverviewPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams('taxes', {
    pageSize: 10,
    page: 0,
  });

  const [searchFilter, setSearchFilter] = useState<TaxSummaryFilters>({
    firstName: '',
    lastName: '',
  });

  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['taxes', page, pageSize, searchFilter],
    queryFn: async () => {
      return (await getTaxSummary(client, searchFilter, page, pageSize)).data;
    },
  });

  const collectTaxMutation = useMutation({
    mutationKey: ['taxes'],
    mutationFn: (userId: string) => collectTaxForUser(client, userId),
    onSuccess: () => {
      toast.success('Tax collected successfully!');
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const triggerTaxMutation = useMutation({
    mutationKey: ['taxes'],
    mutationFn: () => triggerMonthlyTax(client),
    onSuccess: () => {
      toast.success('Monthly tax triggered successfully!');
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Taxes', url: '/e/taxes' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  return (
    <GuardBlock
      requiredUserType="employee"
      requiredPrivileges={['ADMIN', 'SUPERVISOR']}
    >
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Taxes Overview</h1>
            <CardDescription className={'flex justify-between'}>
              This table provides an overview of all users and their unpaid
              taxes.
              <Button
                variant={'secondary'}
                onClick={() => triggerTaxMutation.mutate()}
              >
                Trigger Monthly Tax
              </Button>
            </CardDescription>
            <div className="flex justify-between items-center gap-8 flex-col lg:flex-row">
              <div className="w-full">
                <FilterBar<TaxSummaryFilters, typeof taxFilterColumns>
                  onSubmit={(filter) => {
                    setPage(0);
                    setSearchFilter(filter);
                  }}
                  filter={searchFilter}
                  columns={taxFilterColumns}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={taxesColumns((userId) =>
                collectTaxMutation.mutate(userId)
              )}
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
};

export default TaxesOverviewPage;
