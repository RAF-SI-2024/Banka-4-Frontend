import { Axios, AxiosResponse } from 'axios';
import { VerifyPasswordRequest } from '@/api/request/auth';
import { EmployeeResponseDto } from '@/api/response/employee';
import { ClientResponseDto } from '@/api/response/client';

export type UserType = 'employee' | 'client';

type MeResponse<T> = T extends 'employee'
  ? EmployeeResponseDto
  : T extends 'client'
    ? ClientResponseDto
    : never;

export function getMe<T extends UserType>(
  client: Axios,
  userType: T
): Promise<AxiosResponse<MeResponse<T>>> {
  return client.get<MeResponse<T>>(`/${userType}/me`);
}

export const verifyPassword = async (
  client: Axios,
  data: VerifyPasswordRequest
) => client.post<void>('/auth/verify', data);

export const forgotPassword = async (client: Axios, email: string) =>
  client.post<void>(`/auth/forgot-password/${email}`);
