import { Axios } from 'axios';
import { EditClientRequest, NewClientRequest } from '@/api/request/client';
import {
  ClientContactResponseDto,
  PaymentResponseDto,
} from '@/api/response/client';
import { ClientResponseDto } from './response/client';
import { Pageable } from '@/types/pageable';
import { NewPaymentRequest } from '@/api/request/transaction';

export const createPayment = async (
  client: Axios,
  data: NewPaymentRequest
): Promise<PaymentResponseDto> => {
  const response = await client.post<PaymentResponseDto>(
    '/transaction/payment',
    data
  );
  return response.data;
};

export const getClientById = async (client: Axios, id: string) =>
  client.get<ClientResponseDto>(`/client/${id}`);

export const updateClientById = async (
  client: Axios,
  id: string,
  data: EditClientRequest
) => client.put<void>(`/client/${id}`, data);

export const postNewClient = async (client: Axios, data: NewClientRequest) =>
  client.post<void>('/client', data);

export const searchClients = async (
  client: Axios,
  filters: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<Pageable<ClientResponseDto>>('/client/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};

export const getAllClientContacts = async (
  client: Axios,
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<Pageable<ClientContactResponseDto>>('/client-contact', {
    params: { size: rowsPerPage, page: currentPage },
  });
};

export const getSavedClientContacts = async (client: Axios) => {
  return client.get<ClientContactResponseDto[]>('/client-contact/me', {});
};
