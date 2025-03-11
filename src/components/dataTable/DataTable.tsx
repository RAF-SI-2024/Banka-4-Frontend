'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface DataTableProps<TData> {
  isLoading: boolean;
  columns: ColumnDef<TData>[];
  data: TData[] | null;
  pagination: { page: number; pageSize: number };
  onPaginationChange: (pagination: { page: number; pageSize: number }) => void;
  pageCount: number;
  onRowClick?: (row: Row<TData>) => void;

  //  sort: SortProperty[];
  //  onSortChange: (sort: SortProperty[]) => void;
}

const ColumnSkeleton = () => (
  <div className="h-[14px] my-[8px] bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
);

export function DataTable<TData>({
  isLoading,
  columns,
  data,
  pagination,
  onPaginationChange,
  onRowClick,
  pageCount,
  // sort,
  // onSortChange,
}: DataTableProps<TData>) {
  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <ColumnSkeleton />,
          }))
        : columns,
    [isLoading, columns]
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: data ?? Array(pagination.pageSize).fill({}),
    columns: tableColumns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
      },
      // sorting: sort.map((x) => ({ id: x.id, desc: x.order == 'DESC' })),
      columnFilters: [],
    },

    enableSorting: true,
    manualSorting: true,

    manualPagination: true,
    pageCount: pageCount,

    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onSortingChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== 'function') return;
      // TODO:
      //const newSorting = updater(table.getState().sorting);
      // onSortChange(
      //    newSorting.map((x) => ({ id: x.id, order: x.desc ? 'DESC' : 'ASC' }))
      //  );
    },

    onPaginationChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== 'function') return;
      const newPagination = updater(table.getState().pagination);
      onPaginationChange({
        page: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },

    onColumnFiltersChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== 'function') return;
      const newFilters = updater(table.getState().columnFilters);
    },
  });

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={
                      onRowClick != null ? () => onRowClick(row) : undefined
                    }
                    className={'cursor-pointer'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="pt-6">
          <PaginationWrapper
            currentPage={pagination.page + 1} // Convert from 0-index to 1-index
            totalPages={pageCount}
            onPageChange={(page) => {
              // Convert back from 1-index to 0-index
              onPaginationChange({
                page: page - 1,
                pageSize: pagination.pageSize,
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
