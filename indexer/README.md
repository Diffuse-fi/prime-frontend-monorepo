# Diffuse Prime Node.js EVM Indexer

## Description

This package provides a backend service for indexing blockchain data related to the Diffuse Prime protocol. It connects to specified EVM-compatible blockchains, listens for relevant events, and stores the indexed data for efficient querying and analysis.

## Requirements

- Node.js v16 or higher
- Access to an Ethereum-compatible node (e.g., via Infura, Alchemy, or a self-hosted node)
- A database (e.g., PostgreSQL, MongoDB) for storing indexed data

## Usage

To use this indexer in your project, install it as a dependency:

```bash
npm install @diffuse/indexer
```

Then, import and initialize the indexer in your code:

```typescript
import { createIndexer } from "@diffuse/indexer";
import { mainnet } from "viem/chains";

const indexer = createIndexer({
  chainIdsToIgnore: [],
  db: {
    connectionStrnig: process.env.DATABASE_URL!,
    maxConnections: 10,
  },
  rpcUrls: {
    [mainnet.id]: process.env.MAINNET_RPC_URL!,
  },
  startBlocks: {
    [mainnet.id]: 23_861_823,
  },
});
```

Refer to the documentation for detailed configuration options and usage examples.

## Configuration

The indexer can be configured with the following options:

- `chainIdsToIgnore`: An array of chain IDs to ignore during indexing.
- `db`: Database configuration including connection string and max connections.
- `rpcUrls`: A mapping of chain IDs to their respective RPC URLs.
- `startBlocks`: A mapping of chain IDs to the block number from which to start indexing

## Development

To run the SDK in development mode, use the following command:

```bash
npm run dev
```

This will start the development server and watch for changes in the source files.

## License

This package is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
