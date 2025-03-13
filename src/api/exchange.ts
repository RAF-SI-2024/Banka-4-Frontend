import { Axios } from 'axios';
import { ExchangeDto } from './response/exchange';

export const searchExchanges = async (client: Axios) => {
  console.log('searchExchanges');
  return client.get<ExchangeDto>('/exchange/exchange-rate');
};
