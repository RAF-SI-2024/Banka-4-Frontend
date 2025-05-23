import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PublicStocksDto } from '@/api/response/otc';
import { Currency } from '@/types/currency';
import { ForeignBankId } from '@/types/otc';

export const otcOverviewColumns = (
  makeAnOffer: (
    userId: ForeignBankId,
    assetId: string,
    currency: Currency
  ) => void
): ColumnDef<PublicStocksDto>[] => [
  {
    accessorKey: 'securityType',
    header: 'Security Type',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'ticker',
    header: 'Ticker',
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => row.original.amount.toLocaleString(),
  },
  {
    accessorKey: 'ownerUsername',
    header: 'Owner',
  },
  {
    id: 'activePrice',
    header: 'Active Price',
    cell: ({ row }) => {
      const { amount, currency } = row.original.activePrice;
      return `${amount.toLocaleString()} ${currency}`;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <Button
          onClick={() =>
            makeAnOffer(
              row.original.sellerId,
              row.original.stockId,
              row.original.activePrice.currency
            )
          }
        >
          Make an Offer
        </Button>
      );
    },
  },
];
