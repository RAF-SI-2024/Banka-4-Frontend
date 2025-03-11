import { ColumnDef } from '@tanstack/react-table';
import { ExchangeDto } from '@/api/response/exchange';

export const exchangeColumns: ColumnDef<ExchangeDto>[] = [
    {
        accessorKey: 'base',
        header: 'Base',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'quote',
        header: 'Quote',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'buy',
        header: 'Buy',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'neutral',
        header: 'Neutral',
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: 'sell',
        header: 'Sell',
        cell: (info) => info.getValue(),
    }
];