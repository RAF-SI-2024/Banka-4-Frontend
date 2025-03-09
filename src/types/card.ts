export interface Card {
    cardNumber: string;
    cardOwner: string;
    cardType: string;
    expirationDate: string;
    cvv: string;
    status: string;
    balance: number;
}

export interface CardInfo {
  cardNumber: string;
  cardType: string;
  cardName: string;
  createdDate: string;
  expiryDate: string;
  accountNumber: string;
  cvv: string;
  limit: number;
  status: string;
  cardOwner: string;
}

export const CARD_NAMES_ = [
  'Visa',
  'MasterCard',
  'DinaCard',
  'American Express',
] as const;

export const CARD_TYPES_ = ['Debit', 'Credit'] as const;

export const CARD_STATUS_ = ['ACTIVATED', 'DEACTIVATED', 'BLOCKED'] as const;

export type CardName = (typeof CARD_NAMES_)[number];
export type CardType = (typeof CARD_TYPES_)[number];

export type CardStatus = (typeof CARD_STATUS_)[number];
export const ALL_CARD_STATUSES: CardStatus[] = [...CARD_STATUS_];
