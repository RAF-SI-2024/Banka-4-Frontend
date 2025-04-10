import { Pageable } from '@/types/pageable';
import { EmployeeResponseDto } from '@/api/response/employee';
import { Currency } from '@/types/currency';

export interface ActuaryInfoDto {
  needsApproval: boolean;
  limitAmount: number;
  usedLimitAmount: number;
  currencyCode: Currency;
}

export type ActuariesSearchResponse = Pageable<{
  user: EmployeeResponseDto;
  actuary: ActuaryInfoDto;
}>;
