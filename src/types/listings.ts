export const ALL_SORT_BY_LISTINGS_ = ['PRICE', 'VOLUME'] as const;

export type ListingSortBy = (typeof ALL_SORT_BY_LISTINGS_)[number];
export const ALL_SORT_BY_LISTINGS: ListingSortBy[] = [...ALL_SORT_BY_LISTINGS_];

export const ALL_SORT_DIRECTION_LISTINGS_ = ['ASC', 'DESC'] as const;

export type ListingSortDirection =
  (typeof ALL_SORT_DIRECTION_LISTINGS_)[number];
export const ALL_SORT_DIRECTION_LISTINGS: ListingSortDirection[] = [
  ...ALL_SORT_DIRECTION_LISTINGS_,
];
