import { Axios } from 'axios';
import { TransferStockDto } from '@/api/request/stocks';

/* backend does return some response, but we are going to ignore it. */
export const transferStocks = async (client: Axios, body: TransferStockDto) =>
  client.put<void>('/stock/stocks/transfer', body);
