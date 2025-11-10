import type { Story } from "@ladle/react";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { useState } from "react";

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
          <div className="p-4 bg-fg border border-border rounded">Overview content</div>
        </TabsContent>
        <TabsContent value="details">
          <div className="p-4 bg-fg border border-border rounded">Details content</div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="p-4 bg-fg border border-border rounded">Settings content</div>
        </TabsContent>
      </TabsRoot>
      <p className="text-sm text-muted">Selected: {value}</p>
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
      <div className="p-4 bg-fg border border-border rounded">Buy content</div>
    </TabsContent>
    <TabsContent value="sell">
      <div className="p-4 bg-fg border border-border rounded">Sell content</div>
    </TabsContent>
    <TabsContent value="swap">
      <div className="p-4 bg-fg border border-border rounded">Swap content</div>
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
      <p className="text-sm text-muted mb-2">Start (default)</p>
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
      <p className="text-sm text-muted mb-2">Center</p>
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
      <p className="text-sm text-muted mb-2">End</p>
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
