import type { Story } from "@ladle/react";
import { SimpleTable } from "./SimpleTable";

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
    <SimpleTable columns={sampleData.columns} rows={sampleData.rows} density="compact" />
  </div>
);

export const DensityComfortable: Story = () => (
  <div className="overflow-x-auto">
    <SimpleTable
      columns={sampleData.columns}
      rows={sampleData.rows}
      density="comfortable"
    />
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
    <div className="overflow-x-auto max-h-96">
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
      <div key="1" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/20" />
        <span>ETH</span>
      </div>,
      "1.234",
      "$2,500.00",
      <button key="1b" className="text-primary text-sm">
        Trade
      </button>,
    ],
    [
      <div key="2" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/20" />
        <span>USDC</span>
      </div>,
      "5,000.00",
      "$5,000.00",
      <button key="2b" className="text-primary text-sm">
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
