import { SecurityType } from '@/types/securities';
import { MonetaryAmount } from '@/api/response/listing';

export interface PublicStocksDto {
  securityType: SecurityType;
  sellerId: string;
  stockId: string;
  ownerUsername: string;
  ticker: string;
  name: string;
  amount: number;
  activePrice: MonetaryAmount;
  lastUpdated: string;
}

export interface OtcRequestDto {
  id: string;
  stock: StockInfoDto;
  pricePerStock: MonetaryAmount;
  premium: MonetaryAmount;
  latestStockPrice: MonetaryAmount;
  amount: number;
  madeBy: string /* username of the user who made the offer */;
  madeFor: string /* username of the user for whom the offer is intended */;
  modifiedBy: string /* username of the user who last modified the offer */;
  lastModified: string /* e.g. "2024-04-10T12:34:56Z" */;
  settlementDate: string /* YYYY-MM-DD */;
}

export interface StockInfoDto {
  Name: string;
  DividendYield: string;
  SharesOutstanding: string;
  MarketCapitalization: string;
}
