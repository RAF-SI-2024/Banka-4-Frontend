import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn, formatDateTime } from '@/lib/utils';
import { MaybePromise } from '@/types/MaybePromise';
import { SecurityHoldingDto } from '@/api/response/securities';

export const portfolioColumns = ({
  sell,
  transfer,
  use,
}: {
  sell: (row: SecurityHoldingDto) => MaybePromise<unknown>;
  transfer?: (row: SecurityHoldingDto) => MaybePromise<unknown>;
  use?: (row: SecurityHoldingDto) => MaybePromise<unknown>;
}): ColumnDef<SecurityHoldingDto>[] => [
  {
    accessorKey: 'ticker',
    header: 'Ticker',
  },
  {
    id: 'assetType',
    header: 'Asset Type',
    cell: ({ row }) => {
      if (
        row.original.assetType === 'OPTION' &&
        row.original.optionType !== null
      ) {
        return `${row.original.assetType} - ${row.original.optionType}`;
      } else {
        return row.original.assetType;
      }
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => row.original.amount.toLocaleString(),
  },
  {
    accessorKey: 'publicAmount',
    header: 'Public Amount',
    cell: ({ row }) => row.original.publicAmount.toLocaleString(),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) =>
      `${row.original.price.amount.toLocaleString()} ${row.original.price.currency}`,
  },
  {
    accessorKey: 'profit',
    header: 'Profit',
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.profit.amount > 0
              ? cn('text-green-500')
              : row.original.profit.amount == 0
                ? cn('text-black dark:text-white')
                : cn('text-red-500')
          }
        >
          {row.original.profit.amount.toLocaleString()}{' '}
          {row.original.profit.currency}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastModified',
    header: 'Last Modified',
    cell: ({ row }) => formatDateTime(row.original.lastModified),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          {row.original.assetType === 'OPTION' ? (
            <Button
              variant={'outline'}
              onClick={async () => use?.(row.original)}
            >
              Use
            </Button>
          ) : (
            <Button
              variant={'default'}
              onClick={async () => sell(row.original)}
            >
              Sell
            </Button>
          )}
          {row.original.assetType === 'STOCK' && (
            <Button
              variant={'outline'}
              onClick={async () => transfer?.(row.original)}
            >
              Transfer
            </Button>
          )}
        </div>
      );
    },
  },
];
