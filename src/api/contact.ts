import { Axios } from 'axios';
import { ContactResponseDto } from '@/api/response/contact';
import { NewContactRequest, EditContactRequest } from '@/api/request/contact';
import { Pageable } from '@/types/pageable';

export const postNewContact = async (client: Axios, data: NewContactRequest) =>
  client.post<void>('/client/create-contact', data);

export const updateContact = async (
  client: Axios,
  id: string,
  data: EditContactRequest
) => client.put<void>(`/client/contact/${id}`, data);

export const deleteContact = async (client: Axios, id: string) =>
  client.delete<void>(`/client/delete-contact/${id}`);

export const searchContacts = async (
  client: Axios,
  filters: { name: string; accountNumber: string },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<Pageable<ContactResponseDto>>('/client/contacts', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};
