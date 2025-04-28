import { ColumnDef } from '@tanstack/react-table';
import { ActuaryProfitDto } from '@/api/response/securities';

export const bankProfitColumns = (): ColumnDef<ActuaryProfitDto>[] => [
  {
    accessorKey: 'name',
    header: 'First Name',
  },
  {
    accessorKey: 'surname',
    header: 'Last Name',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'profit',
    header: 'Profit',
    cell: ({ row }) => {
      const { amount, currency } = row.original.profit;
      return (
        <span className={colorProfit(amount)}>
          {amount.toLocaleString()} {currency}
        </span>
      );
    },
  },
];

function colorProfit(profit: number) {
  if (profit > 0) return 'text-green-500';
  if (profit < 0) return 'text-red-500';
}
