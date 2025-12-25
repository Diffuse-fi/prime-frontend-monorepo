import { ADDRESSES, AddressesSchema } from "../src/addresses";
import { ASSETS, AssetsSchema, getAssetsResourcesUrls } from "../src/assets";
import { CHAINS, ChainsSchema, getChainsResourcesUrls } from "../src/chains";

async function checkUrlIsReachable(url: string) {
  const urlsToIgnore = ["https://example.com"];
  if (urlsToIgnore.includes(url)) {
    return;
  }

  const response = await fetch(url, { method: "HEAD" });

  console.info(`URL: ${url}: ${response.status}`);

  if (response.status === 403) {
    // Some servers block unknown HEAD requests, so we can ignore 403 responses
    return;
  }

  if (!response.ok) {
    throw new Error(`URL check failed for ${url} with status ${response.status}`);
  }
}

async function main() {
  try {
    AssetsSchema.parse(ASSETS);
    AddressesSchema.parse(ADDRESSES);
    ChainsSchema.parse(CHAINS);

    console.info("All configurations are valid." + "\n");

    const promises = [
      ...getAssetsResourcesUrls(),
      ...getChainsResourcesUrls(),
    ];

    await Promise.all(
      promises.map(async item => {
        try {
          await checkUrlIsReachable(item);
        } catch (error) {
          throw new Error(`URL check failed for ${item}: ${error.message}`);
        }
      })
    );

    console.info("All URLs are reachable.");
  } catch (error) {
    throw new Error(`Configuration validation failed: ${error.message}`);
  }
}

await main();
