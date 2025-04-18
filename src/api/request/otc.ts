import { MonetaryAmount } from '@/api/response/listing';

export interface OtcRequestCreateDto {
  userId: string;
  assetId: string;
  pricePerStock: MonetaryAmount;
  premium: MonetaryAmount;
  amount: number;
  settlementDate: string /* YYYY-MM-DD */;
}

export interface OtcRequestUpdateDto {
  pricePerStock: MonetaryAmount;
  premium: MonetaryAmount;
  amount: number;
  settlementDate: string /* YYYY-MM-DD */;
}
