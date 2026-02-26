import { expect, test } from "@playwright/test";

test.describe("Chain query parameter", () => {
  test("keeps supported chain parameter", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend?chain=mainnet`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe("mainnet");
  });

  test("adds default chain when missing", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe("mainnet");
  });

  test("removes unsupported chain parameter", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend?chain=unsupported`);

    await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("chain"))
      .toBe("mainnet");
  });
});
