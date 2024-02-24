const { test, expect } = require("@playwright/test");

test("First Playwright Test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://magento.softwaretestingboard.com/");
});
