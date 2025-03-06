import { Axios } from 'axios';
import { AccountDto } from '@/api/response/account';

export const fetchAccounts = async (client: Axios) =>
  client.get<AccountDto[]>('/account/');
