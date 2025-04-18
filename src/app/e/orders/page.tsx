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
import {
  searchOrders,
  approveOrder,
  declineOrder,
  OrderFilter,
} from '@/api/orders';
import { ORDER_STATUSES_ } from '@/types/orders';
import { ordersColumns } from '@/ui/dataTables/orders/ordersColumns';
import { useQueryClient } from '@tanstack/react-query';
import { toastRequestError } from '@/api/errors';
import { toast } from 'sonner';

const orderFilterColumns: Record<keyof OrderFilter, FilterDefinition> = {
  status: {
    filterType: 'enum',
    placeholder: 'Enter status',
    options: Array.from(ORDER_STATUSES_),
    optionToString: (option) => option,
  },
};

const OrdersOverviewPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTablePageParams(
    'orders',
    {
      pageSize: 10,
      page: 0,
    }
  );

  const [searchFilter, setSearchFilter] = useState<OrderFilter>({
    status: undefined,
  });

  const client = useHttpClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, pageSize, searchFilter],
    queryFn: async () => {
      return (await searchOrders(client, searchFilter.status, page, pageSize))
        .data;
    },
  });

  const approveMutation = useMutation({
    mutationKey: ['orders'],
    mutationFn: (orderId: string) => approveOrder(client, orderId),
    onSuccess: () => {
      toast.success('Order approved!');
    },
    onError: (error) => {
      toastRequestError(error);
    },
  });

  const declineMutation = useMutation({
    mutationKey: ['orders'],
    mutationFn: (orderId: string) => declineOrder(client, orderId),
    onSuccess: () => {
      toast.success('Order declined!');
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
        { title: 'Orders', url: '/e/orders' },
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
            <h1 className="text-2xl font-bold">Orders Overview</h1>
            <CardDescription>
              This table provides a clear and well-structured overview of
              orders, making it easy to review key details and track relevant
              information.
            </CardDescription>
            <FilterBar<OrderFilter, typeof orderFilterColumns>
              onSubmit={(filter) => {
                setSearchFilter(filter);
              }}
              filter={searchFilter}
              columns={orderFilterColumns}
            />
          </CardHeader>
          <CardContent className="rounded-lg overflow-hidden">
            <DataTable
              columns={ordersColumns(
                (orderId) => approveMutation.mutate(orderId),
                (orderId) => declineMutation.mutate(orderId)
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

export default OrdersOverviewPage;
