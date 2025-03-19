import { Privilege } from '@/types/privileges';
import { Currency } from '@/types/currency';
import { Gender } from '@/types/gender';

export interface NewAccountDto {
  client: NewClientDto | ExistingClientDto;
  company: NewCompanyDto | null;
  availableBalance: number;
  currency: Currency;
  createCard: boolean;
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
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  privilege: Privilege[];
}

export interface SetAccountLimitsDto {
  daily: number;
  monthly: number;
  otpCode: string;
}
