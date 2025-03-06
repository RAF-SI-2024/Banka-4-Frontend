import { Axios } from 'axios';
import { TransactionDto } from '@/api/response/transaction';

export const fetchTransactions = async (client: Axios, accountNumber: string | undefined) => {
  if (!accountNumber) {
    return Promise.resolve([]);
  }
  const response = await client.get<TransactionDto[]>('/transaction/search', {
    params: {
      accountNumber,
    },
  });
  return response.data;
};
