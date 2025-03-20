import { Currency } from '@/types/currency';
import { Pageable } from '@/types/pageable';

export const transferStatusToString = (status: TransferStatus): string => {
  switch (status) {
    case TransferStatus.REALIZED:
      return 'Realized';
    case TransferStatus.REJECTED:
      return 'Rejected';
    case TransferStatus.IN_PROGRESS:
      return 'In Progress';
  }
};

export interface TransferDto {
  id: string;
  transactionNumber: string;
  fromAccount: string;
  toAccount: string;
  fromAmount: number;
  fromCurrency: Currency;
  toAmount: number;
  toCurrency: Currency;
  feeAmount: number;
  feeCurrency: string;
  paymentDateTime: string;
  status: TransferStatus;
}

export enum TransferStatus {
  REALIZED = 'REALIZED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export type TransferResponseDto = Pageable<TransferDto>;
