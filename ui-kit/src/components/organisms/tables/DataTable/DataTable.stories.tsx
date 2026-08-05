import type { Story, StoryDefault } from "@ladle/react";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./DataTable";

export default {
  title: "Organisms/Tables/DataTable",
} satisfies StoryDefault;

type Person = {
  email: string;
  id: number;
  name: string;
  role: string;
  status: string;
};

const sampleData: Person[] = [
  { email: "john@example.com", id: 1, name: "John Doe", role: "Admin", status: "Active" },
  {
    email: "jane@example.com",
    id: 2,
    name: "Jane Smith",
    role: "User",
    status: "Active",
  },
  {
    email: "bob@example.com",
    id: 3,
    name: "Bob Johnson",
    role: "User",
    status: "Inactive",
  },
  {
    email: "alice@example.com",
    id: 4,
    name: "Alice Brown",
    role: "Admin",
    status: "Active",
  },
];

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const Default: Story = () => (
  <div className="overflow-x-auto">
    <DataTable columns={columns} data={sampleData} />
  </div>
);

export const WithSorting: Story = () => {
  const sortableColumns: ColumnDef<Person>[] = [
    {
      accessorKey: "name",
      enableSorting: true,
      header: "Name",
    },
    {
      accessorKey: "email",
      enableSorting: true,
      header: "Email",
    },
    {
      accessorKey: "role",
      enableSorting: true,
      header: "Role",
    },
    {
      accessorKey: "status",
      enableSorting: true,
      header: "Status",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={sortableColumns} data={sampleData} />
    </div>
  );
};

export const DensityCompact: Story = () => (
  <div className="overflow-x-auto">
    <DataTable columns={columns} data={sampleData} density="compact" />
  </div>
);

export const DensityComfortable: Story = () => (
  <div className="overflow-x-auto">
    <DataTable columns={columns} data={sampleData} density="comfy" />
  </div>
);

export const CryptoAssets: Story = () => {
  type Asset = {
    change24h: number;
    marketCap: string;
    price: number;
    symbol: string;
  };

  const assetData: Asset[] = [
    { change24h: 2.5, marketCap: "$850B", price: 43_521, symbol: "BTC" },
    { change24h: -1.2, marketCap: "$268B", price: 2234.5, symbol: "ETH" },
    { change24h: 0, marketCap: "$24B", price: 1, symbol: "USDC" },
    { change24h: 0.1, marketCap: "$5B", price: 1, symbol: "DAI" },
  ];

  const assetColumns: ColumnDef<Asset>[] = [
    {
      accessorKey: "symbol",
      enableSorting: true,
      header: "Asset",
    },
    {
      accessorKey: "price",
      cell: info => `$${info.getValue<number>().toLocaleString()}`,
      enableSorting: true,
      header: "Price",
    },
    {
      accessorKey: "change24h",
      cell: info => {
        const value = info.getValue<number>();
        const color = value >= 0 ? "text-success" : "text-error";
        return (
          <span className={color}>
            {value > 0 ? "+" : ""}
            {value}%
          </span>
        );
      },
      enableSorting: true,
      header: "24h Change",
    },
    {
      accessorKey: "marketCap",
      header: "Market Cap",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={assetColumns} data={assetData} />
    </div>
  );
};

export const WithRowClick: Story = () => (
  <div className="overflow-x-auto">
    <DataTable
      columns={columns}
      data={sampleData}
      onRowClick={row => alert(`Clicked: ${row.name}`)}
    />
  </div>
);

export const Empty: Story = () => (
  <div className="overflow-x-auto">
    <DataTable columns={columns} data={[]} />
  </div>
);
