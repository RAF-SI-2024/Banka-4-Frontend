import { ColumnDef } from '@tanstack/react-table';
import { transferStatusToString, TransferDto } from '@/api/response/transfer';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { formatAccountNumber } from '@/lib/account-utils';

export const transferColumns: ColumnDef<TransferDto>[] = [
  {
    accessorKey: 'transactionNumber',
    header: 'Transfer Number',
  },
  {
    accessorKey: 'toAccount',
    header: 'To Account',
    cell: ({ row }) => formatAccountNumber(row.original.toAccount),
  },
  {
    accessorKey: 'fromAccount',
    header: 'From Account',
    cell: ({ row }) => formatAccountNumber(row.original.fromAccount),
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
    header: 'Transfer Timestamp',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge>{transferStatusToString(row.original.status).toUpperCase()}</Badge>
    ),
  },
];
