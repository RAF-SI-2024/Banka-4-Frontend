export const ALL_TAXABLE_USER_TYPES_ = ['CLIENT', 'ACTUARY'] as const;

export type TaxableUserType = (typeof ALL_TAXABLE_USER_TYPES_)[number];
export const ALL_TAXABLE_USER_TYPES: TaxableUserType[] = [
  ...ALL_TAXABLE_USER_TYPES_,
];
