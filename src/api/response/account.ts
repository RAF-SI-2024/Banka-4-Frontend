import { ClientResponseDto } from './client';
import { CompanyResponseDto } from './company';
import { EmployeeResponseDto } from './employee';
import { Pageable } from '@/types/pageable';
import { AccountType } from '@/types/account';
import { Currency } from '@/types/currency';

export interface AccountDto {
  id: string;
  accountNumber: string;
  balance: number;
  availableBalance: number;
  accountMaintenance: number;
  createdDate: Date;
  expirationDate: Date;
  active: boolean;
  accountType: AccountType;
  monthlyLimit: number;
  dailyLimit: number;
  currency: CurrencyDto;
  client: ClientResponseDto;
  employee: EmployeeResponseDto;
  company: CompanyResponseDto;
}

export interface CurrencyDto {
  code: Currency;
}

export interface BankAccountDto {
  accountNumber: string;
  currency: Currency;
  balance: number;
  availableBalance: number;
}

export type AccountOverviewResponseDto = Pageable<AccountDto>;
