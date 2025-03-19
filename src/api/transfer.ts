import { Axios } from 'axios';
import { NewTransferRequest } from '@/api/request/transfer';
import { TransferResponseDto } from './response/transfer';

export const postNewTransfer = async (
  client: Axios,
  data: NewTransferRequest
): Promise<void> => {
  await client.post('/transaction/transfer', data);
};

export const getAllTransfers = async (
  client: Axios,
  page: number,
  size: number
) =>
  client.get<TransferResponseDto>(`/transaction/transfer-history`, {
    params: { page, size },
  });
