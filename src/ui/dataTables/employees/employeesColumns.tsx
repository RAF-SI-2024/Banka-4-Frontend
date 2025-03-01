import { ColumnDef } from '@tanstack/react-table';
import { EmployeeResponseDto } from '@/api/response/employee';

export const employeesColumns: ColumnDef<EmployeeResponseDto>[] = [
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
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'active',
    header: 'Active',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
  },
];
