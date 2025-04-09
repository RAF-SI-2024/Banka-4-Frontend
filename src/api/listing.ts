import { Axios } from 'axios';
import { GetListingsFilters } from '@/api/request/listing';
import {
  GetListingOptionsResponse,
  GetListingsResponse,
  GetPriceChangesResponse,
  ListingDetailsDto,
} from '@/api/response/listing';
import { cleanObject } from '@/lib/request-utils';

export const getListings = async (
  client: Axios,
  params: GetListingsFilters,
  page: number,
  size: number
) =>
  client.get<GetListingsResponse>('/stock/listings', {
    params: { ...cleanObject(params), page, pageSize: size },
  });

export const getPriceChanges = async (client: Axios, securityId: string) =>
  client.get<GetPriceChangesResponse>(
    `/stock/listings/${securityId}/priceChange`
  );

export const getListingDetails = async (client: Axios, securityId: string) =>
  client.get<ListingDetailsDto>(`/stock/listings/${securityId}`);

export const getListingOptions = async (
  client: Axios,
  stockId: string,
  settlementDate: string
) =>
  client.get<GetListingOptionsResponse>(`/stock/listings/options/${stockId}`, {
    params: { settlementDate },
  });
