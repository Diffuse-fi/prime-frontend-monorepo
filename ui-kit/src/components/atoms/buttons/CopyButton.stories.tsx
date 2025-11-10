import type { Story } from "@ladle/react";
import { CopyButton } from "./CopyButton";

export const Default: Story = () => <CopyButton textToCopy="Hello, World!" />;

export const Sizes: Story = () => (
  <div className="flex gap-4 items-center">
    <CopyButton textToCopy="Copy me" size="sm" />
    <CopyButton textToCopy="Copy me" size="md" />
    <CopyButton textToCopy="Copy me" size="lg" />
  </div>
);

export const WithVariants: Story = () => (
  <div className="flex gap-4 items-center">
    <CopyButton textToCopy="0x1234567890abcdef" variant="ghost" />
    <CopyButton textToCopy="0x1234567890abcdef" variant="solid" />
    <CopyButton textToCopy="0x1234567890abcdef" variant="link" />
  </div>
);

export const LongText: Story = () => (
  <CopyButton textToCopy="This is a very long text that will be copied to the clipboard when the button is clicked. It demonstrates that the copy function works with any length of text." />
);

export const WithAddress: Story = () => (
  <div className="flex gap-2 items-center">
    <code className="text-sm bg-muted/20 px-2 py-1 rounded">
      0x742d35Cc6634C0532925a3b8...
    </code>
    <CopyButton textToCopy="0x742d35Cc6634C0532925a3b844F9a5C6735cB3e8" />
  </div>
);
