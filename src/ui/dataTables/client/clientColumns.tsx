import { ColumnDef } from '@tanstack/react-table';
import { ClientResponseDto } from '@/api/response/client';

export const clientsColumns: ColumnDef<ClientResponseDto>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: (info) => info.getValue(),
  },
];
