const { test, expect } = require("@playwright/test");
const exp = require("constants");

test("Home Page Title Test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://magento.softwaretestingboard.com/");

  //Printing the title of the Landing page
  console.log(await page.title());
  await expect(page).toHaveTitle("Home Page");
});

test("Sign In Page Test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://magento.softwaretestingboard.com/");
  await page.locator("//li[@class='authorization-link']").first().click();
  console.log(await page.title());
});

test("Invalid Sign In Test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://magento.softwaretestingboard.com/");
  await page.locator("//li[@class='authorization-link']").first().click();

  const alert = page.locator(
    "//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
  );
  await expect(alert).toHaveCount(0);

  await page.locator("//input[@name='login[username]']").fill("jai@mail.com");
  await page.locator("//input[@name='login[password]']").fill("p@sswor!d");
  await page.locator("//button[@name='send']").first().click();

  await expect(alert).toHaveCount(1);
  await expect(alert).toBeVisible();
  console.log(await alert.textContent());
  await expect(alert).toContainText("incorrect");
});
