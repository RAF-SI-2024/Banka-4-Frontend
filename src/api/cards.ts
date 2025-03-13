import { CardsResponseDto, EmployeeCardResponseDto } from './response/cards';
import { Axios } from 'axios';
import { CardStatus } from '@/types/card';
import { AuthorizedUserDto } from './request/authorized-user';

export const searchCards = async (
  client: Axios,
  filters: CardFilter,
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<EmployeeCardResponseDto>('/cards/employee/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};

export const searchClientCards = async (
  client: Axios,
  filters: CardFilter,
  page: number,
  size: number
) =>
  client.get<CardsResponseDto>(`/cards/client/search`, {
    params: { ...filters, page, size },
  });

export const createCard = async (
  client: Axios,
  requestData: {
    accountNumber: string;
    authorizedUser?: AuthorizedUserDto | null;
  },
  otp: string
) => {
  return client.post('/cards/create', requestData, {
    headers: {
      'X-2FA-CODE': otp,
    },
  });
};

export const blockCard = async (client: Axios, cardNumber: string) =>
  client.put<void>(`cards/block/${cardNumber}`);

export const unblockCard = async (client: Axios, cardNumber: string) =>
  client.put<void>(`cards/unblock/${cardNumber}`);

export const deactivateCard = async (client: Axios, cardNumber: string) =>
  client.put<void>(`cards/deactivate/${cardNumber}`);

export type CardFilter = Partial<{
  accountNumber?: string;
  cardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  cardStatus: CardStatus;
}>;
