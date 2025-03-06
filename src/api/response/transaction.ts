import { Pageable } from '@/types/pageable';

export enum PaymentStatus {
  REALIZED = 'REALIZED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export const paymentStatusToString = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.REALIZED:
      return 'Realized';
    case PaymentStatus.REJECTED:
      return 'Rejected';
    case PaymentStatus.IN_PROGRESS:
      return 'In Progress';
  }
};

export interface TransactionDto {
  id: string;
  transactionNumber: string;
  fromAccount: string;
  toAccount: string;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  feeAmount: number;
  feeCurrency: string;
  recipient: string;
  paymentCode: string;
  referenceNumber: string;
  paymentPurpose?: string;
  paymentDateTime: string;
  status: PaymentStatus;
}

export type TransactionsResponseDto = Pageable<TransactionDto>;
