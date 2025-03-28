import { ColumnDef } from '@tanstack/react-table';
import {
  paymentStatusToString,
  TransactionDto,
} from '@/api/response/transaction';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { formatAccountNumber } from '@/lib/account-utils';

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
    cell: ({ row }) => formatAccountNumber(row.original.toAccount),
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
    header: 'Payment Timestamp',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge>{paymentStatusToString(row.original.status).toUpperCase()}</Badge>
    ),
  },
];
