import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InputProps } from "@/components/atoms";

vi.mock("@/atoms", () => ({
  Input: (props: InputProps) => {
    const { right, size: _, ...rest } = props;
    return (
      <div>
        <input {...rest} />
        {right}
      </div>
    );
  },
}));

import { AssetInput } from "./AssetInput";

describe("<AssetInput />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders right adornment with asset image & symbol and passes size to image renderer", () => {
    const renderAssetImage = vi.fn(({ size }: { size: "lg" | "md" | "sm" }) => (
      <span>IMG-{size}</span>
    ));

    render(
      <AssetInput
        aria-label="Amount"
        assetSymbol="USDC"
        renderAssetImage={renderAssetImage}
        size="md"
      />
    );

    expect(renderAssetImage).toHaveBeenCalledWith({ size: "md" });
    expect(screen.getByText("IMG-md")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("formats typed value with thousand separators and fixed 2 decimals, calls onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<AssetInput aria-label="Amount" onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "Amount" });

    await user.type(input, "12345.6");

    expect(input).toHaveValue("12 345.60");

    const lastCall = onValueChange.mock.calls.at(-1)?.[0];
    expect(lastCall?.value).toBe("12345.60");
    expect(lastCall?.floatValue).toBe(12_345.6);
  });

  it("disallows negative in input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<AssetInput aria-label="Amount" onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "Amount" });

    await user.type(input, "-2");

    expect(input).toHaveValue("2.00");

    const lastCall = onValueChange.mock.calls.at(-1)?.[0];
    expect(lastCall?.value).toBe("2.00");
    expect(lastCall?.floatValue).toBe(2);
  });
});
