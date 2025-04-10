'use client';
import { GetListingsFilters } from '@/api/request/listing';
import FilterBar from '@/components/filters/FilterBar';
import useTablePageParams from '@/hooks/useTablePageParams';
import { ListingSortBy, ListingSortDirection } from '@/types/listings';
import { listingFilterColumns } from '@/ui/dataTables/listings/listingColumns';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  useQueryState,
} from 'nuqs';
import { useMemo } from 'react';

export const useListingFilters = (securityType: string) => {
  const { page, setPage, pageSize, setPageSize } = useTablePageParams(
    securityType,
    { pageSize: 10, page: 0 }
  );
  const [nameSearch, setNameSearch] = useQueryState(
    `${securityType}:name-search`,
    parseAsString
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault('')
  );
  const [tickerSearch, setTickerSearch] = useQueryState(
    `${securityType}:ticker-search`,
    parseAsString
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault('')
  );

  const [priceRange, setPriceRange] = useQueryState(
    `${securityType}:price-range`,
    parseAsArrayOf(parseAsInteger)
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault([-Infinity, Infinity])
  );

  const [volumeRange, setVolumeRange] = useQueryState(
    `${securityType}:volume-range`,
    parseAsArrayOf(parseAsInteger)
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault([-Infinity, Infinity])
  );

  const [bidRange, setBidRange] = useQueryState(
    `${securityType}:bid-range`,
    parseAsArrayOf(parseAsInteger)
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault([-Infinity, Infinity])
  );

  const [settlementDateRange, setSettlementDateRange] = useQueryState(
    `${securityType}:settlement-date-range`,
    parseAsArrayOf(parseAsIsoDate)
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault([])
  );

  const [sortBy, setSortBy] = useQueryState<ListingSortBy>(
    `${securityType}:sort-by`,
    {
      parse: (value: string | null): ListingSortBy => {
        const parsed = value || 'PRICE';
        return parsed === 'PRICE' || parsed === 'VOLUME'
          ? (parsed satisfies ListingSortBy)
          : 'PRICE';
      },
      defaultValue: 'PRICE',
    }
  );

  const [sortDirection, setSortDirection] = useQueryState<ListingSortDirection>(
    `${securityType}:sort-direction`,
    {
      parse: (value: string | null): ListingSortDirection => {
        const parsed = value || 'ASC';
        return parsed === 'ASC' || parsed === 'DESC'
          ? (parsed satisfies ListingSortDirection)
          : 'ASC';
      },
      defaultValue: 'ASC',
    }
  );

  const filters = useMemo(() => {
    const obj: GetListingsFilters = {};
    if (volumeRange.length === 2) {
      obj.volumeMin = volumeRange[0];
      obj.volumeMax = volumeRange[1];
    }
    if (priceRange.length === 2) {
      obj.askMin = priceRange[0];
      obj.askMax = priceRange[1];
    }
    if (bidRange.length === 2) {
      obj.bidMin = bidRange[0];
      obj.bidMax = bidRange[1];
    }
    if (settlementDateRange.length === 2) {
      obj.settlementDateFrom = settlementDateRange[0].toISOString();
      obj.settlementDateTo = settlementDateRange[1].toISOString();
    }
    obj.sortBy ??= sortBy;
    obj.sortDirection ??= sortDirection;
    obj.searchTicker = tickerSearch;
    obj.searchName = nameSearch;

    // remove `Infinity` values
    // return cleanObject(JSON.parse(JSON.stringify(obj)));
    return obj;
  }, [
    volumeRange,
    priceRange,
    tickerSearch,
    nameSearch,
    bidRange,
    settlementDateRange,
    sortDirection,
    sortBy,
  ]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    volumeRange,
    setVolumeRange,
    priceRange,
    setPriceRange,
    tickerSearch,
    setTickerSearch,
    nameSearch,
    setNameSearch,
    settlementDateRange,
    setSettlementDateRange,
    bidRange,
    setBidRange,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filters,
  };
};

export const ListingFilters = ({
  securityType,
  withSettlementDate = false,
}: {
  securityType: string;
  withSettlementDate?: boolean;
}) => {
  const {
    filters,
    page,
    setPage,
    volumeRange,
    setVolumeRange,
    priceRange,
    setPriceRange,
    tickerSearch,
    setTickerSearch,
    nameSearch,
    setNameSearch,
    settlementDateRange,
    setSettlementDateRange,
    bidRange,
    setBidRange,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  } = useListingFilters(securityType);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <FilterBar<GetListingsFilters, typeof listingFilterColumns>
      onSubmit={(filter) => {
        setPage(0);

        const setRange = (min, max, setRangeFunction) => {
          if (min != null && max != null) {
            setRangeFunction([min, max]);
          } else if (min != null) {
            setRangeFunction([min, Infinity]);
          } else if (max != null) {
            setRangeFunction([-Infinity, max]);
          } else {
            setRangeFunction([-Infinity, Infinity]);
          }
        };

        setRange(filter.askMin, filter.askMax, setPriceRange);
        setRange(filter.volumeMin, filter.volumeMax, setVolumeRange);
        setRange(filter.bidMin, filter.bidMax, setBidRange);

        setNameSearch(filter.searchName ?? '');
        setTickerSearch(filter.searchTicker ?? '');

        if (filter.settlementDateFrom && filter.settlementDateTo) {
          setSettlementDateRange([
            new Date(filter.settlementDateFrom),
            new Date(filter.settlementDateTo),
          ]);
        } else {
          setSettlementDateRange([]);
        }

        setSortBy(filter.sortBy);
        setSortDirection(filter.sortDirection);
      }}
      filter={filters}
      columns={
        (withSettlementDate && {
          ...listingFilterColumns,
          settlementDateFrom: {
            filterType: 'timestamp',
            placeholder: 'Settlement date from',
          },
          settlementDateTo: {
            filterType: 'timestamp',
            placeholder: 'Settlement date to',
          },
        }) ||
        listingFilterColumns
      }
    />
  );
};
