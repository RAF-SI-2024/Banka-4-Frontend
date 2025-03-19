import { MaybePromise } from './MaybePromise';
import { CompanyResponseDto } from '@/api/response/company';

export const ALL_ACCOUNT_TYPES_ = [
  'CheckingPersonal',
  'CheckingBusiness',
  'FxPersonal',
  'FxBusiness',
] as const;

export type AccountType = (typeof ALL_ACCOUNT_TYPES_)[number];
export const ALL_ACCOUNT_TYPES: AccountType[] = [...ALL_ACCOUNT_TYPES_];

export interface AccountCarouselItem {
  accountNumber: string;
  balance: number;
  currencyCode: string;
  owner: string;
  type: string;
  availableBalance: number;
  reservedBalance: number;
  monthlyLimit: number;
  dailyLimit: number;
  onClickChangeLimits?: () => MaybePromise<unknown>;
  company?: CompanyResponseDto;
}
