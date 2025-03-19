import { Pageable } from '@/types/pageable';
import { CurrencyDto } from './account';
import {
  InterestType,
  LoanStatus,
  LoanType,
  PaymentStatus,
} from '@/types/loan';

export interface LoanDto {
  loanNumber: number;
  type: LoanType;
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
  status: LoanStatus;
  interestType: InterestType;
}

export interface LoanRequestDto {
  loanType: LoanType;
  amount: number;
  currency: CurrencyDto;
  purposeOfLoan: string;
  monthlyIncome: number;
  employmentStatus: string;
  employmentPeriod: number;
  repaymentPeriod: number;
  contactPhone: string;
  accountNumber: string;
  loanNumber: number;
}

export interface LoanInstallmentDto {
  installmentAmount: number;
  interestRateAmount: number;
  expectedDueDate: string;
  actualDueDate: string;
  paymentStatus: PaymentStatus;
}

export type LoansResponseDto = Pageable<LoanDto>;
export type LoanRequestsResponseDto = Pageable<LoanRequestDto>;
export type LoanInstallmentResponseDto = Pageable<LoanInstallmentDto>;
