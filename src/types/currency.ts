export type Currency =
  | 'RSD'
  | 'EUR'
  | 'CHF'
  | 'USD'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD';

export const currencyOptions = [
  'RSD',
  'EUR',
  'CHF',
  'USD',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
] as const;
