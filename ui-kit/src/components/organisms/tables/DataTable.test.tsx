import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import { describe, it, expect, vi } from "vitest";

type Row = { asset: string; apr: number; tvl: number };

const columns = [
  { accessorKey: "asset", header: "Asset" },
  { accessorKey: "apr", header: "APR", meta: { numeric: true } },
  { accessorKey: "tvl", header: "TVL", meta: { numeric: true } },
];

const data: Row[] = [
  { asset: "ETH", apr: 0.042, tvl: 12_300_000 },
  { asset: "USDC", apr: 0.018, tvl: 5_400_000 },
  { asset: "BTC", apr: 0.06, tvl: 20_000_000 },
];

describe("<DataTable />", () => {
  it("renders headers/rows and applies initialSorting (desc by APR)", () => {
    render(
      <DataTable<Row>
        columns={columns}
        data={data}
        initialSorting={[{ id: "apr", desc: true }]}
      />
    );

    const table = screen.getByRole("table");
    const headerRow = within(table).getAllByRole("row")[0];

    expect(
      within(headerRow).getByRole("columnheader", { name: "Asset" })
    ).toBeInTheDocument();
    expect(within(headerRow).getByRole("columnheader", { name: "APR" })).toHaveAttribute(
      "aria-sort",
      "descending"
    );

    const tbody = within(table).getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");

    expect(within(rows[0]).getByText("BTC")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ETH")).toBeInTheDocument();
    expect(within(rows[2]).getByText("USDC")).toBeInTheDocument();
  });

  it("forwards ref to the underlying <table> and fires onRowClick", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLTableElement>();
    const onRowClick = vi.fn();

    render(
      <DataTable<Row> ref={ref} columns={columns} data={data} onRowClick={onRowClick} />
    );

    const table = screen.getByRole("table");

    expect(ref.current).toBe(table);

    const tbody = screen.getAllByRole("rowgroup")[1];
    const firstRow = within(tbody).getAllByRole("row")[0];

    await user.click(firstRow);

    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
