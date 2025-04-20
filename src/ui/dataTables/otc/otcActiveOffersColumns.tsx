import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { OtcRequestDto } from '@/api/response/otc';
import {
  calculatePercentageDifference,
  cn,
  formatDate,
  formatDateTime,
} from '@/lib/utils';
import { MaybePromise } from '@/types/MaybePromise';

export const otcActiveOffersColumns = ({
  accept,
  reject,
  counterOffer,
}: {
  accept: (id: string) => MaybePromise<unknown>;
  reject: (id: string) => MaybePromise<unknown>;
  counterOffer: (dto: OtcRequestDto) => MaybePromise<unknown>;
}): ColumnDef<OtcRequestDto>[] => [
  {
    accessorKey: 'madeBy',
    header: 'Made By',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => row.original.stock.Name,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => row.original.amount.toLocaleString(),
  },
  {
    id: 'pricePerStock',
    header: 'Price per Stock',
    cell: ({ row }) => {
      const percentageDifference = calculatePercentageDifference(
        row.original.pricePerStock.amount,
        row.original.latestStockPrice.amount
      );
      return (
        <span className={colorPercentage(percentageDifference)}>
          {row.original.pricePerStock.amount.toLocaleString()}{' '}
          {row.original.pricePerStock.currency}
        </span>
      );
    },
  },
  {
    accessorKey: 'settlementDate',
    header: 'Settlement Date',
    cell: ({ row }) => formatDate(row.original.settlementDate),
  },
  {
    accessorKey: 'premium',
    header: 'Premium',
    cell: ({ row }) =>
      `${row.original.premium.amount.toLocaleString()} ${row.original.premium.currency}`,
  },
  {
    accessorKey: 'lastModifiedDate',
    header: 'Last Modified Date',
    cell: ({ row }) => formatDateTime(row.original.lastModified),
  },
  {
    accessorKey: 'modifiedBy',
    header: 'Modified By',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          <Button
            variant={'default'}
            onClick={async () => accept(row.original.id)}
          >
            Accept
          </Button>
          <Button
            variant={'destructive'}
            onClick={async () => reject(row.original.id)}
          >
            Reject
          </Button>
          <Button
            variant={'secondary'}
            onClick={async () => counterOffer(row.original)}
          >
            Counter
          </Button>
        </div>
      );
    },
  },
];

export const colorPercentage = (percentage: number) => {
  if (percentage >= 20) return cn('text-red-500');
  else if (percentage >= 5) return cn('text-yellow-500');
  else return cn('text-green-500');
};
