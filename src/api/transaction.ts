import { Axios } from 'axios';
import {
  TransactionsResponseDto,
  PaymentStatus,
  TransactionDto,
} from './response/transaction';

export interface PaymentFilters {
  date?: Date;
  status?: PaymentStatus;
  amount?: number;
}

export const searchPayments = async (
  client: Axios,
  filters: PaymentFilters,
  page: number,
  size: number
) =>
  client.get<TransactionsResponseDto>(`/payment/search`, {
    params: { ...filters, page, size },
  });
