import { EmploymentStatus, InterestType, LoanType } from '@/types/loan';
import { Currency } from '@/types/currency';

/**
 * DTO for creating a new loan request.
 * Matches the POST /loans request body from Swagger.
 */
export interface NewLoanRequest {
  loanType: LoanType;
  interestType: InterestType;
  amount: number;
  currency: Currency;
  purposeOfLoan: string;
  monthlyIncome: number;
  employmentStatus: EmploymentStatus;
  employmentPeriod: number;
  repaymentPeriod: number;
  contactPhone: string;
  accountNumber: string;
}
