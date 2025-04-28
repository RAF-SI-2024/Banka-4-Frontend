import { Axios } from 'axios';
import { Pageable } from '@/types/pageable';
import {
  ActuaryProfitDto,
  SecurityHoldingDto,
  UserTaxInfoDto,
} from '@/api/response/securities';
import { MonetaryAmount } from '@/api/response/listing';
import { BankProfitFilters } from '@/api/request/securities';
import { cleanObject } from '@/lib/request-utils';

export const getMyPortfolio = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<Pageable<SecurityHoldingDto>>('/stock/securities/me', {
    params: { page, size },
  });

export const getMyProfit = async (client: Axios) =>
  client.get<MonetaryAmount>('/stock/securities/profit');

export const getMyTax = async (client: Axios) =>
  client.get<UserTaxInfoDto>('/stock/securities/tax');

export const getBankProfit = async (
  client: Axios,
  filters: BankProfitFilters,
  page: number,
  size: number
) =>
  client.get<Pageable<ActuaryProfitDto>>('/stock/securities/bank/profit', {
    params: { ...cleanObject(filters), page, size },
  });
