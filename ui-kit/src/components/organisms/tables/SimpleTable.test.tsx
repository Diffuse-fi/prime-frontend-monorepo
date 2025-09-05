import React from "react";
import { render, screen, within } from "@testing-library/react";
import { SimpleTable } from "./SimpleTable";
import { describe, it, expect } from "vitest";

describe("<SimpleTable />", () => {
  it("renders caption and rows with proper semantics", () => {
    render(
      <SimpleTable
        columns={["Chain", "Address"]}
        rows={[
          ["Ethereum", "0x1234...abcd"],
          ["Solana", "3f5g6h7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b"],
        ]}
      />
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const [, tbody] = within(table).getAllByRole("rowgroup");
    const rows = within(tbody).getAllByRole("row");

    expect(rows).toHaveLength(2);

    const firstRow = rows[0];
    const td = within(firstRow).getByText("Ethereum");
    expect(td.tagName).toBe("TD");
  });

  it("merges className and forwards ref to <table>", () => {
    const ref = React.createRef<HTMLTableElement>();
    render(<SimpleTable ref={ref} className="extra" rows={[[]]} columns={[]} />);

    const table = screen.getByRole("table");

    expect(table).toHaveClass("w-full");
    expect(table).toHaveClass("extra");
    expect(ref.current).toBe(table);
  });
});
