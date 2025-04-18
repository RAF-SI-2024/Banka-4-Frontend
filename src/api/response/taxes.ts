import { Currency } from '@/types/currency';

export interface TaxableUserDto {
  userId: string;
  firstName: string;
  email: string;
  lastName: string;
  unpaidTax: number;
  currency: Currency;
}
