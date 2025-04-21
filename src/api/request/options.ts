export interface UseOptionRequest {
  optionId: string;
  accountNumber: string;
}

export interface BuyOptionRequestDto {
  optionId: string;
  accountNumber: string;
  amount: number;
}
