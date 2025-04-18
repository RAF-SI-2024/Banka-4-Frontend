import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { TaxableUserDto } from '@/api/response/taxes';

export const taxesColumns = (
  handleCollectTax: (userId: string) => void
): ColumnDef<TaxableUserDto>[] => [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'unpaidTax',
    header: 'Unpaid Tax',
    cell: ({ row }) => {
      const { unpaidTax, currency } = row.original;
      return `${unpaidTax} ${currency}`;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const userId = row.original.userId;
      return (
        <Button variant="destructive" onClick={() => handleCollectTax(userId)}>
          Collect Tax
        </Button>
      );
    },
  },
];
