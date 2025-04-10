import { EmployeePrivilege } from '@/types/privileges';

export interface NewEmployeeRequest {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  privilege: EmployeePrivilege[];
  position: string;
  department: string;
  active: boolean;
}

export type EditEmployeeRequest = Partial<NewEmployeeRequest>;

export interface EmployeeFilter {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}
