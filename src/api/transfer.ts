import { Axios } from 'axios';
import { NewTransferRequest } from '@/api/request/transfer';

export const postNewTransfer = async (
  client: Axios,
  data: NewTransferRequest
): Promise<void> => {
  await client.post('/transaction/transfer', data);
};
