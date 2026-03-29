import type { Story, StoryDefault } from "@ladle/react";

import { Heading } from "./Heading";

export default {
  title: "Atoms/Typography/Heading",
} satisfies StoryDefault;

export const Levels: Story = () => (
  <div className="space-y-4">
    <Heading level="1">Heading Level 1</Heading>
    <Heading level="2">Heading Level 2</Heading>
    <Heading level="3">Heading Level 3</Heading>
    <Heading level="4">Heading Level 4</Heading>
    <Heading level="5">Heading Level 5</Heading>
    <Heading level="6">Heading Level 6</Heading>
  </div>
);

export const Default: Story = () => <Heading>Default Heading (Level 2)</Heading>;

export const Alignment: Story = () => (
  <div className="space-y-4">
    <Heading align="left">Left Aligned</Heading>
    <Heading align="center">Center Aligned</Heading>
    <Heading align="right">Right Aligned</Heading>
  </div>
);

export const WithLongText: Story = () => (
  <div className="max-w-2xl space-y-4">
    <Heading level="1">
      This is a very long heading that demonstrates text wrapping and balance
    </Heading>
    <Heading level="2">
      Medium length heading showing responsive behavior across different screen sizes
    </Heading>
  </div>
);

export const InContext: Story = () => (
  <article className="max-w-2xl space-y-4">
    <Heading level="1">Article Title</Heading>
    <p className="text-body text-text-dimmed">
      Published on November 10, 2025 by John Doe
    </p>
    <Heading level="2">Introduction</Heading>
    <p className="text-body">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </p>
    <Heading level="3">Subsection</Heading>
    <p className="text-body">
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
      ex ea commodo consequat.
    </p>
  </article>
);
