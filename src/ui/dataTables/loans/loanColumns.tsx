import { ColumnDef } from '@tanstack/react-table';
import { LoanDto } from '@/api/response/loan';

export const loanColumns: ColumnDef<LoanDto>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'loanNumber',
    header: 'Loan Number',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
];
