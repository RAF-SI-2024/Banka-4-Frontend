import { Axios } from 'axios';
import { ClientContactDto } from '@/api/response/contact';
import { NewContactRequest, EditContactRequest } from '@/api/request/contact';
import { Pageable } from '@/types/pageable';

export const postNewContact = async (client: Axios, data: NewContactRequest) =>
  client.post<void>('/client-contact', data);

export const updateContact = async (
  client: Axios,
  id: string,
  data: EditContactRequest
) => client.put<void>(`/client-contact/${id}`, data);

export const deleteContact = async (client: Axios, id: string) =>
  client.delete<void>(`/client-contact/${id}`);

export const searchContacts = async (
  client: Axios,
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<Pageable<ClientContactDto>>('/client-contact', {
    params: { size: rowsPerPage, page: currentPage },
  });
};
