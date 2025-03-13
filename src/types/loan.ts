export const ALL_LOAN_STATUSES_ = [
  'APPROVED',
  'REJECTED',
  'PAID_OFF',
  'DELAYED',
  'PROCESSING',
] as const;

export type LoanStatus = (typeof ALL_LOAN_STATUSES_)[number];
export const ALL_LOAN_STATUSES: LoanStatus[] = [...ALL_LOAN_STATUSES_];

export const ALL_INTEREST_TYPES_ = ['FIXED', 'VARIABLE'] as const;

export type InterestType = (typeof ALL_INTEREST_TYPES_)[number];
export const ALL_INTEREST_TYPES: InterestType[] = [...ALL_INTEREST_TYPES_];

export const ALL_LOAN_TYPES_ = [
  'CASH',
  'MORTGAGE',
  'AUTO_LOAN',
  'REFINANCING',
  'STUDENT_LOAN',
] as const;

export type LoanType = (typeof ALL_LOAN_TYPES_)[number];
export const ALL_LOAN_TYPES: LoanType[] = [...ALL_LOAN_TYPES_];

export const ALL_EMPLOYMENT_STATUSES_ = [
  'PERMANENT',
  'TEMPORARY',
  'UNEMPLOYED',
] as const;

export type EmploymentStatus = (typeof ALL_EMPLOYMENT_STATUSES_)[number];
export const ALL_EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  ...ALL_EMPLOYMENT_STATUSES_,
];

export const ALL_MORTGAGE_PERIODS_ = [60, 120, 180, 240, 300, 360] as const;
export const ALL_DEFAULT_PERIODS_ = [12, 24, 36, 48, 60, 72, 84] as const;

export type MortgagePeriod = (typeof ALL_MORTGAGE_PERIODS_)[number];
export type DefaultPeriod = (typeof ALL_DEFAULT_PERIODS_)[number];

export const ALL_MORTGAGE_PERIODS: MortgagePeriod[] = [
  ...ALL_MORTGAGE_PERIODS_,
];
export const ALL_DEFAULT_PERIODS: DefaultPeriod[] = [...ALL_DEFAULT_PERIODS_];
