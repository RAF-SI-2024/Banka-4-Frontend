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
import { useQuery } from '@tanstack/react-query';
import { searchAccounts } from '@/api/accountss';
import { DataTable } from '@/components/dataTable/DataTable';
import { accountsColumns } from '@/ui/dataTables/accounts/accounts-columns';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar from '@/components/filters/FilterBar';
import GuardBlock from '@/components/GuardBlock';

interface AccountFilter {
  accountNumber: string;
  firstName: string;
  lastName: string;
  accountType: string;
}

const accountFilterKeyToName = (key: keyof AccountFilter): string => {
  switch (key) {
    case 'accountNumber':
      return 'account number';
    case 'firstName':
      return 'first name';
    case 'lastName':
      return 'last name';
    case 'accountType':
      return 'account type';
  }
};

const AccountOverviewPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'accounts',
    { pageSize: 8, page: 0 }
  );

  const [searchFilter, setSearchFilter] = useState<AccountFilter>({
    accountNumber: '',
    firstName: '',
    lastName: '',
    accountType: '',
  });

  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['account', page, pageSize, searchFilter],
    queryFn: async () => {
      const response = await searchAccounts(
        client,
        searchFilter,
        pageSize,
        page
      );
      return response.data;
    },
  });

  const { dispatch } = useBreadcrumb();
  useEffect(() => {
    dispatch({
      type: 'SET_BREADCRUMB',
      items: [
        { title: 'Home', url: '/' },
        { title: 'Accounts', url: '/e/accounts' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  return (
    <GuardBlock requiredUserType={'employee'}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Accounts</h1>
            <CardDescription>
              This table provides a clear and organized overview of key employee
              details for quick reference and easy access.
            </CardDescription>
            <FilterBar<AccountFilter>
              filterKeyToName={accountFilterKeyToName}
              onSearch={(filter) => {
                setPage(0);
                setSearchFilter(filter);
              }}
              filter={searchFilter}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={accountsColumns}
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
    </GuardBlock>
  );
};

export default AccountOverviewPage;
