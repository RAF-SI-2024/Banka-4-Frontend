/**
 * DTO for creating a new loan request.
 * Matches the POST /loans request body from Swagger.
 */
export interface NewLoanRequest {
  loanType: string;
  interestType: string;
  amount: number;
  currency: string;
  purposeOfLoan: string;
  monthlyIncome: number;
  employmentStatus: string;
  employmentPeriod: number;
  repaymentPeriod: number;
  contactPhone: string;
  accountNumber: string;
}
