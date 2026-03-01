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

    const { asFragment } = render(
      <AssetInput
        aria-label="Amount"
        assetSymbol="USDC"
        renderAssetImage={renderAssetImage}
        size="md"
      />
    );

    expect(asFragment()).toMatchSnapshot();

    expect(renderAssetImage).toHaveBeenCalledWith({ size: "md" });
    expect(screen.getByText("IMG-md")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });
});
