import * as React from "react";
import { cn } from "@/lib/cn";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp } from "lucide-react";
import { VariantProps } from "@/lib";
import { table, td, th, tr } from "./styles";

export type DataTableProps<TData extends object> =
  React.TableHTMLAttributes<HTMLTableElement> &
    Partial<VariantProps<typeof table>> & {
      columns: Array<ColumnDef<TData>>;
      data: TData[];
      initialSorting?: SortingState;
      onRowClick?: (row: TData) => void;
    };

function DataTableInner<TData extends object>(
  {
    columns,
    data,
    className,
    density,
    initialSorting,
    onRowClick,
    ...rest
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting ?? []);

  const { getRowModel, getHeaderGroups } = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table ref={ref} className={cn(table({ density }), className)} {...rest}>
      <thead>
        {getHeaderGroups().map(hg => (
          <tr key={hg.id}>
            {hg.headers.map(header => {
              if (header.isPlaceholder) return <th key={header.id} />;
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted();

              return (
                <th
                  key={header.id}
                  className={cn(th(), canSort && "cursor-pointer")}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : "none"
                  }
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
            key={r.id}
            className={tr()}
            onClick={onRowClick ? () => onRowClick(r.original) : undefined}
          >
            {r.getVisibleCells().map(c => {
              return (
                <td key={c.id} className={td()}>
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
