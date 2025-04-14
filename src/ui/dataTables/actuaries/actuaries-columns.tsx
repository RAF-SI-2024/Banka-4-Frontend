import { ColumnDef } from '@tanstack/react-table';
import { ActuaryItem } from '@/types/actuary';
import { ActuaryActions } from '@/components/actuary/actuary-actions';

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
          {limitAmount} {currencyCode}
        </span>
      );
    },
  },
  {
    accessorKey: 'usedLimitAmount',
    header: 'Used Limit',
    cell: ({ row }) => <ActuaryActions item={row.original} />,
  },
];
