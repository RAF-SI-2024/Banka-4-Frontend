import { MaybePromise } from './MaybePromise';
import { CompanyResponseDto } from '@/api/response/company';

export interface TransactionCarouselItem {
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
