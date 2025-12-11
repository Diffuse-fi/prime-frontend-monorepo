import { mainnet } from "viem/chains";
import { createIndexer } from "@diffuse/indexer";
import { env } from "@/env";
import { customRpcMap } from "../chains/rpc";
import * as Sentry from "@sentry/nextjs";

export const indexerDbConfig = {
  connectionString: env.INDEXER_DATABASE_URL,
  maxConnections: env.INDEXER_DATABASE_MAX_CONNECTIONS,
};

function createIndexerWithSentryReport() {
  try {
    return createIndexer({
      rpcUrls: customRpcMap,
      db: indexerDbConfig,
      // Will be used on the first run when there is no checkpoint in the database
      startBlocks: {
        [mainnet.id]: 23_861_823,
      },
      chainIdsToIgnore: [],
    });
  } catch (e) {
    Sentry.captureException(e);
    throw e;
  }
}

export const indexer = createIndexerWithSentryReport();
