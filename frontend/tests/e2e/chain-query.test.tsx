import { expect, test } from "@playwright/test";

const envInitialChainId = Number(process.env.NEXT_PUBLIC_INITIAL_CHAIN_ID);
const defaultChainId = Number.isFinite(envInitialChainId) ? envInitialChainId : 1;
const defaultChainQueryValue = defaultChainId === 1 ? "mainnet" : String(defaultChainId);

test.describe("Chain query parameter", () => {
  test("keeps supported chain parameter", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend?chain=${defaultChainQueryValue}`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe(defaultChainQueryValue);
  });

  test("adds default chain when missing", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe(defaultChainQueryValue);
  });

  test("replaces unsupported chain parameter with default chain", async ({
    baseURL,
    page,
  }) => {
    await page.goto(`${baseURL}/lend?chain=unsupported`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe(defaultChainQueryValue);
  });
});
