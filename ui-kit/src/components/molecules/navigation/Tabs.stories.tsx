import type { Story, StoryDefault } from "@ladle/react";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { useState } from "react";

export default {
  title: "Molecules/Navigation/Tabs",
} satisfies StoryDefault;

export const Default: Story = () => (
  <TabsRoot defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content for Tab 1</TabsContent>
    <TabsContent value="tab2">Content for Tab 2</TabsContent>
    <TabsContent value="tab3">Content for Tab 3</TabsContent>
  </TabsRoot>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("overview");
  return (
    <div className="space-y-4">
      <TabsRoot value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-fg border-border rounded border p-4">Overview content</div>
        </TabsContent>
        <TabsContent value="details">
          <div className="bg-fg border-border rounded border p-4">Details content</div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="bg-fg border-border rounded border p-4">Settings content</div>
        </TabsContent>
      </TabsRoot>
      <p className="text-muted text-sm">Selected: {value}</p>
    </div>
  );
};

export const Fitted: Story = () => (
  <TabsRoot defaultValue="buy">
    <TabsList fitted>
      <TabsTrigger value="buy" fitted>
        Buy
      </TabsTrigger>
      <TabsTrigger value="sell" fitted>
        Sell
      </TabsTrigger>
      <TabsTrigger value="swap" fitted>
        Swap
      </TabsTrigger>
    </TabsList>
    <TabsContent value="buy">
      <div className="bg-fg border-border rounded border p-4">Buy content</div>
    </TabsContent>
    <TabsContent value="sell">
      <div className="bg-fg border-border rounded border p-4">Sell content</div>
    </TabsContent>
    <TabsContent value="swap">
      <div className="bg-fg border-border rounded border p-4">Swap content</div>
    </TabsContent>
  </TabsRoot>
);

export const WithDisabled: Story = () => (
  <TabsRoot defaultValue="active">
    <TabsList>
      <TabsTrigger value="active">Active</TabsTrigger>
      <TabsTrigger value="disabled" disabled>
        Disabled
      </TabsTrigger>
      <TabsTrigger value="another">Another</TabsTrigger>
    </TabsList>
    <TabsContent value="active">Active tab content</TabsContent>
    <TabsContent value="disabled">You shouldn't see this</TabsContent>
    <TabsContent value="another">Another tab content</TabsContent>
  </TabsRoot>
);

export const Alignment: Story = () => (
  <div className="space-y-8">
    <div>
      <p className="text-muted mb-2 text-sm">Start (default)</p>
      <TabsRoot defaultValue="1">
        <TabsList align="start">
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">Content 1</TabsContent>
        <TabsContent value="2">Content 2</TabsContent>
      </TabsRoot>
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Center</p>
      <TabsRoot defaultValue="1">
        <TabsList align="center">
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">Content 1</TabsContent>
        <TabsContent value="2">Content 2</TabsContent>
      </TabsRoot>
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">End</p>
      <TabsRoot defaultValue="1">
        <TabsList align="end">
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">Content 1</TabsContent>
        <TabsContent value="2">Content 2</TabsContent>
      </TabsRoot>
    </div>
  </div>
);
