export const ALL_CURRENCIES_ = [
  'RSD',
  'EUR',
  'CHF',
  'USD',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
] as const;

export type Currency = (typeof ALL_CURRENCIES_)[number];
export const ALL_CURRENCIES: Currency[] = [...ALL_CURRENCIES_];
