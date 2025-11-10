import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { vi, describe } from "vitest";
import { Dialog } from "./Dialog";

describe("<Dialog />", () => {
  it("renders open dialog with title, description, children and applies size variant", () => {
    render(
      <Dialog open size="sm" title="Title" description="Desc">
        <div>Body</div>
      </Dialog>
    );

    const dlg = screen.getByRole("dialog");
    expect(dlg).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();

    expect(dlg).toHaveClass("max-w-xl");
  });

  it("uncontrolled: trigger opens and close button closes", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<button>Open</button>} title="Hello" description="World">
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
        trigger={<button>Open</button>}
        open={false}
        onOpenChange={onOpenChange}
        title="Title"
        description="Desc"
      />
    );

    await user.click(screen.getByText("Open"));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Dialog
        trigger={<button>Open</button>}
        open
        onOpenChange={onOpenChange}
        title="Title"
        description="Desc"
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
