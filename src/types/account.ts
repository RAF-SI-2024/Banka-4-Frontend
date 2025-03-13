export const ALL_ACCOUNT_TYPES_ = [
  'CheckingPersonal',
  'CheckingBusiness',
  'FxPersonal',
  'FxBusiness',
] as const;

export type AccountType = (typeof ALL_ACCOUNT_TYPES_)[number];
export const ALL_ACCOUNT_TYPES: AccountType[] = [...ALL_ACCOUNT_TYPES_];
