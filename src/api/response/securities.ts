import {
  AssetType,
  ForexLiquidity,
  OptionType,
  UnitName,
} from '@/types/securities';
import { Currency } from '@/types/currency';
import { ListingInfoDto, MonetaryAmount } from '@/api/response/listing';

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

export interface SecurityHoldingDto {
  id: string;
  assetType: AssetType;
  optionType: OptionType | null;
  ticker: string;
  amount: number;
  price: MonetaryAmount;
  profit: MonetaryAmount;
  publicAmount: number;
  lastModified: string;
}

export interface UserTaxInfoDto {
  paidTaxThisYear: number;
  unpaidTaxThisMonth: number;
  currency: Currency;
}

export interface ActuaryProfitDto {
  profit: MonetaryAmount;
  name: string;
  surname: string;
  position: string;
}
