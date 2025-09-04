import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TokenInput } from "./TokenInput";

const getWrapper = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe("<TokenInput /> (with tokenSymbol + default token circle)", () => {
  it("renders input and tokenSymbol text", () => {
    render(<TokenInput placeholder="amount" tokenSymbol="USDC" />);

    expect(screen.getByPlaceholderText("amount")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("renders default token circle when renderTokenImage is not provided", () => {
    const { container } = render(<TokenInput tokenSymbol="ETH" />);
    const circle = container.querySelector(".rounded-full");

    expect(circle).toBeInTheDocument();
  });

  it("renders custom token via renderTokenImage and passes size", () => {
    const renderTokenImage = vi.fn(({ size }: { size: "sm" | "md" | "lg" }) => (
      <span data-testid="token">{size}</span>
    ));

    render(
      <TokenInput
        tokenSymbol="ARB"
        size="lg"
        renderTokenImage={renderTokenImage}
        placeholder="amt"
      />
    );

    const token = screen.getByTestId("token");

    expect(token).toBeInTheDocument();
    expect(token).toHaveTextContent("lg");
    expect(renderTokenImage).toHaveBeenCalledTimes(1);
    expect(renderTokenImage).toHaveBeenCalledWith({ size: "lg" });
    expect(screen.getByPlaceholderText("amt")).toBeInTheDocument();
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TokenInput ref={ref} tokenSymbol="SOL" placeholder="ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    ref.current!.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it("propagates size changes to renderTokenImage", () => {
    const renderTokenImage = vi.fn(({ size }: { size: "sm" | "md" | "lg" }) => (
      <span data-testid="token">{size}</span>
    ));

    const { rerender } = render(
      <TokenInput tokenSymbol="BTC" size="sm" renderTokenImage={renderTokenImage} />
    );

    expect(renderTokenImage).toHaveBeenLastCalledWith({ size: "sm" });

    rerender(
      <TokenInput tokenSymbol="BTC" size="md" renderTokenImage={renderTokenImage} />
    );

    expect(renderTokenImage).toHaveBeenLastCalledWith({ size: "md" });

    rerender(
      <TokenInput tokenSymbol="BTC" size="lg" renderTokenImage={renderTokenImage} />
    );

    expect(renderTokenImage).toHaveBeenLastCalledWith({ size: "lg" });
  });

  it("passes common input props through (value/onValueChange, disabled, wrapperClassName)", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <TokenInput
        tokenSymbol="USDT"
        value="1"
        disabled
        wrapperClassName="WRAPPER_CHECK"
        placeholder="p"
      />
    );

    const input = screen.getByPlaceholderText("p") as HTMLInputElement;

    expect(input.value).toBe("1.00"); // because of fixed decimalScale=2
    expect(input).toBeDisabled();

    const wrapper = getWrapper(container);

    expect(wrapper.className).toContain("WRAPPER_CHECK");
  });
});
