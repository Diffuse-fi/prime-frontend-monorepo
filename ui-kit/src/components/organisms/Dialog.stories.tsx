import type { Story } from "@ladle/react";
import { Dialog } from "./Dialog";
import { Button } from "@/atoms";
import { useState } from "react";

export const Default: Story = () => (
  <Dialog title="Dialog Title" trigger={<Button>Open Dialog</Button>}>
    <p className="text-body">This is the dialog content.</p>
  </Dialog>
);

export const WithDescription: Story = () => (
  <Dialog
    title="Confirm Action"
    description="This action cannot be undone. Please confirm you want to proceed."
    trigger={<Button>Open Dialog</Button>}
  >
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </Dialog>
);

export const Sizes: Story = () => (
  <div className="flex gap-4">
    <Dialog title="Small Dialog" size="sm" trigger={<Button size="sm">Small</Button>}>
      <p className="text-body">Small dialog content</p>
    </Dialog>
    <Dialog title="Medium Dialog" size="md" trigger={<Button size="sm">Medium</Button>}>
      <p className="text-body">Medium dialog content</p>
    </Dialog>
    <Dialog title="Large Dialog" size="lg" trigger={<Button size="sm">Large</Button>}>
      <p className="text-body">Large dialog content</p>
    </Dialog>
  </div>
);

export const Controlled: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Dialog
        title="Controlled Dialog"
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Open</Button>}
      >
        <p className="text-body">This dialog is controlled from outside.</p>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
      <p className="text-sm text-muted">Dialog is: {open ? "open" : "closed"}</p>
    </div>
  );
};

export const WithForm: Story = () => (
  <Dialog title="User Information" trigger={<Button>Fill Form</Button>}>
    <form className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded bg-bg"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-border rounded bg-bg"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" type="button">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </Dialog>
);

export const LongContent: Story = () => (
  <Dialog title="Terms and Conditions" trigger={<Button>View Terms</Button>}>
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <p className="text-body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
      <p className="text-body">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </p>
      <p className="text-body">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur.
      </p>
      <p className="text-body">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  </Dialog>
);
