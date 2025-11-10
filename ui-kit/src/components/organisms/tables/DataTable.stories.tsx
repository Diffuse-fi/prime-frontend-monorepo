import type { Story } from "@ladle/react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const sampleData: Person[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin", status: "Active" },
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
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
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
    <DataTable columns={columns} data={sampleData} density="comfortable" />
  </div>
);

export const CryptoAssets: Story = () => {
  type Asset = {
    symbol: string;
    price: number;
    change24h: number;
    marketCap: string;
  };

  const assetData: Asset[] = [
    { symbol: "BTC", price: 43521.0, change24h: 2.5, marketCap: "$850B" },
    { symbol: "ETH", price: 2234.5, change24h: -1.2, marketCap: "$268B" },
    { symbol: "USDC", price: 1.0, change24h: 0.0, marketCap: "$24B" },
    { symbol: "DAI", price: 1.0, change24h: 0.1, marketCap: "$5B" },
  ];

  const assetColumns: ColumnDef<Asset>[] = [
    {
      accessorKey: "symbol",
      header: "Asset",
      enableSorting: true,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: info => `$${info.getValue<number>().toLocaleString()}`,
      enableSorting: true,
    },
    {
      accessorKey: "change24h",
      header: "24h Change",
      cell: info => {
        const value = info.getValue<number>();
        const color = value >= 0 ? "text-success" : "text-error";
        return <span className={color}>{value > 0 ? "+" : ""}{value}%</span>;
      },
      enableSorting: true,
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
