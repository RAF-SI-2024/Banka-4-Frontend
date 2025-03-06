import { ColumnDef } from '@tanstack/react-table';
import { TransactionDto } from '@/api/response/transaction';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export const transactionColumns: ColumnDef<TransactionDto>[] = [
  {
    accessorKey: 'transactionNumber',
    header: 'Transaction Number',
  },
  {
    accessorKey: 'recipient',
    header: 'Recipient',
  },
  {
    accessorKey: 'toAccount',
    header: 'To Account',
  },
  {
    accessorKey: 'fromAmount',
    header: 'Amount',
    cell: ({ row }) => (
      <p>
        {row.original.fromAmount} {row.original.fromCurrency}
      </p>
    ),
  },
  {
    accessorKey: 'paymentDateTime',
    header: 'Payment Date and Time',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
];
