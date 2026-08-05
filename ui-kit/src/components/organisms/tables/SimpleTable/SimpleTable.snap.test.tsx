import { render, screen, within } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { SimpleTable } from "./SimpleTable";

describe("<SimpleTable />", () => {
  it("renders caption and rows with proper semantics", () => {
    const { asFragment } = render(
      <SimpleTable
        columns={["Chain", "Address"]}
        rows={[
          ["Ethereum", "0x1234...abcd"],
          ["Solana", "3f5g6h7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b"],
        ]}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const [, tbody] = within(table).getAllByRole("rowgroup");
    const rows = within(tbody).getAllByRole("row");

    expect(rows).toHaveLength(2);

    const firstRow = rows[0];
    const td = within(firstRow).getByText("Ethereum");
    expect(td.tagName).toBe("TD");
  });
});
