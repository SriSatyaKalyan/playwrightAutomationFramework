const { test, expect } = require("@playwright/test");
// Annotate entire file as serial.
test.describe.configure({ mode: "serial" });

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

test("Add Items to Wishlist - Item Page", async ({ browser }) => {
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
});

test("Clear Items in Wish List", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	await page.goto(
		"https://magento.softwaretestingboard.com/wishlist/index/index/"
	);

	await page
		.locator("//input[@name='login[username]']")
		.fill("liam.k@mail.com");
	await page.locator("//input[@name='login[password]']").fill("MediP@ss");
	await page.locator("//button[@name='send']").first().click();

	await expect(page).toHaveTitle("My Wish List");
	let noOfItems = await page
		.locator("//span[@class='toolbar-number']")
		.first()
		.textContent();

	noOfItems = noOfItems.substring(1, 2);
	console.log("The number of items in the Wish List are: " + noOfItems);

	for (let i = 0; i < noOfItems; i++) {
		await page.locator("//div[@class='product-item-info']").first().hover();
		await page.waitForTimeout(3_000);
		await page.locator("//a[@data-role='remove']").first().click();
	}

	await expect(
		page.locator("//div[@class='message info empty']")
	).toBeVisible();
});

test("Compare Products - Add To Compare", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Search for Bags and compare them
	await page.getByPlaceholder("Search entire store here...").fill("Tote");

	await page.keyboard.press("Enter");

	await page.locator("//div[@class='product-item-info']").nth(0).hover();
	// await page.waitForTimeout(1_000);
	await page.locator("//a[@class='action tocompare']").nth(0).click();

	await page.locator("//div[@class='product-item-info']").nth(1).hover();
	// await page.waitForTimeout(1_000);
	await page.locator("//a[@class='action tocompare']").nth(1).click();

	await page.locator("//a[@class='action compare']").click();

	await expect(page).toHaveTitle(
		"Products Comparison List - Magento Commerce"
	);

	await expect(page.getByText("Compare Products").first()).toBeVisible();
});

// test("Add Reviews to Items", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });

// test("Increase Items per Page Count", async ({ browser }) => {
// 	const context = await browser.newContext();
// 	const page = await context.newPage();

// 	await page.goto("https://magento.softwaretestingboard.com/");
// });
