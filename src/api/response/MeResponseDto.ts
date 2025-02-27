import { Privilege } from '@/types/privileges';

export interface MeResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  position: string;
  department: string;
  privileges: Privilege[];
}