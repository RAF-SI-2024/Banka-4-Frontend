import { Pageable } from '@/types/pageable';
import { CurrencyDto } from './account';

export interface LoanDto {
  loanNumber: number;
  type: string;
  amount: number;
  repaymentPeriod: number;
  interestRate: number;
  effectiveInterestRate: number;
  agreementDate: string;
  dueDate: string;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
  remainingDebt: number;
  currency: CurrencyDto;
}

export type LoansResponseDto = Pageable<LoanDto>;
