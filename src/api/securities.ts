import { Axios } from 'axios';
import { Pageable } from '@/types/pageable';
import { SecurityHoldingDto, UserTaxInfoDto } from '@/api/response/securities';
import { MonetaryAmount } from '@/api/response/listing';

export const getMyPortfolio = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<Pageable<SecurityHoldingDto>>('/stock/securities', {
    params: { page, size },
  });

export const getMyProfit = async (client: Axios) =>
  client.get<MonetaryAmount>('/stock/securities/profit');

export const getMyTax = async (client: Axios) =>
  client.get<UserTaxInfoDto>('/stock/securities/tax');
