const { test, expect } = require("@playwright/test");
const { assert } = require("console");
const exp = require("constants");

test("Add Items to Wishlist - Search Page", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Search for Strength Band Kit
	await page
		.getByPlaceholder("Search entire store here...")
		.fill("Harmony Lumaflex Strength Band Kit");

	//Hit Enter and verify that Leggings are displayed
	await page.keyboard.press("Enter");

	//Here, instead of getting the nth(i) element, we should instead search the elements and then decide the i
	//Chaining locators
	await page.locator("//div[@class='product-item-info']").nth(1).hover();

	await page.locator("//a[@title='Add to Wish List']").nth(1).click();

	await page
		.locator("//input[@name='login[username]']")
		.fill("liam.k@mail.com");
	await page.locator("//input[@name='login[password]']").fill("MediP@ss");
	await page.locator("//button[@name='send']").first().click();

	await expect(page).toHaveTitle("My Wish List");

	await expect(
		page.getByText("Harmony Lumaflex&trade; Strength Band Kit").first()
	).toBeVisible();
});

test.only("Add Items to Wishlist - Item Page", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Search for Cruise Dual Analog Watch
	await page
		.getByPlaceholder("Search entire store here...")
		.fill("Cruise Dual Analog Watch");

	//Hit Enter and verify that Watches are displayed
	await page.keyboard.press("Enter");

	await page
		.locator(
			"//a[@href='https://magento.softwaretestingboard.com/dash-digital-watch.html']"
		)
		.first()
		.click();

	// await page.pause();
	await page.waitForTimeout(2_000);
	await page
		// .locator("//div[@class='product-social-links']")
		.locator("//a[@class='action towishlist']")
		.click();

	await page
		.locator("//input[@name='login[username]']")
		.fill("liam.k@mail.com");
	await page.locator("//input[@name='login[password]']").fill("MediP@ss");
	await page.locator("//button[@name='send']").first().click();

	await expect(page).toHaveTitle("My Wish List");

	await expect(page.getByText("Dash Digital Watch").first()).toBeVisible();

	// await page.pause();
});

// test("Add Reviews to Items", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });

// test("Compare Products - Add To Compare", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });

// test("Increase Items per Page Count", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });
