import { Pageable } from '@/types/pageable';
import { Privilege } from '@/types/privileges';

export interface EmployeeResponseDto {
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
  active: boolean;
  privileges: Privilege[];
}

export type EmployeeOverviewResponseDto = Pageable<EmployeeResponseDto>;
