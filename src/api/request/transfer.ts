export interface NewTransferRequest {
  fromAccount: string;
  toAccount: string;
  fromAmount: number;
}

export type EditTransferRequest = Partial<NewTransferRequest>;
