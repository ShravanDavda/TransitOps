import React from 'react';
import EmptyState from './EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends { id: string | number }>({
  columns,
  rows,
  emptyTitle,
  emptyDescription,
  onRowClick
}: DataTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No items to display'}
        description={emptyDescription || 'No items match your search criteria or are available in the system yet.'}
      />
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-150 overflow-hidden shadow-2xs">
      {/* Scrollable Container with horizontal support */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 group
                  ${onRowClick ? 'hover:bg-slate-50/70 cursor-pointer' : 'hover:bg-slate-50/40'}
                `}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-5 py-4 text-sm text-slate-700 font-sans tracking-wide ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : col.accessor
                        ? String((row as any)[col.accessor])
                        : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
