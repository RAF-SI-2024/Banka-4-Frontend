export const ALL_SECURITY_TYPES_ = ['FUTURE', 'STOCK', 'FOREX_PAIR'] as const;

export type SecurityType = (typeof ALL_SECURITY_TYPES_)[number];
export const ALL_SECURITY_TYPES: SecurityType[] = [...ALL_SECURITY_TYPES_];

export const ALL_ASSET_TYPES_ = [
  'STOCK',
  'FUTURE',
  'FOREX_PAIR',
  'OPTION',
] as const;

export type AssetType = (typeof ALL_ASSET_TYPES_)[number];
export const ALL_ASSET_TYPES: AssetType[] = [...ALL_ASSET_TYPES_];

export const ALL_STOCK_VISIBILITIES_ = ['PRIVATE', 'PUBLIC'] as const;

export type StockVisibility = (typeof ALL_STOCK_VISIBILITIES_)[number];
export const ALL_STOCK_VISIBILITIES: StockVisibility[] = [
  ...ALL_STOCK_VISIBILITIES_,
];

export const ALL_OPTION_TYPES_ = ['CALL', 'PUT'] as const;
export type OptionType = (typeof ALL_OPTION_TYPES_)[number];
export const ALL_OPTION_TYPES: OptionType[] = [...ALL_OPTION_TYPES_];

export const ALL_UNIT_NAMES_ = [
  'BUSHEL',
  'POUND',
  'BOARD_FEET',
  'BARREL',
  'MMBTU',
  'GALLON',
  'TROY_OUNCE',
  'METRIC_TON',
  'SHORT_TON',
  'CUBIC_FEET',
  'LITER',
  'GRAM',
  'KILOGRAM',
  'OUNCE',
  'CARAT',
  'QUART',
  'MILLILITER',
  'HECTOLITER',
  'MEGAWATT_HOUR',
  'CWT',
  'BOTTLE',
  'DOZEN',
  'YARD',
  'FOOT',
  'INCH',
  'SQUARE_FEET',
  'SQUARE_METER',
  'CORD',
  'BUSHEL_WEIGHT',
  'KILOPOUND',
  'DRAM',
] as const;

export type UnitName = (typeof ALL_UNIT_NAMES_)[number];
export const ALL_UNIT_NAMES: UnitName[] = [...ALL_UNIT_NAMES_];

export const ALL_FOREX_LIQUIDITIES_ = ['HIGH', 'MEDIUM', 'LOW'] as const;

export type ForexLiquidity = (typeof ALL_FOREX_LIQUIDITIES_)[number];
export const ALL_FOREX_LIQUIDITIES: ForexLiquidity[] = [
  ...ALL_FOREX_LIQUIDITIES_,
];
