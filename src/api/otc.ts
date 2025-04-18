import { Axios } from 'axios';
import { Pageable } from '@/types/pageable';
import { OtcRequestDto, PublicStocksDto } from '@/api/response/otc';
import { OtcRequestCreateDto, OtcRequestUpdateDto } from '@/api/request/otc';
import { cleanObject } from '@/lib/request-utils';
import { MonetaryAmount } from '@/api/response/listing';

/* endpoints for OTC overview */

export const getPublicStocks = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<Pageable<PublicStocksDto>>('/stock/stocks/public', {
    params: { size, page },
  });

export const createOtcRequest = async (
  client: Axios,
  body: OtcRequestCreateDto
) => client.post<void>('/stock/otc/create', body);

/* endpoints for OTC Active Offers page */

export const getMyRequests = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<Pageable<OtcRequestDto>>('/stock/otc/me', {
    params: { page, size },
  });

export const getMyRequestsUnread = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<Pageable<OtcRequestDto>>('/stock/otc/unread', {
    params: { page, size },
  });

export const rejectOtcRequest = async (client: Axios, requestId: string) =>
  client.patch<void>(`/stock/otc/reject/${requestId}`);

export const acceptOtcRequest = async (client: Axios, requestId: string) =>
  client.patch<void>(`/stock/otc/accept/${requestId}`);

export const updateOtcRequest = async (
  client: Axios,
  requestId: string,
  body: OtcRequestUpdateDto
) => client.patch<void>(`/stock/otc/update/${requestId}`, cleanObject(body));

export const getLatestStockPrice = async (client: Axios, stockId: string) =>
  client.get<MonetaryAmount>(`/stock/stocks/${stockId}/latestPrice`);
