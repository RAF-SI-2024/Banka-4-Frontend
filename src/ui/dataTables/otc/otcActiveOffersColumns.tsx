import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { OtcRequestDto, PublicStocksDto } from '@/api/response/otc';
import { formatDistanceToNow } from 'date-fns';
import { Currency } from '@/types/currency';
import { formatDate, formatDateTime } from '@/lib/utils';
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
    accessorKey: 'pricePerStock',
    header: 'Price per Stock',
    cell: ({ row }) =>
      `${row.original.pricePerStock.amount} ${row.original.pricePerStock.currency}`,
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
      `${row.original.pricePerStock.amount} ${row.original.pricePerStock.currency}`,
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
          <Button onClick={async () => accept(row.original.id)}>Accept</Button>
          <Button onClick={async () => reject(row.original.id)}>Reject</Button>
          <Button onClick={async () => counterOffer(row.original)}>
            Counter
          </Button>
        </div>
      );
    },
  },
];
