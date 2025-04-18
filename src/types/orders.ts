export const ORDER_DIRECTIONS_ = ['BUY', 'SELL'] as const;
export type OrderDirection = (typeof ORDER_DIRECTIONS_)[number];
export const ORDER_DIRECTIONS: OrderDirection[] = [...ORDER_DIRECTIONS_];

export const ORDER_TYPES_ = ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'] as const;
export type OrderType = (typeof ORDER_TYPES_)[number];
export const ORDER_TYPES: OrderType[] = [...ORDER_TYPES_];

export const ORDER_STATUSES_ = ['PENDING', 'APPROVED', 'DECLINED'] as const;
export type OrderStatus = (typeof ORDER_STATUSES_)[number];
export const ORDER_STATUSES: OrderStatus[] = [...ORDER_STATUSES_];
