import { ForexLiquidity, UnitName } from '@/types/securities';
import { Currency } from '@/types/currency';
import { ListingInfoDto } from '@/api/response/listing';

export type StockDto = {
  outstandingShares: number;
  dividendYield: number;
  createdAt: string;
} & ListingInfoDto;

export type FutureDto = {
  contractSize: number;
  contractUnit: UnitName;
  settlementDate: string;
} & ListingInfoDto;

export type ForexPairDto = {
  baseCurrency: Currency;
  quoteCurrency: Currency;
  liquidity: ForexLiquidity;
  exchangeRate: number;
} & ListingInfoDto;
