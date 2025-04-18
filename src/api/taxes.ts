import { Axios } from 'axios';
import { TaxSummaryFilters } from '@/api/request/taxes';
import { Pageable } from '@/types/pageable';
import { TaxableUserDto } from '@/api/response/taxes';
import { cleanObject } from '@/lib/request-utils';

export const triggerMonthlyTax = async (client: Axios) =>
  client.post<void>('/stock/tax/trigger-monthly');

export const collectTaxForUser = async (client: Axios, userId: string) =>
  client.post<void>(`/stock/tax/collect/${userId}`);

export const getTaxSummary = async (
  client: Axios,
  filters: TaxSummaryFilters,
  page: number,
  size: number
) =>
  client.get<Pageable<TaxableUserDto>>('/stock/tax/summary', {
    params: cleanObject({ ...filters, page, size }),
  });
