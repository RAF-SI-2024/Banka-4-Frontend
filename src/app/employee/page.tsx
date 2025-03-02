'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useHttpClient } from '@/context/HttpClientContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GuardBlock from '@/components/GuardBlock';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchEmployees } from '@/api/employee';
import { DataTable } from '@/components/dataTable/DataTable';
import { employeesColumns } from '@/ui/dataTables/employees/employeesColumns';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar from '@/components/filters/FilterBar';

interface EmployeeFilter {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

const employeeFilterKeyToName = (key: keyof EmployeeFilter): string => {
  switch (key) {
    case 'firstName':
      return 'first name';
    case 'lastName':
      return 'last name';
    case 'email':
      return 'email';
    case 'position':
      return 'position';
  }
};

const EmployeeOverviewPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } =
    useTablePageParams('employees');

  const [searchFilter, setSearchFilter] = useState<EmployeeFilter>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
  });

  const router = useRouter();
  const rowsPerPage = 8;

  const queryClient = useQueryClient();
  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['employee', page, rowsPerPage, searchFilter],
    queryFn: async () => {
      const response = await searchEmployees(
        client,
        searchFilter,
        rowsPerPage,
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
        { title: 'Employees', url: '/employee' },
        { title: 'Overview' },
      ],
    });
  }, [dispatch]);

  return (
    <GuardBlock requiredPrivileges={['ADMIN']}>
      <div className="p-8">
        <Card className="max-w-[900px] mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Employees Overview</h1>
            <p className="text-sm text-zinc-500">
              This table provides a clear and organized overview of key employee
              details for quick reference and easy access.
            </p>
            <FilterBar<EmployeeFilter>
              filterKeyToName={employeeFilterKeyToName}
              onSearch={(filter) => {
                setPage(0);
                setSearchFilter(filter);
              }}
              filter={searchFilter}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              onRowClick={(row) =>
                router.push(`/employee/${row.original.id}/edit`)
              }
              columns={employeesColumns}
              data={data?.content ?? []}
              isLoading={isLoading}
              totalRowCount={data?.totalElements ?? 0}
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

export default EmployeeOverviewPage;
