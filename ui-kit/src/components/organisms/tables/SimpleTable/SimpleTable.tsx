import * as React from "react";
import { VariantProps } from "tailwind-variants";

import { cn } from "@/lib/cn";

import { table, td, th, tr } from "../styles";

export interface SimpleTableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof table> {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
}

export const SimpleTable = React.forwardRef<HTMLTableElement, SimpleTableProps>(
  function SimpleTable({ className, columns, density, rows, ...rest }, ref) {
    return (
      <table className={cn(table({ density }), className)} ref={ref} {...rest}>
        <thead>
          <tr>
            {columns.map((h, i) => (
              <th className={th()} key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rIdx) => (
            <tr className={tr()} key={rIdx}>
              {cells.map((cell, cIdx) => (
                <td className={td()} key={cIdx}>
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
