import type { Story, StoryDefault } from "@ladle/react";

import { SimpleTable } from "./SimpleTable";

export default {
  title: "Organisms/Tables/SimpleTable",
} satisfies StoryDefault;

const sampleData = {
  columns: ["Name", "Email", "Role", "Status"],
  rows: [
    ["John Doe", "john@example.com", "Admin", "Active"],
    ["Jane Smith", "jane@example.com", "User", "Active"],
    ["Bob Johnson", "bob@example.com", "User", "Inactive"],
  ],
};

export const Default: Story = () => (
  <div className="overflow-x-auto">
    <SimpleTable columns={sampleData.columns} rows={sampleData.rows} />
  </div>
);

export const DensityCompact: Story = () => (
  <div className="overflow-x-auto">
    <SimpleTable columns={sampleData.columns} density="compact" rows={sampleData.rows} />
  </div>
);

export const DensityComfortable: Story = () => (
  <div className="overflow-x-auto">
    <SimpleTable columns={sampleData.columns} density="comfy" rows={sampleData.rows} />
  </div>
);

export const WithManyRows: Story = () => {
  const manyRows = Array.from({ length: 20 }, (_, i) => [
    `User ${i + 1}`,
    `user${i + 1}@example.com`,
    i % 3 === 0 ? "Admin" : "User",
    i % 2 === 0 ? "Active" : "Inactive",
  ]);

  return (
    <div className="max-h-96 overflow-x-auto">
      <SimpleTable columns={sampleData.columns} rows={manyRows} />
    </div>
  );
};

export const CryptoData: Story = () => {
  const columns = ["Asset", "Price", "24h Change", "Market Cap"];
  const rows = [
    ["Bitcoin", "$43,521.00", "+2.5%", "$850B"],
    ["Ethereum", "$2,234.50", "-1.2%", "$268B"],
    ["USDC", "$1.00", "0.0%", "$24B"],
    ["DAI", "$1.00", "+0.1%", "$5B"],
  ];

  return (
    <div className="overflow-x-auto">
      <SimpleTable columns={columns} rows={rows} />
    </div>
  );
};

export const WithCustomContent: Story = () => {
  const columns = ["Asset", "Amount", "Value", "Actions"];
  const rows = [
    [
      <div className="flex items-center gap-2" key="1">
        <div className="bg-primary/20 h-6 w-6 rounded-full" />
        <span>ETH</span>
      </div>,
      "1.234",
      "$2,500.00",
      <button className="text-primary text-sm" key="1b">
        Trade
      </button>,
    ],
    [
      <div className="flex items-center gap-2" key="2">
        <div className="bg-primary/20 h-6 w-6 rounded-full" />
        <span>USDC</span>
      </div>,
      "5,000.00",
      "$5,000.00",
      <button className="text-primary text-sm" key="2b">
        Trade
      </button>,
    ],
  ];

  return (
    <div className="overflow-x-auto">
      <SimpleTable columns={columns} rows={rows} />
    </div>
  );
};

export const MinimalData: Story = () => {
  const columns = ["ID", "Name"];
  const rows = [
    ["1", "Item A"],
    ["2", "Item B"],
    ["3", "Item C"],
  ];

  return (
    <div className="overflow-x-auto">
      <SimpleTable columns={columns} rows={rows} />
    </div>
  );
};
