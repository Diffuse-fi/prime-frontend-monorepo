import { render, screen, within } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

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
});
