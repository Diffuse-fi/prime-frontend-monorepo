import * as React from "react";
import { cn } from "@/lib/cn";
import { table, td, th, tr } from "./styles";
import { VariantProps } from "tailwind-variants";

export interface SimpleTableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof table> {
  rows: React.ReactNode[][];
  columns: React.ReactNode[];
}

export const SimpleTable = React.forwardRef<HTMLTableElement, SimpleTableProps>(
  function SimpleTable({ rows, columns, className, density, ...rest }, ref) {
    return (
      <table ref={ref} className={cn(table({ density }), className)} {...rest}>
        <thead>
          <tr>
            {columns.map((h, i) => (
              <th key={i} scope="col" className={th()}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rIdx) => (
            <tr key={rIdx} className={tr()}>
              {cells.map((cell, cIdx) => (
                <td key={cIdx} className={td()}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

SimpleTable.displayName = "SimpleTable";
