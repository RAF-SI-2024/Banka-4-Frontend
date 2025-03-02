'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
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
import { TableHeader } from '@/components/ui/table';
import { Pagination } from '../ui/pagination';
import PaginationWrapper from '@/components/ui/pagination-wrapper';

interface DataTableProps<TData> {
  isLoading: boolean;
  columns: ColumnDef<TData>[];
  data: TData[] | null;
  pagination: { page: number; pageSize: number };
  onPaginationChange: (pagination: { page: number; pageSize: number }) => void;
  totalRowCount: number;
  selectable?: boolean;
  onRowClick?: (row: Row<TData>) => void;

  //  sort: SortProperty[];
  //  onSortChange: (sort: SortProperty[]) => void;

  onCreateButtonClick?: () => void;
  onExportButtonClick?: () => void;

  //   columnOrder: string[];
  // onColumnOrderChange: (columnOrder: string[]) => void;
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
  totalRowCount,
  // sort,
  // onSortChange,
  selectable,

  onCreateButtonClick,
  onExportButtonClick,
  //  onColumnOrderChange,
  //     columnOrder
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
      //   columnOrder: columnOrder,
    },
    enableMultiSort: true,
    maxMultiSortColCount: 5,
    enableSorting: true,
    manualSorting: true,

    manualPagination: true,
    rowCount: totalRowCount,

    enableRowSelection: selectable ?? false,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // Different behavior from onPaginatioChange.. weird
    //         onColumnOrderChange: (newState) => {
    //             // make sure updater is callable (to avoid typescript warning)
    // //console.log(updater);
    //             // const newColumnOrder = updater(table.getState().columnOrder);
    //             //  console.log(newColumnOrder);
    //             onColumnOrderChange(newState as string[]);
    //         },

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
      console.log(newFilters);
      // onPaginationChange({page: newPagination.pageIndex, pageSize: newPagination.pageSize});
    },
  });

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-y border-gray-200 dark:border-gray-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap py-1 text-sm sm:text-xs'
                        // header.column.columnDef.meta?.className,
                      )}
                    >
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
                    onClick={onRowClick != null ? () => onRowClick(row) : undefined}
                    className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          row.getIsSelected()
                            ? 'bg-gray-50 dark:bg-gray-900'
                            : '',
                          'relative whitespace-nowrap py-1 text-gray-600 first:w-10 dark:text-gray-400'
                          // cell.column.columnDef.meta?.className,
                        )}
                      >
                        {index === 0 && row.getIsSelected() && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-indigo-500" />
                        )}
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
        <div className="flex items-center justify-end pt-6">
          <PaginationWrapper
            currentPage={pagination.page + 1} // Convert from 0-index to 1-index
            totalPages={Math.ceil(totalRowCount / pagination.pageSize)}
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
