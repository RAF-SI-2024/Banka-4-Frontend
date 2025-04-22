import { MonetaryAmount } from '@/api/response/listing';
import { OrderDirection } from '@/types/orders';

export interface OrderPreviewRequest {
  assetId: string /* securityId :) */;
  direction: OrderDirection;
  quantity: number;
  limitValue?: MonetaryAmount;
  stopValue?: MonetaryAmount;
  allOrNothing?: boolean;
  margin?: boolean;
  accountNumber: string;
}

export interface CreateOrderRequest {
  assetId: string /* securityId :) */;
  direction: OrderDirection;
  quantity: number;
  limitValue?: MonetaryAmount;
  stopValue?: MonetaryAmount;
  allOrNothing?: boolean;
  margin?: boolean;
  accountNumber: string;
}
