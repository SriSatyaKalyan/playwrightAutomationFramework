const { test, expect } = require("@playwright/test");
const exp = require("constants");

// THIS TEST CAN BE PARAMETERIZED FOR OTHER SEARCH OPTIONS AS WELL
test.only("End To End - Purchase Leggings", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	//Go to Home Page
	await page.goto("https://magento.softwaretestingboard.com/");

	//Search for leggings
	await page.getByPlaceholder("Search entire store here...").fill("Leggings");

	//Hit Enter and verify that Leggings are displayed
	await page.keyboard.press("Enter");

	await expect(
		page.locator("//span[@data-ui-id='page-title-wrapper']")
	).toContainText("Search results for: 'Leggings'");

	//Verify more than three items are present on the page
	await expect(
		page.locator("//li[@class='item product product-item']")
	).toHaveCount(4);

	//Verify presence of Sahara Leggings, Emma Leggings, Bardot Capri and Aeon Capri on the page
	await expect(
		page.locator("//li[@class='item product product-item']").first()
	).toContainText("Sahara Leggings");

	await expect(
		page.locator("//li[@class='item product product-item']").nth(1)
	).toContainText("Emma Leggings");

	await expect(
		page.locator("//li[@class='item product product-item']").nth(2)
	).toContainText("Bardot Capri");

	await expect(
		page.locator("//li[@class='item product product-item']").nth(3)
	).toContainText("Aeon Capri");

	//Verify Cart is empty
	await page.locator(
		"//a[@href='https://magento.softwaretestingboard.com/checkout/cart/']"
	).click;

	await expect(
		page.locator("//*[@id='minicart-content-wrapper']/div[2]")
	).toContainText("You have no items in your shopping cart.");

	//Select Sahara Leggings and add to Cart
	await page
		.locator("//li[@class='item product product-item']")
		.first()
		.getByText("29")
		.click();

	await page
		.locator("//li[@class='item product product-item']")
		.first()
		.locator("//div[@aria-label='Red']")
		.click();

	await page
		.locator("//li[@class='item product product-item']")
		.first()
		.locator("//button[@title='Add to Cart']")
		.click();

	//Verify Cart has Sahara Leggings
	await page.locator(
		"//a[@href='https://magento.softwaretestingboard.com/checkout/cart/']"
	).click;

	await expect(
		page
			.locator("//*[@id='minicart-content-wrapper']/div[2]")
			.locator("//div[@class='product-item-details']")
	).toContainText("Sahara Leggings");

	//Select Aeon Capri and add to Cart
	await page
		.locator("//li[@class='item product product-item']")
		.nth(3)
		.getByText("28")
		.click();

	await page
		.locator("//li[@class='item product product-item']")
		.nth(3)
		.locator("//div[@aria-label='Black']")
		.click();

	await page
		.locator("//li[@class='item product product-item']")
		.nth(3)
		.locator("//button[@title='Add to Cart']")
		.click();

	//Verify Cart has Aeon Capri
	await page
		.locator(
			"//a[@href='https://magento.softwaretestingboard.com/checkout/cart/']"
		)
		.first()
		.click();

	await expect(
		page
			.locator("//*[@id='minicart-content-wrapper']/div[2]")
			.locator("//div[@class='product-item-details']")
			.first()
	).toContainText("Aeon Capri");

	//Proceeding to Checkout
	await page.locator("//button[@id='top-cart-btn-checkout']").click();

	await expect(page).toHaveTitle("Checkout");
});
