import { Axios } from 'axios';
import { ExchangeDto } from './response/exchange';

export const searchExchanges = async (
  client: Axios,
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<ExchangeDto>('/exchange/exchange-rate', {
    params: { size: rowsPerPage, page: currentPage },
  });
};
