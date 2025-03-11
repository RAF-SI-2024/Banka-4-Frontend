import { Axios } from 'axios';
import { LoansResponseDto } from './response/loans';

//TODO: define LoanFilters interface
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

export const searchAllLoans = async (
  client: Axios,
  filters: {
    type: string;
    loanNumber: string;
    status: string;
  },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<LoansResponseDto>('/loans/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};
