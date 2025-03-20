import { ColumnDef } from '@tanstack/react-table';
import { exchange } from '@/api/response/exchange';

export const exchangeColumns: ColumnDef<exchange>[] = [
  {
    accessorKey: 'Base',
    header: 'Base',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'Quote',
    header: 'Quote',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'Buy',
    header: 'Bid (Buy)',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
  {
    accessorKey: 'Neutral',
    header: 'Neutral',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
  {
    accessorKey: 'Sell',
    header: 'Ask (Sell)',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
];
