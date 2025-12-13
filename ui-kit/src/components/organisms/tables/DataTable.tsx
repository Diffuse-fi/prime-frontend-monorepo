import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp } from "lucide-react";
import * as React from "react";

import { VariantProps } from "@/lib";
import { cn } from "@/lib/cn";

import { table, td, th, tr } from "./styles";

export type DataTableProps<TData extends object> = Partial<VariantProps<typeof table>> &
  React.TableHTMLAttributes<HTMLTableElement> & {
    columns: Array<ColumnDef<TData>>;
    data: TData[];
    initialSorting?: SortingState;
    onRowClick?: (row: TData) => void;
  };

function DataTableInner<TData extends object>(
  {
    className,
    columns,
    data,
    density,
    initialSorting,
    onRowClick,
    ...rest
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting ?? []);

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <table className={cn(table({ density }), className)} ref={ref} {...rest}>
      <thead>
        {getHeaderGroups().map(hg => (
          <tr key={hg.id}>
            {hg.headers.map(header => {
              if (header.isPlaceholder) return <th key={header.id} />;
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();

              return (
                <th
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : "none"
                  }
                  className={cn(th(), canSort && "cursor-pointer")}
                  key={header.id}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  scope="col"
                >
                  <p className="inline-flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort ? (
                      <ChevronUp
                        aria-hidden="true"
                        className={cn(
                          "h-3.5 w-3.5 opacity-60 transition-transform",
                          sorted === "asc" && "text-primary rotate-0 opacity-100",
                          sorted === "desc" && "text-primary rotate-180 opacity-100",
                          sorted === false && "opacity-0"
                        )}
                      />
                    ) : null}
                  </p>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {getRowModel().rows.map(r => (
          <tr
            className={tr()}
            key={r.id}
            onClick={onRowClick ? () => onRowClick(r.original) : undefined}
          >
            {r.getVisibleCells().map(c => {
              return (
                <td className={td()} key={c.id}>
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <TData extends object>(
  props: DataTableProps<TData> & { ref?: React.Ref<HTMLTableElement> }
) => React.ReactElement;

(DataTable as unknown as React.FC).displayName = "DataTable";
