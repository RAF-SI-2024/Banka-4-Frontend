import { ColumnDef } from '@tanstack/react-table';
import { LoanDto } from '@/api/response/loan';
import { formatDate } from '@/lib/utils';

export const getLoanColumns = (handleViewDetails: (loan: LoanDto) => void): ColumnDef<LoanDto>[] => [
  {
    accessorKey: 'loanNumber',
    header: 'Loan Number',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'repaymentPeriod',
    header: 'Repayment Period',
  },
  {
    accessorKey: 'interestRate',
    header: 'Interest Rate',
  },
  {
    accessorKey: 'effectiveInterestRate',
    header: 'Effective Interest Rate',
  },
  {
    accessorKey: 'agreementDate',
    header: 'Agreement Date',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'nextInstallmentAmount',
    header: 'Next Installment Amount',
  },
  {
    accessorKey: 'nextInstallmentDate',
    header: 'Next Installment Date',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'remainingDebt',
    header: 'Remaining Debt',
  },
  {
    accessorKey: 'currency.code',
    header: 'Currency',
  }
];