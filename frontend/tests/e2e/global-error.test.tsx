import { test, expect } from "@playwright/test";

test.describe("Global Error Page", () => {
  test("displays error message and debug info in development mode", async ({
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/lend?forceGlobalError=1`);

    await expect(
      page.getByRole("heading", { name: /something went wrong/i })
    ).toBeVisible();

    await expect(
      page.getByText(/an unexpected error occurred while loading the app/i)
    ).toBeVisible();

    const tryAgainButton = page.getByRole("button", { name: /try again/i });
    await expect(tryAgainButton).toBeVisible();

    const backToAppLink = page.getByRole("link", { name: /back to app/i });
    await expect(backToAppLink).toBeVisible();
  });
});
