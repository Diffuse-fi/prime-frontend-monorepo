import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { describe, vi } from "vitest";

import { Dialog } from "./Dialog";

describe("<Dialog />", () => {
  it("renders open dialog with title, description, children and applies size variant", () => {
    const { asFragment } = render(
      <Dialog description="Desc" open size="sm" title="Title">
        <div>Body</div>
      </Dialog>
    );

    expect(asFragment()).toMatchSnapshot();

    const dlg = screen.getByRole("dialog");
    expect(dlg).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();

    expect(dlg).toHaveClass("fixed z-100");
  });

  it("uncontrolled: trigger opens and close button closes", async () => {
    const user = userEvent.setup();
    render(
      <Dialog description="World" title="Hello" trigger={<button>Open</button>}>
        <div>Content</div>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("controlled: onOpenChange fires on trigger and close", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Dialog
        description="Desc"
        onOpenChange={onOpenChange}
        open={false}
        title="Title"
        trigger={<button>Open</button>}
      />
    );

    await user.click(screen.getByText("Open"));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Dialog
        description="Desc"
        onOpenChange={onOpenChange}
        open
        title="Title"
        trigger={<button>Open</button>}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
