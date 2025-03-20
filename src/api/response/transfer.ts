import { Currency } from '@/types/currency';
import { Pageable } from '@/types/pageable';
import { TransactionStatus } from './transaction';

export const transferStatusToString = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.REALIZED:
      return 'Realized';
    case TransactionStatus.REJECTED:
      return 'Rejected';
    case TransactionStatus.IN_PROGRESS:
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
  status: TransactionStatus;
}

export type TransferResponseDto = Pageable<TransferDto>;
