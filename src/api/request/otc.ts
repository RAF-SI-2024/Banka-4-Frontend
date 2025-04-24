import { MonetaryAmount } from '@/api/response/listing';
import { ForeignBankId } from '@/types/otc';

export interface OtcRequestCreateDto {
  userId: ForeignBankId;
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
