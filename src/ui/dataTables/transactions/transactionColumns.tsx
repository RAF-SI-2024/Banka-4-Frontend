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
    accessorKey: 'fromAccount',
    header: 'From Account',
  },
  {
    accessorKey: 'toAccount',
    header: 'To Account',
  },
  {
    accessorKey: 'fromAmount',
    header: 'From Amount',
  },
  {
    accessorKey: 'fromCurrency',
    header: 'From Currency',
  },
  {
    accessorKey: 'toAmount',
    header: 'To Amount',
  },
  {
    accessorKey: 'toCurrency',
    header: 'To Currency',
  },
  {
    accessorKey: 'feeAmount',
    header: 'Fee Amount',
  },
  {
    accessorKey: 'feeCurrency',
    header: 'Fee Currency',
  },
  {
    accessorKey: 'recipient',
    header: 'Recipient',
  },
  {
    accessorKey: 'paymentCode',
    header: 'Payment Code',
  },
  {
    accessorKey: 'referenceNumber',
    header: 'Reference Number',
  },
  {
    accessorKey: 'paymentPurpose',
    header: 'Payment Purpose',
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
