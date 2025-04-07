import { ColumnDef } from '@tanstack/react-table';
import { ListingInfoDto } from '@/api/response/listing';
import { GetListingsFilters } from '@/api/request/listing';
import { FilterDefinition } from '@/components/filters/FilterBar';
import { ALL_SECURITY_TYPES } from '@/types/securities';

export const listingFilterColumns: Record<
  keyof GetListingsFilters,
  FilterDefinition
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
  priceMin: {
    filterType: 'number',
    placeholder: 'Enter price min',
  },
  priceMax: {
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
