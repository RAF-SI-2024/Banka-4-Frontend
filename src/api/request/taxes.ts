import { TaxableUserType } from '@/types/taxes';

export interface TaxSummaryFilters {
  firstName: string;
  lastName: string;
  userType: TaxableUserType;
}
