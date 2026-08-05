import type { Story, StoryDefault } from "@ladle/react";

import { IconButton } from "./IconButton";

export default {
  title: "Atoms/Buttons/IconButton",
} satisfies StoryDefault;

export const Default: Story = () => <IconButton aria-label="Home" icon="🏠" />;

export const Variants: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton aria-label="Search" icon="🔍" variant="solid" />
    <IconButton aria-label="Search" icon="🔍" variant="ghost" />
    <IconButton aria-label="Search" icon="🔍" variant="link" />
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton aria-label="Settings" icon="⚙️" size="xs" />
    <IconButton aria-label="Settings" icon="⚙️" size="sm" />
    <IconButton aria-label="Settings" icon="⚙️" size="md" />
    <IconButton aria-label="Settings" icon="⚙️" size="lg" />
  </div>
);

export const Disabled: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton aria-label="Close" disabled icon="✖️" />
    <IconButton aria-label="Close" disabled icon="✖️" variant="solid" />
  </div>
);

export const CommonIcons: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <IconButton aria-label="Close" icon="✖️" />
    <IconButton aria-label="Edit" icon="✏️" />
    <IconButton aria-label="Delete" icon="🗑️" />
    <IconButton aria-label="Favorite" icon="⭐" />
    <IconButton aria-label="Like" icon="❤️" />
    <IconButton aria-label="Share" icon="📤" />
  </div>
);
