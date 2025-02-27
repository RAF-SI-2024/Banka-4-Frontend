import { Axios } from 'axios';
import { MeResponseDto } from './response/MeResponseDto';
import { NewEmployeeRequest } from '@/api/request/employee';

export const getMe = async (client: Axios) =>
  client.get<MeResponseDto>('/employee/me');

export const postNewEmployee = async (
  client: Axios,
  data: NewEmployeeRequest
) => client.post<void>('/employee', data);
