import { test, expect } from "@playwright/test";

test("loads core pages", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/lend`);
  await expect(page.getByRole("heading", { name: /lend/i })).toBeVisible();

  await page.goto(`${baseURL}/borrow`);
  await expect(page.getByRole("heading", { name: /borrow/i })).toBeVisible();

  await expect(
    page.getByRole("table").or(page.locator('[data-testid="positions-list"]'))
  ).toBeVisible();
});
