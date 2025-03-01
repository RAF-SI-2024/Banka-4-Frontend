'use client';

import React, { useMemo } from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import useTablePageParams from '@/hooks/useTablePageParams';

interface MockData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockData: MockData[] = [
  {
    id: 1,
    name: 'Hannah Davis',
    email: 'user1@example.com',
    role: 'Moderator',
  },
  {
    id: 2,
    name: 'Charlie Williams',
    email: 'user2@example.com',
    role: 'Moderator',
  },
  { id: 3, name: 'David Williams', email: 'user3@example.com', role: 'Viewer' },
  { id: 4, name: 'Jane Anderson', email: 'user4@example.com', role: 'Editor' },
  { id: 5, name: 'David Anderson', email: 'user5@example.com', role: 'Admin' },
  {
    id: 6,
    name: 'Hannah Williams',
    email: 'user6@example.com',
    role: 'Editor',
  },
  { id: 7, name: 'Frank Doe', email: 'user7@example.com', role: 'Editor' },
  { id: 8, name: 'Charlie Thomas', email: 'user8@example.com', role: 'Admin' },
  { id: 9, name: 'Bob Brown', email: 'user9@example.com', role: 'Moderator' },
  { id: 10, name: 'Jane Smith', email: 'user10@example.com', role: 'User' },
  { id: 11, name: 'Alice Smith', email: 'user11@example.com', role: 'Viewer' },
  { id: 12, name: 'John Smith', email: 'user12@example.com', role: 'Editor' },
  {
    id: 13,
    name: 'Grace Johnson',
    email: 'user13@example.com',
    role: 'Editor',
  },
  { id: 14, name: 'David Wilson', email: 'user14@example.com', role: 'User' },
  { id: 15, name: 'John Wilson', email: 'user15@example.com', role: 'Editor' },
  { id: 16, name: 'John Wilson', email: 'user16@example.com', role: 'User' },
  { id: 17, name: 'Jane Doe', email: 'user17@example.com', role: 'User' },
  { id: 18, name: 'Emily Smith', email: 'user18@example.com', role: 'Viewer' },
  {
    id: 19,
    name: 'Frank Anderson',
    email: 'user19@example.com',
    role: 'Viewer',
  },
  {
    id: 20,
    name: 'Jane Anderson',
    email: 'user20@example.com',
    role: 'Moderator',
  },
  { id: 21, name: 'Grace Johnson', email: 'user21@example.com', role: 'User' },
  {
    id: 22,
    name: 'Jane Williams',
    email: 'user22@example.com',
    role: 'Viewer',
  },
  { id: 23, name: 'Frank Johnson', email: 'user23@example.com', role: 'Admin' },
  {
    id: 24,
    name: 'Hannah Johnson',
    email: 'user24@example.com',
    role: 'Admin',
  },
  { id: 25, name: 'Alice Davis', email: 'user25@example.com', role: 'Admin' },
  { id: 26, name: 'Jane Brown', email: 'user26@example.com', role: 'Admin' },
  {
    id: 27,
    name: 'Grace Thomas',
    email: 'user27@example.com',
    role: 'Moderator',
  },
  { id: 28, name: 'Bob Brown', email: 'user28@example.com', role: 'User' },
  { id: 29, name: 'Bob Williams', email: 'user29@example.com', role: 'Admin' },
  { id: 30, name: 'Bob Miller', email: 'user30@example.com', role: 'Admin' },
  { id: 31, name: 'David Johnson', email: 'user31@example.com', role: 'User' },
  { id: 32, name: 'Emily Miller', email: 'user32@example.com', role: 'Editor' },
  { id: 33, name: 'Grace Smith', email: 'user33@example.com', role: 'Admin' },
  {
    id: 34,
    name: 'Alice Johnson',
    email: 'user34@example.com',
    role: 'Editor',
  },
  { id: 35, name: 'Alice Brown', email: 'user35@example.com', role: 'Admin' },
  { id: 36, name: 'David Anderson', email: 'user36@example.com', role: 'User' },
  { id: 37, name: 'Hannah Miller', email: 'user37@example.com', role: 'Admin' },
  {
    id: 38,
    name: 'Charlie Thomas',
    email: 'user38@example.com',
    role: 'Moderator',
  },
  {
    id: 39,
    name: 'John Brown',
    email: 'user39@example.com',
    role: 'Moderator',
  },
  { id: 40, name: 'Emily Smith', email: 'user40@example.com', role: 'User' },
];

const columns: ColumnDef<MockData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (info) => info.getValue(),
  },
];

export default function MockPage() {
  const { page, pageSize, setPage, setPageSize } =
    useTablePageParams('mockData');

  const mockDataRender = useMemo(
    () => mockData.slice(page * pageSize, page * pageSize + pageSize),
    [page, pageSize, mockData]
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mock Data Table</h1>
      <DataTable
        columns={columns}
        data={mockDataRender}
        isLoading={false}
        rowCount={mockData.length}
        pagination={{ page, pageSize }}
        onPaginationChange={(newPagination) => {
          setPage(newPagination.page);
          setPageSize(newPagination.pageSize);
        }}
      />
    </div>
  );
}
