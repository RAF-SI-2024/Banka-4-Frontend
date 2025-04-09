'use client';
import { GetListingsFilters } from '@/api/request/listing';
import FilterBar from '@/components/filters/FilterBar';
import useTablePageParams from '@/hooks/useTablePageParams';
import { listingFilterColumns } from '@/ui/dataTables/listings/listingColumns';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs';
import { useMemo } from 'react';

export const useListingFilters = (securityType: string) => {
  const { page, setPage, pageSize, setPageSize } =
    useTablePageParams(securityType);
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
      .withDefault([])
  );

  const [volumeRange, setVolumeRange] = useQueryState(
    `${securityType}:volume-range`,
    parseAsArrayOf(parseAsInteger)
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault([])
  );

  const filters = useMemo(() => {
    const obj: GetListingsFilters = {};
    if (volumeRange.length === 2) {
      obj.volumeMin = volumeRange[0];
      obj.volumeMax = volumeRange[1];
    }
    if (priceRange.length === 2) {
      obj.priceMin = priceRange[0];
      obj.priceMax = priceRange[1];
    }
    obj.searchTicker = tickerSearch;
    obj.searchName = nameSearch;
    return obj;
  }, [volumeRange, priceRange, tickerSearch, nameSearch]);

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
  } = useListingFilters(securityType);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <FilterBar<GetListingsFilters, typeof listingFilterColumns>
      onSubmit={(filter) => {
        setPage(0);
        if (filter.priceMin && filter.priceMax) {
          setPriceRange([filter.priceMin, filter.priceMax]);
        }
        if (filter.volumeMin && filter.volumeMax) {
          setVolumeRange([filter.volumeMin, filter.volumeMax]);
        }
        setNameSearch(filter.searchName ?? '');
        setTickerSearch(filter.searchTicker ?? '');
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
