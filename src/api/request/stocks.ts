import { StockVisibility } from '@/types/securities';

export interface TransferStockDto {
  stockId: string;
  amount: number;
  transferTo: StockVisibility;
}
