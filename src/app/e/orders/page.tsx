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
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/dataTable/DataTable';
import useTablePageParams from '@/hooks/useTablePageParams';
import FilterBar, { FilterDefinition } from '@/components/filters/FilterBar';
import { searchOrders, approveOrder, declineOrder } from '@/api/orders';
import { OrderDto } from '@/api/response/orders';
import { ORDER_STATUSES_ } from '@/types/orders';
import { ordersColumns } from '@/ui/dataTables/orders/ordersColumns';

const orderFilterColumns = {
  status: {
    filterType: 'enum',
    placeholder: 'Enter status',
    options: Array.from(ORDER_STATUSES_),
    optionToString: (option) => option,
  },
  userId: {
    filterType: 'string',
    placeholder: 'Enter agent ID',
  },
  assetTicker: {
    filterType: 'string',
    placeholder: 'Enter asset ticker',
  },
} as Record<keyof OrderDto, FilterDefinition>;

const OrdersOverviewPage: React.FC = () => {
    const { page, pageSize, setPage, setPageSize } = useTablePageParams('orders', {
      pageSize: 10,
      page: 0,
    });
  
    const [searchFilter, setSearchFilter] = useState<Partial<OrderDto>>({
      status: undefined,
      userId: '',
      assetTicker: '',
    });
  
    const client = useHttpClient();
  
    const { data, isLoading } = useQuery({
      queryKey: ['orders', page, pageSize, searchFilter],
      queryFn: async () => {
        const status = searchFilter.status || 'PENDING';
        return (await searchOrders(client, status, page, pageSize)).data;
      },
    });

    // Mock data for testing
const mockOrders: OrderDto[] = [
    {
      id: '1',
      userId: '123',
      assetTicker: 'AAPL',
      orderType: 'LIMIT',
      direction: 'BUY',
      quantity: 100,
      pricePerUnit: { amount: 150, currency: 'USD' },
      status: 'PENDING',
      isDone: false,
      createdAt: '2025-04-01T10:00:00Z',
      lastModified: '2025-04-01T12:00:00Z',
      contractSize: 10,
      remainingPortions: 5,
    },
    {
      id: '2',
      userId: '456',
      assetTicker: 'GOOGL',
      orderType: 'MARKET',
      direction: 'SELL',
      quantity: 50,
      pricePerUnit: { amount: 2800, currency: 'USD' },
      status: 'APPROVED',
      isDone: true,
      createdAt: '2025-03-28T09:00:00Z',
      lastModified: '2025-03-28T11:00:00Z',
      contractSize: 5,
      remainingPortions: 0,
    },
    {
      id: '3',
      userId: '789',
      assetTicker: 'TSLA',
      orderType: 'LIMIT',
      direction: 'BUY',
      quantity: 200,
      pricePerUnit: { amount: 700, currency: 'USD' },
      status: 'DECLINED',
      isDone: false,
      createdAt: '2025-04-10T14:00:00Z',
      lastModified: '2025-04-10T16:00:00Z',
      contractSize: 20,
      remainingPortions: 10,
    },
  ];
  
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
  
    const handleApprove = async (orderId: string) => {
      try {
        await approveOrder(client, orderId);
        setPage(0);
      } catch (error) {
        console.error('Failed to approve order:', error);
      }
    };
  
    const handleDecline = async (orderId: string) => {
      try {
        await declineOrder(client, orderId);
        setPage(0);
      } catch (error) {
        console.error('Failed to decline order:', error);
      }
    };
  
    return (
      <GuardBlock requiredUserType="employee" requiredPrivileges={['ADMIN', 'SUPERVISOR']}>
        <div className="p-8">
          <Card className="max-w-[900px] mx-auto">
            <CardHeader>
              <h1 className="text-2xl font-bold">Orders Overview</h1>
              <CardDescription>
                This table provides a clear and well-structured overview of orders,
                making it easy to review key details and track relevant
                information.
              </CardDescription>
              <FilterBar<Partial<OrderDto>, typeof orderFilterColumns>
                onSubmit={(filter) => {
                  setPage(0);
                  setSearchFilter(filter);
                }}
                filter={searchFilter}
                columns={orderFilterColumns}
              />
            </CardHeader>
            <CardContent className="rounded-lg overflow-hidden">
              <DataTable
                columns={ordersColumns(handleApprove, handleDecline)}
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