import { ClientResponseDto } from '@/api/response/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import ClientFilterTable from '@/components/client/client-filter-table';
import React from 'react';

interface PickExistingClientProps {
  onClientPicked: (client: ClientResponseDto) => void;
}

export default function PickExistingClient(props: PickExistingClientProps) {
  return (
    <div className="p-8">
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Clients Overview</h1>
          <CardDescription>
            You can search and filters all our clients here.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-lg overflow-hidden">
          <ClientFilterTable onRowClick={(c) => props.onClientPicked(c)} />
        </CardContent>
      </Card>
    </div>
  );
}
