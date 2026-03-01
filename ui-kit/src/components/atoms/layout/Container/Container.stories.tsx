import type { Story, StoryDefault } from "@ladle/react";

import { Container } from "./Container";

export default {
  title: "Atoms/Layout/Container",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Container>
    <div className="bg-muted/20 rounded p-4">
      <p>Default container with max-width</p>
    </div>
  </Container>
);

export const Fluid: Story = () => (
  <Container fluid>
    <div className="bg-muted/20 rounded p-4">
      <p>Fluid container (full width)</p>
    </div>
  </Container>
);

export const WithContent: Story = () => (
  <Container>
    <div className="space-y-4">
      <h2 className="text-h2 font-semibold">Page Title</h2>
      <p className="text-body">
        This is a container with some content inside. It provides consistent padding and
        max-width across the application.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-muted/20 rounded p-4">Card 1</div>
        <div className="bg-muted/20 rounded p-4">Card 2</div>
        <div className="bg-muted/20 rounded p-4">Card 3</div>
      </div>
    </div>
  </Container>
);

export const AsSection: Story = () => (
  <Container as="section">
    <div className="bg-muted/20 rounded p-4">
      <p>Container rendered as a section element</p>
    </div>
  </Container>
);

export const Nested: Story = () => (
  <Container>
    <div className="bg-muted/20 mb-4 rounded p-4">
      <p>Outer container</p>
    </div>
    <Container>
      <div className="bg-primary/10 rounded p-4">
        <p>Nested container (though not typically recommended)</p>
      </div>
    </Container>
  </Container>
);
