import { Axios } from 'axios';
import { LoansResponseDto } from './response/loan';

export interface LoanFilters {
  date?: Date;
  type?: string;
  amount?: number;
  loanNumber?: number;
}

export const searchLoans = async (
  client: Axios,
  filters: LoanFilters,
  page: number,
  size: number
) =>
  client.get<LoansResponseDto>(`/loans/me`, {
    params: { ...filters, page, size },
  });
