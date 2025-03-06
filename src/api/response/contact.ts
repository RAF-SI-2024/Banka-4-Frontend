export interface ContactResponseDto {
  id: string;
  name: string;
  accountNumber: string;
}

export interface ContactOverviewResponseDto {
  content: ContactResponseDto[];
  totalElements: number;
  page: {
    totalPages: number;
  };
}
