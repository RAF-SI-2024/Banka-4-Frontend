import { OrderDirection, OrderStatus, OrderType } from '@/types/orders';
import { MonetaryAmount } from '@/api/response/listing';

export interface OrderDto {
  id: string;
  firstName: string;
  lastName: string;
  assetTicker: string;
  orderType: OrderType;
  direction: OrderDirection;
  quantity: number;
  pricePerUnit: MonetaryAmount;
  status: OrderStatus;
  isDone: boolean;
  createdAt: string;
  lastModified: string;
  contractSize: number;
  remainingPortions: number;
}

export interface OrderPreviewDto {
  orderType: OrderType;
  approximatePrice: number;
  quantity: number;
}
