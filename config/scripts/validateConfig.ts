import { AssetsSchema, ASSETS, getAssetsResourcesUrls } from "../src/assets";
import { CHAINS, ChainsSchema, getChainsResourcesUrls } from "../src/chains";
import { ADDRESSES, AddressesSchema } from "../src/addresses";

async function checkUrlIsReachable(url: string) {
  const urlsToIgnore = ["https://example.com"];
  if (urlsToIgnore.includes(url)) {
    return;
  }

  const response = await fetch(url, { method: "HEAD" });

  console.log(`URL: ${url}: ${response.status}`);

  if (response.status === 403) {
    // Some servers block unknown HEAD requests, so we can ignore 403 responses
    return;
  }

  if (!response.ok) {
    throw new Error(`URL check failed for ${url} with status ${response.status}`);
  }
}

async function main() {
  AssetsSchema.parse(ASSETS);
  AddressesSchema.parse(ADDRESSES);
  ChainsSchema.parse(CHAINS);

  console.log("All configurations are valid." + "\n");

  const promises = [
    ...getAssetsResourcesUrls(),
    ...getChainsResourcesUrls(),
  ];

  await Promise.all(
    promises.map(async item => {
      try {
        await checkUrlIsReachable(item);
      } catch (err) {
        throw new Error(`URL check failed for ${item}: ${err.message}`);
      }
    })
  );

  console.log("All URLs are reachable.");
}

main().catch(err => {
  console.error("Configuration validation failed:", err);
  process.exit(1);
});
