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

// Have to use children icons here
test("Nav Bar Dropdowns - Women", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	// Hovering over Womens navbar button
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women.html']"
		)
	).toContainText("Women");

	//Checking the presence of first option in Women dropdown
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/tops-women.html']"
			)
			.first()
	).toContainText("Tops");

	// Checking the presence of second option in Women dropdown
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women.html']"
			)
			.first()
	).toContainText("Bottoms");

	//Checking presence of Jackets, Hoodies and Sweatshirts, Tees and Bras and Tanks in the Women >> Tops section
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/jackets-women.html']"
			)
			.first()
	).toContainText("Jackets");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/hoodies-and-sweatshirts-women.html']"
			)
			.first()
	).toContainText("Hoodies & Sweatshirts");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/tees-women.html']"
			)
			.first()
	).toContainText("Tees");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/tanks-women.html']"
			)
			.first()
	).toContainText("Bras & Tanks");

	//Checking presence of Tanks and Bottoms in the Women >> Bottoms section
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women/pants-women.html']"
			)
			.first()
	).toContainText("Pants");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women/shorts-women.html']"
			)
			.first()
	).toContainText("Shorts");
});

test("Nav Bar Dropdowns - Men", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Checking the presence of Men dropdown
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men.html']"
		)
	).toContainText("Men");

	//Checking the presence of first option in Men dropdown
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men.html']"
		)
	).toContainText("Tops");

	//Checking the presence of second option in Men dropdown
	await expect(
		page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men.html']"
		)
	).toContainText("Bottoms");

	//Checking presence of Jackets, Hoodies and Sweatshirts, Tees and Bras and Tanks in the Men >> Tops section
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html']"
			)
			.first()
	).toContainText("Jackets");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/hoodies-and-sweatshirts-men.html']"
			)
			.first()
	).toContainText("Hoodies & Sweatshirts");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/tees-men.html']"
			)
			.first()
	).toContainText("Tees");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/tanks-men.html']"
			)
			.first()
	).toContainText("Tanks");

	//Checking presence of Tanks and Bottoms in the Men >> Bottoms section
	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men/pants-men.html']"
			)
			.first()
	).toContainText("Pants");

	await expect(
		page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men/shorts-men.html']"
			)
			.first()
	).toContainText("Shorts");
});
