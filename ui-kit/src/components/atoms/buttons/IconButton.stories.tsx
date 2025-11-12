import type { Story, StoryDefault } from "@ladle/react";
import { IconButton } from "./IconButton";

export default {
  title: "Atoms/Buttons/IconButton",
} satisfies StoryDefault;

export const Default: Story = () => <IconButton icon="🏠" aria-label="Home" />;

export const Variants: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton icon="🔍" aria-label="Search" variant="solid" />
    <IconButton icon="🔍" aria-label="Search" variant="ghost" />
    <IconButton icon="🔍" aria-label="Search" variant="link" />
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton icon="⚙️" aria-label="Settings" size="xs" />
    <IconButton icon="⚙️" aria-label="Settings" size="sm" />
    <IconButton icon="⚙️" aria-label="Settings" size="md" />
    <IconButton icon="⚙️" aria-label="Settings" size="lg" />
  </div>
);

export const Disabled: Story = () => (
  <div className="flex items-center gap-4">
    <IconButton icon="✖️" aria-label="Close" disabled />
    <IconButton icon="✖️" aria-label="Close" variant="solid" disabled />
  </div>
);

export const CommonIcons: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <IconButton icon="✖️" aria-label="Close" />
    <IconButton icon="✏️" aria-label="Edit" />
    <IconButton icon="🗑️" aria-label="Delete" />
    <IconButton icon="⭐" aria-label="Favorite" />
    <IconButton icon="❤️" aria-label="Like" />
    <IconButton icon="📤" aria-label="Share" />
  </div>
);
