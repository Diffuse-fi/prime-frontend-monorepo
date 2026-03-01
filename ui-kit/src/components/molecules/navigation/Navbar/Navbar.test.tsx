import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { Navbar } from "./Navbar";

describe("<Navbar />", () => {
  it("renders logo, navigation, wallet and merges classes", () => {
    const { asFragment } = render(
      <Navbar
        className="custom-class"
        data-testid="header"
        logo={<span>Logo</span>}
        navigation={
          <nav aria-label="site">
            <a>Home</a>
          </nav>
        }
        wallet={<button>Connect</button>}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const nav = screen.getByTestId("header");

    expect(nav).toHaveClass("custom-class");
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "site" })).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("forwards ref to <nav> and passes through attributes", () => {
    const ref = React.createRef<HTMLElement>();

    render(<Navbar aria-label="main" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("HEADER");
    expect(ref.current).toHaveAttribute("aria-label", "main");
  });
});
