import { Axios } from 'axios';
import { LoanStatus, LoanType } from '@/types/loan';
import {
  LoansResponseDto,
  LoanRequestsResponseDto,
  LoanInstallmentResponseDto,
} from '@/api/response/loan';
import { cleanObject } from '@/lib/request-utils';

export interface LoanFilters {
  loanType?: LoanType;
  loanStatus?: LoanStatus;
  accountNumber?: string;
}

export interface LoanRequestFilters {
  loanType?: LoanType;
  accountNumber?: string;
}

export const searchLoans = async (
  client: Axios,
  page: number,
  size: number
) => {
  return client.get<LoansResponseDto>('/loans/me', {
    params: { page, size },
  });
};

export const searchAllLoans = async (
  client: Axios,
  filters: LoanFilters,
  page: number,
  size: number
) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '')
  );

  return client.get<LoansResponseDto>('/loans/search', {
    params: { ...cleanedFilters, page, size },
  });
};
export const searchAllLoanRequests = async (
  client: Axios,
  filters: LoanRequestFilters,
  page: number,
  size: number
) => {
  const cleanedFilters = cleanObject(filters);

  return client.get<LoanRequestsResponseDto>('/loans/search-requested', {
    params: { ...cleanedFilters, page, size },
  });
};
export const approveLoan = async (client: Axios, loanNumber: number) => {
  return client.put<void>(`/loans/approve/${loanNumber}`);
};

export const rejectLoan = async (client: Axios, loanNumber: number) => {
  return client.put<void>(`/loans/reject/${loanNumber}`);
};

export const getLoanInstallments = async (
  client: Axios,
  loanNumber: number,
  page: number,
  size: number
) => {
  return client.get<LoanInstallmentResponseDto>(
    `/loans/installment/${loanNumber}`,
    {
      params: { page, size },
    }
  );
};
