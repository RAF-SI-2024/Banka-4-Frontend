import { ClientResponseDto } from './client';
import { CompanyResponseDto } from './company';
import { EmployeeResponseDto } from './employee';
import { Pageable } from '@/types/pageable';
import { AccountType } from '@/types/account';
import { Currency } from '@/types/currency';

export interface AccountDto extends Omit<BaseAccountDto, 'currency'> {
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

export interface BaseAccountDto {
  accountNumber: string;
  currency: Currency;
  balance: number;
  availableBalance: number;
}

export interface CurrencyDto {
  code: Currency;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BankAccountDto extends BaseAccountDto {}

export type AccountOverviewResponseDto = Pageable<AccountDto>;
