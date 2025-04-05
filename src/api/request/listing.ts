import { SecurityType } from '@/types/securities';
import { ListingSortBy, ListingSortDirection } from '@/types/listings';

export interface GetListingsFilters {
  searchName?: string;
  searchTicker?: string;
  priceMin?: number;
  priceMax?: number;
  askMin?: number;
  askMax?: number;
  bidMin?: number;
  bidMax?: number;
  exchangePrefix?: string;
  securityType?: SecurityType;
  settlementDateFrom?: string;
  settlementDateTo?: string;
  volumeMin?: number;
  volumeMax?: number;
  sortBy?: ListingSortBy;
  sortDirection?: ListingSortDirection;
}
