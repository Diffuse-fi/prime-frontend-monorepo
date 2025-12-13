import type { Story, StoryDefault } from "@ladle/react";

import { CopyButton } from "./CopyButton";

export default {
  title: "Atoms/Buttons/CopyButton",
} satisfies StoryDefault;

export const Default: Story = () => <CopyButton textToCopy="Hello, World!" />;

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <CopyButton size="sm" textToCopy="Copy me" />
    <CopyButton size="md" textToCopy="Copy me" />
    <CopyButton size="lg" textToCopy="Copy me" />
  </div>
);

export const WithVariants: Story = () => (
  <div className="flex items-center gap-4">
    <CopyButton textToCopy="0x1234567890abcdef" variant="ghost" />
    <CopyButton textToCopy="0x1234567890abcdef" variant="solid" />
    <CopyButton textToCopy="0x1234567890abcdef" variant="link" />
  </div>
);

export const LongText: Story = () => (
  <CopyButton textToCopy="This is a very long text that will be copied to the clipboard when the button is clicked. It demonstrates that the copy function works with any length of text." />
);

export const WithAddress: Story = () => (
  <div className="flex items-center gap-2">
    <code className="bg-muted/20 rounded px-2 py-1 text-sm">
      0x742d35Cc6634C0532925a3b8...
    </code>
    <CopyButton textToCopy="0x742d35Cc6634C0532925a3b844F9a5C6735cB3e8" />
  </div>
);
