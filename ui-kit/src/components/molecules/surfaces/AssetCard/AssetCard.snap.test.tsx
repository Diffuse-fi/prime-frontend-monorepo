import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { AssetCard, type AssetCardProps } from "./AssetCard";

describe("<AssetCard />", () => {
  const renderImage: AssetCardProps["renderImage"] = ({ alt, className }) => (
    <img alt={alt} className={className} data-testid="token-img" />
  );

  it("renders the symbol text", () => {
    const { asFragment } = render(<AssetCard renderImage={renderImage} symbol="USDC" />);

    expect(asFragment()).toMatchSnapshot();

    expect(screen.getByText("USDC")).toBeInTheDocument();
  });
});
