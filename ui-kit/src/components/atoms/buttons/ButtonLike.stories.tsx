import type { Story, StoryDefault } from "@ladle/react";
import { ButtonLike } from "./ButtonLike";

export default {
  title: "Atoms/Buttons/ButtonLike",
} satisfies StoryDefault;

export const AsButton: Story = () => <ButtonLike>Default Button</ButtonLike>;

export const AsLink: Story = () => (
  <ButtonLike component="a" href="#example">
    Link Button
  </ButtonLike>
);

export const AsDiv: Story = () => (
  <ButtonLike component="div" onClick={() => alert("Div clicked!")}>
    Div Button
  </ButtonLike>
);

export const Variants: Story = () => (
  <div className="flex flex-col gap-4">
    <ButtonLike variant="solid">Solid</ButtonLike>
    <ButtonLike variant="ghost">Ghost</ButtonLike>
    <ButtonLike variant="link">Link</ButtonLike>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4">
    <ButtonLike size="xs">Extra Small</ButtonLike>
    <ButtonLike size="sm">Small</ButtonLike>
    <ButtonLike size="md">Medium</ButtonLike>
    <ButtonLike size="lg">Large</ButtonLike>
  </div>
);

export const CustomComponent: Story = () => (
  <ButtonLike component="a" href="https://example.com" target="_blank" variant="solid">
    External Link Button
  </ButtonLike>
);
