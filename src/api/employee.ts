import { Axios } from 'axios';
import {
  EditEmployeeRequest,
  NewEmployeeRequest,
} from '@/api/request/employee';
import {
  EmployeeOverviewResponseDto,
  EmployeeResponseDto,
} from '@/api/response/employee';

export const getEmployeeById = async (client: Axios, id: string) =>
  client.get<EmployeeResponseDto>(`/employee/${id}`);

export const updateEmployeeById = async (
  client: Axios,
  id: string,
  data: EditEmployeeRequest
) => client.put<void>(`/employee/${id}`, data);

export const postNewEmployee = async (
  client: Axios,
  data: NewEmployeeRequest
) => client.post<void>('/employee', data);

export const searchEmployees = async (
  client: Axios,
  filters: {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
  },
  rowsPerPage: number,
  currentPage: number
) => {
  return client.get<EmployeeOverviewResponseDto>('/employee/search', {
    params: { ...filters, size: rowsPerPage, page: currentPage },
  });
};
