import { ColumnDef } from '@tanstack/react-table';
import { ListingInfoDto } from '@/api/response/listing';
import { GetListingsFilters } from '@/api/request/listing';
import { FilterDefinition } from '@/components/filters/FilterBar';
import { ALL_SECURITY_TYPES } from '@/types/securities';
import {
  ALL_SORT_BY_LISTINGS,
  ALL_SORT_DIRECTION_LISTINGS,
} from '@/types/listings';

export const listingFilterColumns: Partial<
  Record<keyof GetListingsFilters, FilterDefinition>
> = {
  //   securityType: {
  //     filterType: 'enum',
  //     placeholder: 'Enter security type',
  //     options: ALL_SECURITY_TYPES,
  //   },
  searchName: {
    filterType: 'string',
    placeholder: 'Enter name',
  },
  searchTicker: {
    filterType: 'string',
    placeholder: 'Enter ticker',
  },
  askMin: {
    filterType: 'number',
    placeholder: 'Enter price min',
  },
  askMax: {
    filterType: 'number',
    placeholder: 'Enter price max',
  },
  volumeMin: {
    filterType: 'number',
    placeholder: 'Enter volume min',
  },
  volumeMax: {
    filterType: 'number',
    placeholder: 'Enter volume max',
  },
  bidMin: {
    filterType: 'number',
    placeholder: 'Enter bid min',
  },
  bidMax: {
    filterType: 'number',
    placeholder: 'Enter bid max',
  },
  sortBy: {
    filterType: 'enum',
    placeholder: 'Sort by column',
    options: ALL_SORT_BY_LISTINGS,
  },
  sortDirection: {
    filterType: 'enum',
    placeholder: 'Sort direction',
    options: ALL_SORT_DIRECTION_LISTINGS,
  },
};

export const listingColumns: ColumnDef<ListingInfoDto>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'ticker',
    header: 'Ticker',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
    cell: (info) => (info.getValue() as number).toFixed(2),
    enableSorting: true,
  },
  {
    accessorKey: 'change',
    header: 'Change',
    cell: (info) => (info.getValue() as number).toFixed(2),
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (info) => (info.getValue() as number).toFixed(2),
    enableSorting: true,
  },
];
