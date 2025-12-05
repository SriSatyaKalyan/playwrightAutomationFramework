const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageObjects/loginPage");
const { SignInPage } = require("../pageObjects/signInPage");

test("Purchasing Item without specs", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const loginPage = new LoginPage(page);

	//Travel to Sprite Yoga Straps
	await page.goto(
		"https://magento.softwaretestingboard.com/set-of-sprite-yoga-straps.html"
	);

	await page.locator("//button[@title='Add to Cart']").click();

	await expect(
		page.locator("//div[@id='super_group[35]-error']")
	).toContainText("Please specify the quantity of product(s).");
});
