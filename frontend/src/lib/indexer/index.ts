import { createIndexer, IndexerConfig } from "@diffuse/indexer";
import * as Sentry from "@sentry/nextjs";
import { mainnet } from "viem/chains";

import { env } from "@/env";

import { customRpcMap } from "../chains/rpc";
import { isIndexerEnabled } from "./isEnabled";

export const indexerDbConfig = {
  connectionString: env.INDEXER_DATABASE_URL,
  maxConnections: env.INDEXER_DATABASE_MAX_CONNECTIONS,
};

function createIndexerWithSentryReport() {
  if (!isIndexerEnabled()) {
    throw new Error("Indexer is not enabled");
  }

  if (!indexerDbConfig.connectionString) {
    throw new Error("Indexer database URL is not defined");
  }

  try {
    return createIndexer({
      chainIdsToIgnore: [],
      db: indexerDbConfig as IndexerConfig["db"],
      rpcUrls: customRpcMap,
      // Will be used on the first run when there is no checkpoint in the database
      startBlocks: {
        [mainnet.id]: 23_861_823,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export const indexer = createIndexerWithSentryReport();
