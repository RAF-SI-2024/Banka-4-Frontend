'use client';

import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/navigation';
import ClientFilterTable from '@/components/client/client-filter-table';

const ClientOverviewPage: React.FC = () => {
  const router = useRouter();
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
        </CardHeader>
        <CardContent className="rounded-lg overflow-hidden">
          <ClientFilterTable
            onRowClick={(c) => router.push(`/e/client/${c.id}/edit`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverviewPage;
