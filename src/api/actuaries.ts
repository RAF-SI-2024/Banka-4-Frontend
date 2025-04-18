import { Axios } from 'axios';
import { cleanObject } from '@/lib/request-utils';
import { ActuariesFilter } from '@/api/request/actuaries';
import { ActuariesSearchResponse } from '@/api/response/actuaries';

export const searchActuaries = async (
  client: Axios,
  filters: ActuariesFilter,
  page: number,
  size: number
) =>
  client.get<ActuariesSearchResponse>('/stock/actuaries/search', {
    params: { ...cleanObject(filters), size, page },
  });

export const updateLimits = async (
  client: Axios,
  actuaryId: string,
  newLimit: number | null
) =>
  client.put<void>(`/stock/actuaries/limit/${actuaryId}`, {
    limitAmount: newLimit,
    limitCurrencyCode: 'RSD',
  });

export const resetUsedLimit = async (client: Axios, actuaryId: string) =>
  client.put<void>(`/stock/actuaries/limit/reset/${actuaryId}`);
