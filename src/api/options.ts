import { Axios } from 'axios';
import { BuyOptionRequestDto, UseOptionRequest } from '@/api/request/options';

export const apiUseOption = async (client: Axios, body: UseOptionRequest) =>
  client.post<void>('stock/options/use', body);

export const buyOption = async (client: Axios, body: BuyOptionRequestDto) =>
  client.post<void>('/stock/options/buy', body);
