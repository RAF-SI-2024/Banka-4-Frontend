import { Axios } from 'axios';
import { Pageable } from '@/types/pageable';
import { OtcRequestDto, PublicStocksDto } from '@/api/response/otc';
import { OtcRequestCreateDto, OtcRequestUpdateDto } from '@/api/request/otc';
import { cleanObject } from '@/lib/request-utils';

/* endpoints for OTC overview */

export const getPublicStocks = async (client: Axios) =>
  client.get<PublicStocksDto[]>('/stock/stocks/public');

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
  client.get<Pageable<OtcRequestDto>>('/stock/otc/me/unread', {
    params: { page, size },
  });

export const rejectOtcRequest = async (
  client: Axios,
  idId: string,
  routingNumber: string
) => client.patch<void>(`/stock/otc/reject/${idId}/${routingNumber}`);

export const acceptOtcRequest = async (
  client: Axios,
  idId: string,
  routingNumber: string
) => client.patch<void>(`/stock/otc/accept/${idId}/${routingNumber}`);

export const updateOtcRequest = async (
  client: Axios,
  idId: string,
  routingNumber: string,
  body: Partial<OtcRequestUpdateDto>
) =>
  client.patch<void>(
    `/stock/otc/update/${idId}/${routingNumber}`,
    cleanObject(body)
  );
