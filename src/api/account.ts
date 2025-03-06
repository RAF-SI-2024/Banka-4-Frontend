import { Axios } from 'axios';
import { NewAccountDto } from '@/api/request/account';
import { AccountDto } from '@/api/response/account';

export const getAccounts = async (client: Axios) => {
  return client.get<AccountDto[]>(`/account/`);
};
export const postNewAccount = async (client: Axios, data: NewAccountDto) =>
  client.post<void>('/account', data);
