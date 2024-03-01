const { test, expect } = require("@playwright/test");

test("Home Page Title Test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://magento.softwaretestingboard.com/");
  console.log(await page.title());
  await expect(page).toHaveTitle("Home Page");
});
