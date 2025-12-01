# Diffuse Prime Node.js EVM Indexer

## Description

This package provides a backend service for indexing blockchain data related to the Diffuse Prime protocol. It connects to specified EVM-compatible blockchains, listens for relevant events, and stores the indexed data for efficient querying and analysis.

The indexer is built as an ESM-only library that can be integrated into your application to provide real-time blockchain data indexing capabilities. It uses PostgreSQL for data persistence and Drizzle ORM for database operations.

## Features

- **Multi-chain support**: Index data from multiple EVM-compatible blockchains simultaneously
- **Vault discovery**: Automatically discover and track Diffuse Prime vaults across supported chains
- **Event indexing**: Capture and store blockchain events with full transaction context
- **Position tracking**: Track user positions including opens, closes, and P&L calculations
- **Price data**: Store and query historical price data for assets
- **Checkpoint system**: Resume indexing from last processed block after restarts
- **Type-safe**: Built with TypeScript for type safety and better developer experience
- **Efficient storage**: Uses PostgreSQL with optimized indexes for fast queries

## Architecture

The indexer consists of several key components:

- **Indexer**: Main orchestrator that coordinates syncing across multiple chains
- **ChainRuntime**: Per-chain runtime that manages RPC connections and contract interactions
- **IndexerStorage**: Database abstraction layer for all data operations
- **Database Schema**: PostgreSQL schema with tables for vaults, events, checkpoints, positions, and prices

### Database Schema

The indexer uses the following tables:

- `vaults`: Stores discovered vault contracts with metadata
- `events`: Stores all indexed blockchain events
- `checkpoints`: Tracks last processed block per chain and address
- `positions`: Tracks user positions with P&L data
- `prices`: Stores historical price data for assets

## Prerequisites

- Node.js 22.x (as specified in package.json engines)
- PostgreSQL database
- RPC endpoints for the chains you want to index

## Installation

Install the package in your project:

```bash
npm install @diffuse/indexer
```

Or if you're working within the monorepo:

```bash
npm ci
```

## Environment Setup

The indexer requires a PostgreSQL database connection. You can configure this through environment variables or directly in code.

Create a `.env.local` file in the indexer directory with your database connection details:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/diffuse_indexer
```

## Database Setup

Before running the indexer, you need to set up the database schema.

### Generate Migrations

If you've made changes to the schema, generate new migrations:

```bash
npm run db:generate
```

This will create migration files in the `migrations/` directory based on the schema defined in `src/features/db/schema.ts`.

### Run Migrations

Apply the migrations to your database:

```bash
npm run db:migrate
```

Or programmatically in your application:

```typescript
import { runIndexerMigrations } from "@diffuse/indexer";

await runIndexerMigrations({
  host: "localhost",
  port: 5432,
  database: "diffuse_indexer",
  user: "postgres",
  password: "password",
});
```

### Database Studio

To explore your database with Drizzle Studio:

```bash
npm run db:studio
```

This will open a web interface at `http://local.drizzle.studio` to browse and manage your data.

### Check Schema

To check for schema inconsistencies:

```bash
npm run db:check
```

## Usage

### Basic Setup

```typescript
import { createIndexer } from "@diffuse/indexer";
import { mainnet, arbitrum } from "viem/chains";

const indexer = createIndexer({
  chains: [mainnet, arbitrum],
  rpcUrls: {
    [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
    [arbitrum.id]: "https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  },
  startBlocks: {
    [mainnet.id]: 19000000n,
    [arbitrum.id]: 180000000n,
  },
  db: {
    host: "localhost",
    port: 5432,
    database: "diffuse_indexer",
    user: "postgres",
    password: "password",
  },
});

// Run a single sync
await indexer.syncAll();

// Or set up periodic syncing
setInterval(async () => {
  await indexer.syncAll();
}, 60000); // Sync every minute

// Shutdown gracefully
process.on("SIGINT", async () => {
  await indexer.shutdown();
  process.exit(0);
});
```

### Querying Data

The indexer provides a storage interface for querying indexed data:

```typescript
// Get user positions
const positions = await indexer.storage.getUserPositions({
  chainId: 1,
  user: "0x1234...",
  limit: 50,
});

// Get vault-specific positions
const vaultPositions = await indexer.storage.getVaultUserPositions({
  chainId: 1,
  vault: "0xabcd...",
  user: "0x1234...",
  limit: 50,
});

// Get latest prices
const prices = await indexer.storage.getLatestPrices({
  assets: ["0xtoken1...", "0xtoken2..."],
  source: "chainlink",
});

// Get checkpoint
const checkpoint = await indexer.storage.getCheckpoint(1, "indexer-global");
```

### Advanced Configuration

```typescript
import { createIndexer } from "@diffuse/indexer";
import { defineChain } from "viem";

// Define a custom chain
const customChain = defineChain({
  id: 12345,
  name: "Custom Chain",
  network: "custom",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://custom-rpc.example.com"] },
  },
});

const indexer = createIndexer({
  chains: [customChain],
  rpcUrls: {
    [customChain.id]: "https://custom-rpc.example.com",
  },
  startBlocks: {
    [customChain.id]: 1000000n, // Start from specific block
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
```

## Development

### Building

To build the package:

```bash
npm run build
```

This compiles the TypeScript source code and creates the distributable package in the `dist/` directory.

### Watch Mode

To run the indexer in development mode with automatic rebuilding:

```bash
npm run dev
```

This will watch for changes in the source files and rebuild automatically.

### Testing

To run the test suite:

```bash
npm run test:unit
```

To run tests in watch mode during development:

```bash
npm run test:unit:watch
```

To run tests with coverage:

```bash
npm run test:unit
```

Coverage reports will be generated in the `coverage/` directory.

## Database Migrations

This package uses Drizzle Kit for database migrations. The migration workflow is:

1. **Modify schema**: Edit `src/features/db/schema.ts`
2. **Generate migration**: Run `npm run db:generate` to create SQL migration files
3. **Review migration**: Check the generated SQL in `migrations/` directory
4. **Apply migration**: Run `npm run db:migrate` to apply to your database

Migration files should be version controlled to track schema changes over time.

## API Reference

### `createIndexer(config: IndexerConfig): Indexer`

Creates a new indexer instance with the provided configuration.

**Parameters:**

- `config.chains`: Array of viem Chain objects to index
- `config.rpcUrls`: Record mapping chain IDs to RPC URLs
- `config.startBlocks`: Optional record mapping chain IDs to starting block numbers
- `config.db`: Database configuration object

**Returns:** Indexer instance

### `indexer.syncAll(): Promise<void>`

Syncs all configured chains by fetching new data from the latest checkpoint to the current block.

### `indexer.shutdown(): Promise<void>`

Gracefully shuts down the indexer and closes database connections.

### `runIndexerMigrations(dbConfig: DbConfig): Promise<void>`

Runs database migrations to set up or update the schema.

## Deployment Considerations

When deploying the indexer in production:

1. **Database**: Use a managed PostgreSQL service (e.g., AWS RDS, Google Cloud SQL, Supabase) for reliability
2. **RPC Endpoints**: Use reliable RPC providers with high rate limits (Alchemy, Infura, QuickNode)
3. **Monitoring**: Set up logging and monitoring for sync errors and performance
4. **Scaling**: Run multiple indexer instances with different chain configurations for better performance
5. **Backups**: Regularly backup your PostgreSQL database
6. **Environment Variables**: Never commit credentials; use environment variables or secrets management
7. **Error Handling**: Implement retry logic and alerting for RPC failures
8. **Rate Limiting**: Be mindful of RPC rate limits when setting sync intervals

## Security Considerations

- Store database credentials securely using environment variables or secrets management
- Never expose database credentials in client-side code
- Use read-only database users for query-only applications
- Implement proper access controls on your PostgreSQL database
- Keep dependencies up to date to avoid known vulnerabilities

## License

This package is licensed under the Apache License 2.0. See the LICENSE file included in the package for details.

For attribution notices, see the NOTICE file included in the package.
