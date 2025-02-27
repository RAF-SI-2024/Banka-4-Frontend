import { Privilege } from '@/types/privileges';

export interface NewEmployeeRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  privilege: Privilege[];
  position: string;
  department: string;
  active: boolean;
}

export type EditEmployeeRequest = Partial<NewEmployeeRequest>;
