// author: kalyan kallepalli
const { test, expect } = require("@playwright/test");
const exp = require("constants");

// THIS TEST CAN BE PARAMETERIZED FOR OTHER SEARCH OPTIONS AS WELL
test("Search For Items - Hit Enter", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Search Bar
	await page.getByPlaceholder("Search entire store here...").fill("Leggings");
	await page.keyboard.press("Enter");

	await expect(
		page.locator("//span[@data-ui-id='page-title-wrapper']")
	).toContainText("Search results for: 'Leggings'");
});

//We cannot click the SEARCH ICON as it is being disabled

// test.only("Search For Items - Hit Search Icon", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");

// 	//Search Bar
// 	await page.getByPlaceholder("Search entire store here...").fill("Jackets");
// 	await page.locator("//*[@id='search_mini_form']").click();

// 	await expect(
// 		page.locator("//span[@data-ui-id='page-title-wrapper']")
// 	).toContainText("Search results for: 'Jackets'");
// });

test("Cart has no items", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	await page.locator(
		"//a[@href='https://magento.softwaretestingboard.com/checkout/cart/']"
	).click;

	await expect(
		page.locator("//*[@id='minicart-content-wrapper']/div[2]")
	).toContainText("You have no items in your shopping cart.");
});

// test("Filter By Category", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });

//Clicking on Notes takes us to another page. Use Promise.all command to handle this
// test("Footer Items", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });
