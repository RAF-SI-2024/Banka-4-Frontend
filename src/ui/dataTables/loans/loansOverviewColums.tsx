import { ColumnDef } from '@tanstack/react-table';
import { LoanDto } from '@/api/response/loans';

export const loansColumns: ColumnDef<LoanDto>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'interestType',
    header: 'Interest Type',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'agreementDate',
    header: 'Agreement Date',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'repaymentPeriod',
    header: 'Repayment Period',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'loanNumber',
    header: 'Loan Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'remainingDebt',
    header: 'Remaining Debt',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'currency.code',
    header: 'Currency Code',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => info.getValue(),
  },
];
