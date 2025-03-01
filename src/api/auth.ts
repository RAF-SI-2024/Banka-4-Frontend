import { Axios } from 'axios';
import { VerifyPasswordRequest } from '@/api/request/auth';
import { MeResponseDto } from '@/api/response/MeResponseDto';

export type UserType = 'employee' | 'client';

export const getMe = async (client: Axios) =>
  client.get<MeResponseDto>('/employee/me');

export const verifyPassword = async (
  client: Axios,
  data: VerifyPasswordRequest
) => client.post<void>('/auth/verify', data);

export const forgotPassword = async (client: Axios, email: string) =>
  client.get<void>(`/auth/forgot-password/${email}`);
