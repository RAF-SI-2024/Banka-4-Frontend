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
    accessorKey: 'Bid',
    header: 'Bid',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
  {
    accessorKey: 'Neutral',
    header: 'Neutral',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
  {
    accessorKey: 'Ask',
    header: 'Ask',
    cell: (info) => (info.getValue() as number).toFixed(2),
  },
];
