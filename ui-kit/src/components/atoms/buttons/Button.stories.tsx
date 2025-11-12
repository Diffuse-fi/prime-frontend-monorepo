import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "./Button";

export default {
  title: "Atoms/Buttons/Button",
  decorators: [
    Component => (
      <div className="flex justify-center">
        <Component />
      </div>
    ),
  ],
} satisfies StoryDefault;

export const Default: Story = () => <Button>Default Button</Button>;

export const Variants: Story = () => (
  <div className="flex flex-col gap-4">
    <Button variant="solid">Solid Button</Button>
    <Button variant="ghost">Ghost Button</Button>
    <Button variant="link">Link Button</Button>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4">
    <Button size="xs">Extra Small</Button>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const Disabled: Story = () => (
  <div className="flex flex-col gap-4">
    <Button disabled>Disabled Solid</Button>
    <Button variant="ghost" disabled>
      Disabled Ghost
    </Button>
    <Button variant="link" disabled>
      Disabled Link
    </Button>
  </div>
);

export const WithIcon: Story = () => (
  <div className="flex flex-col gap-4">
    <Button>
      <span>🚀</span> Button with Icon
    </Button>
    <Button variant="ghost">
      <span>⭐</span> Ghost with Icon
    </Button>
  </div>
);
