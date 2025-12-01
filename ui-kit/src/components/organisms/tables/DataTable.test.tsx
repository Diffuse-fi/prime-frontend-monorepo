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

  it("toggles sorting when clicking on a sortable header and updates aria-sort + row order", async () => {
    const user = userEvent.setup();

    render(<DataTable<Row> columns={columns} data={data} />);

    const table = screen.getByRole("table");
    const headerRow = within(table).getAllByRole("row")[0];
    const aprHeader = within(headerRow).getByRole("columnheader", { name: "APR" });

    expect(aprHeader).toHaveAttribute("aria-sort", "none");

    const getBodyRows = () => {
      const tbody = within(table).getAllByRole("rowgroup")[1];
      return within(tbody).getAllByRole("row");
    };

    await user.click(aprHeader);
    expect(aprHeader).toHaveAttribute("aria-sort", "descending");
    let rows = getBodyRows();
    expect(within(rows[0]).getByText("BTC")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ETH")).toBeInTheDocument();
    expect(within(rows[2]).getByText("USDC")).toBeInTheDocument();

    await user.click(aprHeader);
    expect(aprHeader).toHaveAttribute("aria-sort", "ascending");
    rows = getBodyRows();
    expect(within(rows[0]).getByText("USDC")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ETH")).toBeInTheDocument();
    expect(within(rows[2]).getByText("BTC")).toBeInTheDocument();
  });

  it("calls onRowClick with the correct row after sorting has been applied", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable<Row>
        columns={columns}
        data={data}
        initialSorting={[{ id: "apr", desc: true }]}
        onRowClick={onRowClick}
      />
    );

    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");

    await user.click(rows[0]);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ asset: "BTC", apr: 0.06 })
    );
  });
});
