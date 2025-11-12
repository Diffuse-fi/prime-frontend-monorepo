import type { Story, StoryDefault } from "@ladle/react";
import { UncontrolledCollapsible, ControlledCollapsible } from "./Collapsible";
import { useState } from "react";

export default {
  title: "Molecules/Display/Collapsible",
} satisfies StoryDefault;

export const Uncontrolled: Story = () => (
  <UncontrolledCollapsible summary="Click to expand">
    <p className="text-body">
      This is the collapsible content. It can contain any React components or text.
    </p>
  </UncontrolledCollapsible>
);

export const DefaultOpen: Story = () => (
  <UncontrolledCollapsible summary="Initially open" defaultOpen>
    <p className="text-body">This collapsible starts in an open state.</p>
  </UncontrolledCollapsible>
);

export const Controlled: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <ControlledCollapsible
        summary="Controlled collapsible"
        open={open}
        onOpenChange={setOpen}
      >
        <p className="text-body">This is controlled externally.</p>
      </ControlledCollapsible>
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary text-fg rounded px-4 py-2"
      >
        Toggle from outside
      </button>
    </div>
  );
};

export const WithComplexContent: Story = () => (
  <UncontrolledCollapsible summary="FAQ: How does this work?">
    <div className="space-y-2">
      <p className="text-body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
      <ul className="text-body list-inside list-disc space-y-1">
        <li>Feature one</li>
        <li>Feature two</li>
        <li>Feature three</li>
      </ul>
    </div>
  </UncontrolledCollapsible>
);

export const Multiple: Story = () => (
  <div className="max-w-2xl space-y-4">
    <UncontrolledCollapsible summary="Section 1">
      <p className="text-body">Content for section 1</p>
    </UncontrolledCollapsible>
    <UncontrolledCollapsible summary="Section 2">
      <p className="text-body">Content for section 2</p>
    </UncontrolledCollapsible>
    <UncontrolledCollapsible summary="Section 3">
      <p className="text-body">Content for section 3</p>
    </UncontrolledCollapsible>
  </div>
);

export const Nested: Story = () => (
  <UncontrolledCollapsible summary="Parent section">
    <div className="space-y-2">
      <p className="text-body">Parent content</p>
      <UncontrolledCollapsible summary="Nested section" summaryClassName="pl-4">
        <p className="text-body pl-4">Nested content</p>
      </UncontrolledCollapsible>
    </div>
  </UncontrolledCollapsible>
);
