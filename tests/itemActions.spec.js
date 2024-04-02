const { test, expect } = require("@playwright/test");
const { pageObjectManager } = require("../pageObjects/pageObjectManager");

// Annotate entire file as serial.
test.describe.configure({ mode: "serial" });

test("Add Items to Wishlist - Search Page", async ({ page }) => {
	console.log("Add Items to Wishlist - Search Page");
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const loginPage = pageManager.getLoginPage();
	const wishListPage = pageManager.getWishListPage();

	await homePage.goToHomePage();

	await homePage.searchForProduct("Harmony Lumaflex Strength Band Kit");
	await homePage.addToWishList();

	await loginPage.loginAction();
	await wishListPage.validateLandingOnWishListPage();
	await wishListPage.checkItemInWishList(
		"Harmony Lumaflex&trade; Strength Band Kit"
	);
});

test("Add Items to Wishlist - Item Page", async ({ page }) => {
	console.log("Add Items to Wishlist - Item Page");
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const loginPage = pageManager.getLoginPage();
	const wishListPage = pageManager.getWishListPage();

	await homePage.goToHomePage();
	await homePage.searchForProduct("Cruise Dual Analog Watch");
	await homePage.addToWishListViaItem();

	await loginPage.loginAction();

	await wishListPage.validateLandingOnWishListPage();
	await wishListPage.checkItemInWishList("Dash Digital Watch");
});

test("Clear Items in Wish List", async ({ page }) => {
	console.log("Clear Items in Wish List");
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const loginPage = pageManager.getLoginPage();
	const wishListPage = pageManager.getWishListPage();

	await homePage.goToHomePage();
	await homePage.goToWishListPage();

	await loginPage.loginAction();

	await wishListPage.validateLandingOnWishListPage();
	if (await wishListPage.wishListToolbar.isVisible()) {
		let wishListItemCount = await wishListPage.getWishListItemCount();
		wishListItemCount = wishListItemCount.substring(1, 2);

		console.log(
			"The number of items in the Wish List are: " + wishListItemCount
		);
		await wishListPage.clearWishList(wishListItemCount);
	} else {
		console.log("The number of items in the Wish List are: 0");
	}

	await expect(wishListPage.wishListEmptyAlert).toBeVisible();
});

test("Compare Products - Add To Compare", async ({ page }) => {
	console.log("Compare Products - Add To Compare");
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const wishListPage = pageManager.getWishListPage();

	await homePage.goToHomePage();

	await homePage.searchForProduct("Tote");
	await homePage.addToCompareList(0);
	await homePage.addToCompareList(1);

	await homePage.compareActionButton.click();
	await wishListPage.validateLandingOnComparisonPage();
});

test.only("Skipping Rating when providing Review", async ({ page }) => {
	console.log("Skipping Rating when providing Review");
	const pageManager = new pageObjectManager(page);
	const itemPage = pageManager.getItemPage();

	await itemPage.navigateToItemPage("affirm-water-bottle");
	await itemPage.clickOnReviews();
	await itemPage.checkForReviewText(
		"Wide mouth opening makes it easy to clean!"
	);

	//Started to provide own review
	// await page.waitForTimeout(1_000);
	// await page.locator("//label[@id='Rating_4_label']").click();

	await itemPage.nicknameField.fill("Liam");
	await itemPage.summaryField.fill("Good Bottle");
	await itemPage.reviewField.fill(
		"Liked the bottle but would like a bigger one lol."
	);
	await itemPage.submitButton.click();

	await itemPage.missedRatingAlert();
});

test("Increase Items per Page Count", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	await page.goto(
		"https://magento.softwaretestingboard.com/women/bottoms-women.html"
	);

	let pageCount = await page
		.locator("//select[@data-role='limiter']")
		.locator("//option[@selected='selected']")
		.nth(1)
		.textContent();
	console.log("The pageCount is: " + pageCount);

	let productCount = await page
		.locator("//img[@class='product-image-photo']")
		.count();
	console.log("The productCount is: " + productCount);

	console.log(
		"Are the page and product counts equal?: " + (productCount == pageCount)
	);

	await page.goto(
		"https://magento.softwaretestingboard.com/women/bottoms-women.html?product_list_limit=24"
	);

	pageCount = await page
		.locator("//select[@data-role='limiter']")
		.locator("//option[@selected='selected']")
		.nth(1)
		.textContent();
	console.log("The pageCount is: " + pageCount);

	productCount = await page
		.locator("//img[@class='product-image-photo']")
		.count();
	console.log("The productCount is: " + productCount);

	console.log(
		"Are the page and product counts equal?: " + (productCount == pageCount)
	);

	//changing the number of elements
	// await page
	// 	.locator("//select[@data-role='limiter']")
	// 	.nth(1)
	// 	.locator("//option[@value='24']")
	// 	.nth(1)
	// 	.click();
});
