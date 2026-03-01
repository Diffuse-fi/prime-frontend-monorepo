import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";

type Row = { apr: number; asset: string; tvl: number };

const columns = [
  { accessorKey: "asset", header: "Asset" },
  { accessorKey: "apr", header: "APR", meta: { numeric: true } },
  { accessorKey: "tvl", header: "TVL", meta: { numeric: true } },
];

const data: Row[] = [
  { apr: 0.042, asset: "ETH", tvl: 12_300_000 },
  { apr: 0.018, asset: "USDC", tvl: 5_400_000 },
  { apr: 0.06, asset: "BTC", tvl: 20_000_000 },
];

describe("<DataTable />", () => {
  it("renders headers/rows and applies initialSorting (desc by APR)", () => {
    const { asFragment } = render(
      <DataTable<Row>
        columns={columns}
        data={data}
        initialSorting={[{ desc: true, id: "apr" }]}
      />
    );

    expect(asFragment()).toMatchSnapshot();

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
      <DataTable<Row> columns={columns} data={data} onRowClick={onRowClick} ref={ref} />
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
        initialSorting={[{ desc: true, id: "apr" }]}
        onRowClick={onRowClick}
      />
    );

    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");

    await user.click(rows[0]);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ apr: 0.06, asset: "BTC" })
    );
  });
});
