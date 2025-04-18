import { Axios } from 'axios';
import { AccountDto, AccountOverviewResponseDto } from './response/account';
import { NewAccountDto, SetAccountLimitsDto } from '@/api/request/account';

export const getAccountById = async (client: Axios, id: string) =>
  client.get<AccountDto>(`/account/${id}`);

export const searchAccounts = async (
  client: Axios,
  filters: {
    accountNumber: string;
    firstName: string;
    lastName: string;
  },
  rowsPerPage: number,
  currentPage: number
) =>
  client.get<AccountOverviewResponseDto>('/account/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });

export const getClientAccounts = async (client: Axios) => {
  return client.get<AccountDto[]>(`/account`);
};

export const getEmployeeAccounts = async (client: Axios) => {
  return client.get<AccountDto[]>(`/account/bank-accounts`);
};
export const getAccounts = async (client: Axios) => {
  return client.get<AccountDto[]>(`/account`);
};

export const postNewAccount = async (client: Axios, data: NewAccountDto) =>
  client.post<void>('/account', data);

export const setAccountLimits = async (
  client: Axios,
  accountNumber: string,
  data: SetAccountLimitsDto
) => client.put<void>(`/account/set-limits/${accountNumber}`, data);
