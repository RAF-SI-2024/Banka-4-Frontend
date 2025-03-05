export interface Pageable<T> {
  content: T[];
  page: PageInfo;
}

interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
