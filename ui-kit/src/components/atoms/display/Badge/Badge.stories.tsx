import type { Story, StoryDefault } from "@ladle/react";

import { Badge } from "./Badge";

export default {
  title: "Atoms/Display/Badge",
} satisfies StoryDefault;

export const Default: Story = () => <Badge>Default</Badge>;

export const Colors: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Badge color="success">Success</Badge>
    <Badge color="warning">Warning</Badge>
    <Badge color="error">Error</Badge>
    <Badge color="muted">Muted</Badge>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <Badge color="success" size="sm">
      Small
    </Badge>
    <Badge color="success" size="md">
      Medium
    </Badge>
    <Badge color="success" size="lg">
      Large
    </Badge>
  </div>
);

export const WithoutText: Story = () => (
  <div className="flex items-center gap-4">
    <Badge color="success" />
    <Badge color="warning" />
    <Badge color="error" />
    <Badge color="muted" />
  </div>
);

export const InContext: Story = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-body">Status:</span>
      <Badge color="success">Active</Badge>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-body">Network:</span>
      <Badge color="warning">Testnet</Badge>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-body">Connection:</span>
      <Badge color="error">Disconnected</Badge>
    </div>
  </div>
);

export const InList: Story = () => (
  <div className="space-y-2">
    <div className="bg-fg border-border flex items-center justify-between rounded border p-3">
      <span>Transaction 1</span>
      <Badge color="success">Confirmed</Badge>
    </div>
    <div className="bg-fg border-border flex items-center justify-between rounded border p-3">
      <span>Transaction 2</span>
      <Badge color="warning">Pending</Badge>
    </div>
    <div className="bg-fg border-border flex items-center justify-between rounded border p-3">
      <span>Transaction 3</span>
      <Badge color="error">Failed</Badge>
    </div>
  </div>
);
