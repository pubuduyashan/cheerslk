import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const pagination = useMemo(() => ({ pageIndex: 0, pageSize }), [pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    initialState: { pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full max-w-sm rounded-lg border border-dark-600 bg-dark-900 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-dark-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-dark-700/50 text-xs uppercase text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium cursor-pointer select-none hover:text-white transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ^',
                        desc: ' v',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-dark-700">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`bg-dark-800 hover:bg-dark-700/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-dark-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-dark-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
