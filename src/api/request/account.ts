import { Privilege } from '@/types/privileges';
import { Currency } from '@/types/currency';

export interface NewAccountDto {
  client: NewClientDto | ExistingClientDto;
  company: NewCompanyDto | null;
  availableBalance: number;
  currency: Currency;
}

export interface NewCompanyDto {
  name: string;
  tin: string;
  crn: string;
  address: string;
  activityCode: string;
}

export interface ExistingClientDto {
  id: string;
}

export interface NewClientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string; // TODO(marko): make this Gender
  email: string;
  phone: string;
  address: string;
  privilege: Privilege[];
}
