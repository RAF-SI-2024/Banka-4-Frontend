import { Axios } from 'axios';
import { ContactResponseDto } from '@/api/response/contact';
import { NewContactRequest, EditContactRequest } from '@/api/request/contact';
import { ContactOverviewResponseDto } from '@/api/response/contact';

export const getContactById = async (client: Axios, id: string) =>
  client.get<ContactResponseDto>(`/contact/${id}`);

export const postNewContact = async (client: Axios, data: NewContactRequest) =>
  client.post<void>('/contact', data);

export const updateContact = async (
  client: Axios,
  id: string,
  data: EditContactRequest
) => client.put<void>(`/contact/${id}`, data);

export const deleteContact = async (client: Axios, id: string) =>
  client.delete<void>(`/contact/${id}`);

export const searchContacts = async (
  client: Axios,
  filters: { name: string; accountNumber: string },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<ContactOverviewResponseDto>('/contact/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};
