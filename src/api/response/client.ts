import { Privilege } from '@/types/privileges';

export interface ClientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  privileges: Privilege[];
  // TODO(marko): add accounts field
}
