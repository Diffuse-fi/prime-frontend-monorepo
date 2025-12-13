import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { Button } from "@/atoms";

import { Dialog } from "./Dialog";

export default {
  title: "Organisms/Dialog",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Dialog title="Dialog Title" trigger={<Button>Open Dialog</Button>}>
    <p className="text-body">This is the dialog content.</p>
  </Dialog>
);

export const WithDescription: Story = () => (
  <Dialog
    description="This action cannot be undone. Please confirm you want to proceed."
    title="Confirm Action"
    trigger={<Button>Open Dialog</Button>}
  >
    <div className="mt-4 flex justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </Dialog>
);

export const Sizes: Story = () => (
  <div className="flex gap-4">
    <Dialog size="sm" title="Small Dialog" trigger={<Button size="sm">Small</Button>}>
      <p className="text-body">Small dialog content</p>
    </Dialog>
    <Dialog size="md" title="Medium Dialog" trigger={<Button size="sm">Medium</Button>}>
      <p className="text-body">Medium dialog content</p>
    </Dialog>
    <Dialog size="lg" title="Large Dialog" trigger={<Button size="sm">Large</Button>}>
      <p className="text-body">Large dialog content</p>
    </Dialog>
  </div>
);

export const Controlled: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <Dialog
        onOpenChange={setOpen}
        open={open}
        title="Controlled Dialog"
        trigger={<Button>Open</Button>}
      >
        <p className="text-body">This dialog is controlled from outside.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
      <p className="text-muted text-sm">Dialog is: {open ? "open" : "closed"}</p>
    </div>
  );
};

export const WithForm: Story = () => (
  <Dialog title="User Information" trigger={<Button>Fill Form</Button>}>
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          className="border-border bg-bg w-full rounded border px-3 py-2"
          placeholder="Enter your name"
          type="text"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          className="border-border bg-bg w-full rounded border px-3 py-2"
          placeholder="Enter your email"
          type="email"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </Dialog>
);

export const LongContent: Story = () => (
  <Dialog title="Terms and Conditions" trigger={<Button>View Terms</Button>}>
    <div className="max-h-96 space-y-4 overflow-y-auto">
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
