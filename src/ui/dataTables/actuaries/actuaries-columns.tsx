import { ColumnDef } from '@tanstack/react-table';
import { ActuaryActions } from '@/components/actuary/actuary-actions';
import { ActuaryItem } from '@/api/response/actuaries';

export const actuariesColumns: ColumnDef<ActuaryItem>[] = [
  {
    accessorKey: 'user.firstName',
    header: 'Name',
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: 'user.lastName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user.email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user.position',
    header: 'Position',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'limitAmount',
    header: 'Limit',
    cell: ({ row }) => {
      const { limitAmount, currencyCode } = row.original.actuary;
      return (
        <span>
           {limitAmount != null
        ? `${limitAmount.toLocaleString()} ${currencyCode}`
        : 'UNLIMITED'}
        </span>
      );
    },
  },
  {
    accessorKey: 'usedLimitAmount',
    header: 'Used Limit',
    cell: ({ row }) => {
        const { usedLimitAmount, currencyCode } = row.original.actuary;
        return (
          <span>
            {usedLimitAmount.toLocaleString()} {currencyCode}
          </span>
        );
      },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActuaryActions item={row.original} />,
  }

];
