import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "./Navbar";

describe("<Navbar />", () => {
  it("renders logo, navigation, wallet and merges classes", () => {
    render(
      <Navbar
        data-testid="nav"
        className="custom-class"
        logo={<span>Logo</span>}
        navigation={
          <nav aria-label="site">
            <a>Home</a>
          </nav>
        }
        wallet={<button>Connect</button>}
      />
    );

    const nav = screen.getByTestId("nav");

    expect(nav).toHaveClass("custom-class");
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "site" })).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("forwards ref to <nav> and passes through attributes", () => {
    const ref = React.createRef<HTMLElement>();

    render(<Navbar ref={ref} aria-label="main" />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
    expect(ref.current).toHaveAttribute("aria-label", "main");
  });
});
