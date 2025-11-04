import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

const SEED_PHRASE =
  process.env.E2E_SEED_PHRASE ??
  "test test test test test test test test test test test junk";
export const WALLET_PASSWORD = process.env.E2E_WALLET_PASSWORD ?? "Password123";

export default defineWalletSetup(WALLET_PASSWORD, async (context, walletPage) => {
  // When popups are needed (sign/tx), extensionId helps Synpress hook them reliably.
  // This is a temporary workaround per docs.
  // @ts-ignore - getExtensionId is injected by Synpress at runtime in setup files
  const extensionId = await getExtensionId(context, "MetaMask");
  const metamask = new MetaMask(context, walletPage, WALLET_PASSWORD, extensionId);

  await metamask.importWallet(SEED_PHRASE);
  // Optional: add local Anvil or custom chains here (example IDs)
  // await metamask.addNetwork({
  //   networkName: 'Local Anvil',
  //   rpcUrl: 'http://127.0.0.1:8545',
  //   chainId: 31337,
  //   symbol: 'ETH'
  // });
});
