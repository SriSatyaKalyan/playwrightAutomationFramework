const { test, expect } = require("@playwright/test");
const exp = require("constants");

test("Nav Bar Content Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/what-is-new.html']"
		)
	).toContainText("What's New");

	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women.html']"
		)
	).toContainText("Women");
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men.html']"
		)
	).toContainText("Men");
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/gear.html']"
		)
	).toContainText("Gear");
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/training.html']"
		)
	).toContainText("Training");
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/sale.html']"
		)
	).toContainText("Sale");
});
