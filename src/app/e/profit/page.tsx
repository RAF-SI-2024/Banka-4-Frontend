'use client';

import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { BankProfitFilters } from '@/api/request/securities';
import useTablePageParams from '@/hooks/useTablePageParams';
import React, { useEffect, useState } from 'react';
import { useHttpClient } from '@/context/HttpClientContext';
import { useQuery } from '@tanstack/react-query';
import { getBankProfit } from '@/api/securities';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { DataTable } from '@/components/dataTable/DataTable';
import { bankProfitColumns } from '@/ui/dataTables/bank-profit/bankProfitColumns';

const bankProfitFilterColumns: Record<
  keyof BankProfitFilters,
  FilterDefinition
> = {
  firstName: {
    filterType: 'string',
    placeholder: 'Enter first name',
  },
  lastName: {
    filterType: 'string',
    placeholder: 'Enter last name',
  },
  position: {
    filterType: 'string',
    placeholder: 'Enter position',
  },
  email: {
    filterType: 'string',
    placeholder: 'Enter email',
  },
};

export default function BankProfitPage() {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'bank-profit',
    {
      pageSize: 10,
      page: 0,
    }
  );

  const [searchFilter, setSearchFilter] = useState<BankProfitFilters>({
    firstName: '',
    lastName: '',
    position: '',
    email: '',
  });

  const client = useHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: ['bank-profit', page, pageSize, searchFilter],
    queryFn: async () => {
      return (await getBankProfit(client, searchFilter, page, pageSize)).data;
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/e' },
        { title: 'Bank Profit', url: '/e/profit' },
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
            <h1 className="text-2xl font-bold">Bank Profit Overview</h1>
            <CardDescription className={'flex justify-between'}>
              This table provides an overview of all employees and their
              realized profit.
            </CardDescription>
            <div className="flex justify-between items-center gap-8 flex-col lg:flex-row">
              <div className="w-full">
                <FilterBar<BankProfitFilters, typeof bankProfitFilterColumns>
                  onSubmit={(filter) => {
                    setPage(0);
                    setSearchFilter(filter);
                  }}
                  filter={searchFilter}
                  columns={bankProfitFilterColumns}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={bankProfitColumns()}
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
