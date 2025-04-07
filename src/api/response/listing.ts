import { Pageable } from '@/types/pageable';
import { ForexPairDto, FutureDto, StockDto } from '@/api/response/securities';
import { Currency } from '@/types/currency';

export type GetListingsResponse = Pageable<ListingInfoDto>;

export interface ListingInfoDto {
  securityId: string;
  name: string;
  ticker: string;
  volume: number;
  change: number;
  price: number;
}

export type GetPriceChangesResponse = PriceChangeDto[];

export interface PriceChangeDto {
  date: string;
  price: number;
}

export type ListingDetailsDto =
  | ({ securityType: 'STOCK' } & StockDto)
  | ({ securityType: 'FUTURE' } & FutureDto)
  | ({ securityType: 'FOREX-PAIR' } & ForexPairDto);

export type GetListingOptionsResponse = OptionDto[];

export interface OptionDto {
  callsId: string;
  callsLastPrice: number;
  callsChange: number;
  callsImpliedVolatility: number;
  callsVolume: number;
  callsOpenInterest: number;
  callsPremium: MonetaryAmount;
  strike: number;
  putsId: string;
  putsLastPrice: number;
  putsChange: number;
  putsImpliedVolatility: number;
  putsVolume: number;
  putsOpenInterest: number;
  putsPremium: MonetaryAmount;
}

export interface MonetaryAmount {
  amount: number;
  currency: Currency;
}
