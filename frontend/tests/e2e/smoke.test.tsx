import { expect, test } from "@playwright/test";

const pagesToTest = ["/lend", "/borrow", "/lend/my-positions", "/borrow/my-positions"];

test.describe("Smoke", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    page.on("pageerror", err => {
      const msg = err.message || String(err);

      if (
        msg.includes("Operation was aborted") ||
        msg.includes("AbortError") ||
        msg.includes("The user aborted a request")
      ) {
        return;
      }

      testInfo.attachments.push({
        body: Buffer.from(err.stack || err.message),
        contentType: "text/plain",
        name: "pageerror",
      });

      throw new Error(`Page error: ${err.message}`);
    });

    // page.on("console", (msg) => {
    //   if (msg.type() === "error") {
    //     testInfo.attachments.push({
    //       name: "console-error",
    //       contentType: "text/plain",
    //       body: Buffer.from(msg.text()),
    //     });

    //     throw new Error(`Console error: ${msg.text()}`);
    //   }
    // });
  });

  test("core pages return 200", async ({ baseURL, page }) => {
    for (const path of pagesToTest) {
      const resp = await page.goto(`${baseURL}${path}`);
      expect(resp?.ok()).toBeTruthy();
    }
  });

  test("loads core pages", async ({ baseURL, page }) => {
    const headingPerPage: Record<string, RegExp> = {
      "/borrow": /borrow/i,
      "/borrow/my-positions": /my borrow positions/i,
      "/lend": /lend/i,
      "/lend/my-positions": /my lending positions/i,
    };

    for (const path of pagesToTest) {
      await page.goto(`${baseURL}${path}`);
      await expect(
        page.getByRole("heading", { name: headingPerPage[path] })
      ).toBeVisible();
    }
  });

  test("shows 404 for unknown page", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/this-page-does-not-exist`);
    await expect(
      page.getByRole("heading", { name: /404 - page not found/i })
    ).toBeVisible();
  });

  test("manifest/robots/favicon exist", async ({ page }) => {
    const [m, r, f] = await Promise.all([
      page.request.get("/manifest.webmanifest"),
      page.request.get("/robots.txt"),
      page.request.get("/favicon.ico"),
    ]);
    expect(m.ok()).toBeTruthy();
    expect(r.ok()).toBeTruthy();
    expect(f.ok()).toBeTruthy();
  });

  test("pages have essential meta tags", async ({ baseURL, page }) => {
    for (const path of pagesToTest) {
      await page.goto(`${baseURL}${path}`);

      const title = await page.title();
      expect(title).toMatch(/diffuse prime/i);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description).toBeDefined();

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle).toBeDefined();

      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(ogDescription).toBeDefined();

      const twitterCard = page.locator('meta[name="twitter:card"]');
      await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

      const twitterTitle = await page
        .locator('meta[name="twitter:title"]')
        .getAttribute("content");
      expect(twitterTitle).toBeDefined();

      const twitterDescription = await page
        .locator('meta[name="twitter:description"]')
        .getAttribute("content");
      expect(twitterDescription).toBeDefined();
    }
  });

  test("navigation works", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend`);

    await page.getByRole("link", { name: /borrow/i }).click();
    await expect(page).toHaveURL(/\/borrow$/);
    await expect(page.getByRole("heading", { name: /borrow/i })).toBeVisible();

    await page.getByRole("link", { name: /borrow positions/i }).click();
    await expect(page).toHaveURL(/\/borrow\/my-positions$/);
    await expect(
      page.getByRole("heading", { name: /my borrow positions/i })
    ).toBeVisible();
  });

  test("dark mode toggle works", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend`);

    const darkModeToggle = page.getByLabel("Switch to dark theme");
    const root = page.locator("html");

    await expect(root).not.toHaveClass(/dark/);
    await darkModeToggle.click();

    await expect(root).toHaveClass(/dark/);

    const lightModeToggle = page.getByLabel("Switch to light theme");
    await lightModeToggle.click();
    await expect(root).not.toHaveClass(/dark/);
  });

  test("dark mode persists across reload", async ({ baseURL, page }) => {
    await page.goto(`${baseURL}/lend`);
    await page.getByLabel(/Switch to dark theme/i).click();

    await page.reload();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("basic a11y roles exist on main pages", async ({ baseURL, page }) => {
    for (const path of pagesToTest) {
      await page.goto(`${baseURL}${path}`);

      const main = page.getByRole("main");
      await expect(main).toBeVisible();

      const navigation = page.getByRole("navigation", { name: /site navigation/i });
      await expect(navigation).toBeVisible();

      const banner = page.getByRole("banner");
      await expect(banner).toBeVisible();
    }
  });
});
