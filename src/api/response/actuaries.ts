import { Pageable } from '@/types/pageable';
import { EmployeeResponseDto } from '@/api/response/employee';
import { Currency } from '@/types/currency';

export interface ActuaryInfoDto {
  needsApproval: boolean;
  limitAmount: number | null;
  usedLimitAmount: number;
  currencyCode: Currency;
}

export interface ActuaryItem {
  user: EmployeeResponseDto;
  actuary: ActuaryInfoDto;
}


export type ActuariesSearchResponse = Pageable<ActuaryItem>;
