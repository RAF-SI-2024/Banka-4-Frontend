import { Axios } from 'axios';
import { AccountDto, AccountOverviewResponseDto } from './response/account';

export const getAccountById = async (client: Axios, id: string) =>
  client.get<AccountDto>(`/account/${id}`);

export const searchAccounts = async (
  client: Axios,
  filters: {
    accountNumber: string;
    firstName: string;
    lastName: string;
    accountType: string;
  },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<AccountOverviewResponseDto>('/account/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};
