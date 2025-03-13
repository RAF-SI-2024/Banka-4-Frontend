import { Axios } from 'axios';
import { NewLoanRequest } from '@/api/request/loan';

export const requestLoan = async (client: Axios, data: NewLoanRequest) =>
  client.post<void>('/loans', data);
