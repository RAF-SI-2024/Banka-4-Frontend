import { Axios } from 'axios';
import { ClientResponseDto } from './response/client';
import { EditClientRequest, NewClientRequest } from './request/client';
import { Pageable } from '@/types/pageable';

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
