import { get } from './api';
import { MeResponseDto } from './response/MeResponseDto';

export const getMe = async () => get<MeResponseDto>('auth/me');
