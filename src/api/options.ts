import { Axios } from 'axios';
import { UseOptionRequest } from '@/api/request/options';

export const useOption = async (client: Axios, body: UseOptionRequest) =>
  client.post<void>('stock/options/use', body);
