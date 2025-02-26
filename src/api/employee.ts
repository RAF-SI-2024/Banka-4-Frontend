import { Axios } from 'axios';
import { MeResponseDto } from './response/MeResponseDto';

export const getMe = async (client: Axios) =>
  client.get<MeResponseDto>('/employee/me');
