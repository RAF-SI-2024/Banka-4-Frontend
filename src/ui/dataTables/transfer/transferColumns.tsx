import { ColumnDef } from '@tanstack/react-table';
import { transferStatusToString, TransferDto } from '@/api/response/transfer';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { formatAccountNumber } from '@/lib/account-utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const transferColumns: ColumnDef<TransferDto>[] = [
  {
    accessorKey: "transactionNumber",
    header: "Transfer Number",
    cell: ({ row }) => {
      const transactionNumber = row.original.transactionNumber;
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="truncate w-20 inline-block">{transactionNumber.slice(0, 8)}...</span>
          </TooltipTrigger>
          <TooltipContent>
            {transactionNumber}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'fromAccount',
    header: 'From Account',
    cell: ({ row }) => formatAccountNumber(row.original.fromAccount),
  },
  {
    accessorKey: 'fromAmount',
    header: 'Start Amount',
    cell: ({ row }) => (
      <p>
        {row.original.fromAmount} {row.original.fromCurrency}
      </p>
    ),
  },
  {
    accessorKey: 'toAccount',
    header: 'To Account',
    cell: ({ row }) => formatAccountNumber(row.original.toAccount),
  },
  {
    accessorKey: 'toAmount',
    header: 'End Amount',
    cell: ({ row }) => (
      <p>
        {row.original.toAmount} {row.original.toCurrency}
      </p>
    ),
  },
  {
    accessorKey: 'feeAmount',
    header: 'Fee',
    cell: ({ row }) => (
      <p>
        {row.original.feeAmount} {row.original.feeCurrency}
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
