import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const wrapper = tv({
  base: "relative w-full overflow-x-auto rounded-lg border border-border bg-bg",
});

const table = tv({
  base: "w-full border-collapse text-sm text-text-primary",
  variants: {
    size: {
      sm: "[&_:where(th,td)]:px-3 [&_:where(th,td)]:py-2 text-xs",
      md: "[&_:where(th,td)]:px-4 [&_:where(th,td)]:py-3 text-sm",
      lg: "[&_:where(th,td)]:px-5 [&_:where(th,td)]:py-4 text-base",
    },
  },
  defaultVariants: { size: "md" },
});

const thead = tv({
  base: "bg-bg",
  variants: {
    sticky: { true: "[&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-10 [&>tr>th]:bg-bg" },
    bordered: { true: "[&>tr>th]:border-b [&>tr>th]:border-border" },
  },
  defaultVariants: { bordered: true },
});

const tbody = tv({
  variants: {
    striped: { true: "[&>tr:nth-child(even)]:bg-[color:var(--ui-bg-muted)]/40" },
    hover: { true: "[&>tr:hover]:bg-[color:var(--ui-bg-muted)]/60" },
    bordered: { true: "[&>tr>td]:border-b [&>tr>td]:border-border" },
  },
  defaultVariants: { hover: true, bordered: true },
});

const tr = tv({
  base: "",
  variants: {
    clickable: { true: "cursor-pointer transition-colors" },
    selected: { true: "bg-[color:var(--ui-primary)]/10" },
  },
});

const th = tv({
  base: "text-left font-semibold text-text-primary whitespace-nowrap",
  variants: {
    align: { left: "text-left", center: "text-center", right: "text-right" },
  },
  defaultVariants: { align: "left" },
});

const td = tv({
  base: "align-middle",
  variants: {
    align: { left: "text-left", center: "text-center", right: "text-right" },
    numeric: { true: "text-right tabular-nums" },
    truncate: { true: "max-w-[1px] truncate" },
  },
  defaultVariants: { align: "left" },
});

/* ---------- API ---------- */

export interface TableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof table> {}

const TableRoot = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, size, ...rest }, ref) => (
    <div ref={ref} className={cn(wrapper(), className)} {...rest}>
      <table className={table({ size })}>{children}</table>
    </div>
  )
);
TableRoot.displayName = "Table";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof thead> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky, bordered, ...rest }, ref) => (
    <thead ref={ref} className={cn(thead({ sticky, bordered }), className)} {...rest} />
  )
);
TableHeader.displayName = "Table.Header";

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tbody> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, striped, hover, bordered, ...rest }, ref) => (
    <tbody
      ref={ref}
      className={cn(tbody({ striped, hover, bordered }), className)}
      {...rest}
    />
  )
);
TableBody.displayName = "Table.Body";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tr> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, clickable, selected, ...rest }, ref) => (
    <tr ref={ref} className={cn(tr({ clickable, selected }), className)} {...rest} />
  )
);
TableRow.displayName = "Table.Row";

export interface TableHeadCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof th> {}

const TableHeadCell = React.forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ className, align, scope = "col", ...rest }, ref) => (
    <th ref={ref} scope={scope} className={cn(th({ align }), className)} {...rest} />
  )
);
TableHeadCell.displayName = "Table.HeadCell";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof td> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, numeric, truncate, ...rest }, ref) => (
    <td ref={ref} className={cn(td({ align, numeric, truncate }), className)} {...rest} />
  )
);
TableCell.displayName = "Table.Cell";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...rest }, ref) => (
    <caption
      ref={ref}
      className={cn("caption-bottom text-xs text-[color:var(--ui-muted)]", className)}
      {...rest}
    />
  )
);
TableCaption.displayName = "Table.Caption";

/* Export as a namespaced object */
export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Caption: TableCaption,
});
