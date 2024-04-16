const { test, expect } = require("@playwright/test");
const { pageObjectManager } = require("../pageObjects/pageObjectManager");

test("Nav Bar Content Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await expect(homePage.whatsNew).toContainText("What's New");
	await expect(homePage.women).toContainText("Women");
	await expect(homePage.men).toContainText("Men");
	await expect(homePage.gear).toContainText("Gear");
	await expect(homePage.training).toContainText("Training");
	await expect(homePage.sale).toContainText("Sale");
});

// Have to use children icons here
test("Nav Bar Dropdowns - Women", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const womenPage = pageManager.getWomenPage();

	await homePage.goToHomePage();

	// Hovering over Womens navbar button
	await expect(homePage.women).toContainText("Women");
	//Checking the presence of first option in Women dropdown
	await expect(womenPage.womenTops.first()).toContainText("Tops");
	// Checking the presence of second option in Women dropdown
	await expect(womenPage.womenBottoms.first()).toContainText("Bottoms");
	//Checking presence of Jackets, Hoodies and Sweatshirts, Tees and Bras and Tanks in the Women >> Tops section
	await expect(womenPage.womenJackets.first()).toContainText("Jackets");
	await expect(womenPage.womenHoodies.first()).toContainText(
		"Hoodies & Sweatshirts"
	);
	await expect(womenPage.womenTees.first()).toContainText("Tees");
	await expect(womenPage.womenTanks.first()).toContainText("Bras & Tanks");
	//Checking presence of Tanks and Bottoms in the Women >> Bottoms section
	await expect(womenPage.womenPants.first()).toContainText("Pants");
	await expect(womenPage.womenShorts.first()).toContainText("Shorts");
});

test("Nav Bar Dropdowns - Men", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();
	const menPage = pageManager.getMenPage();

	await homePage.goToHomePage();

	//Checking the presence of Men dropdown
	await expect(homePage.men).toContainText("Men");
	//Checking the presence of first option in Men dropdown
	await expect(menPage.menTops).toContainText("Tops");
	//Checking the presence of second option in Men dropdown
	await expect(menPage.menBottoms).toContainText("Bottoms");
	//Checking presence of Jackets, Hoodies and Sweatshirts, Tees and Bras and Tanks in the Men >> Tops section
	await expect(menPage.menJackets.first()).toContainText("Jackets");
	await expect(menPage.menHoodies.first()).toContainText(
		"Hoodies & Sweatshirts"
	);
	await expect(menPage.menTees.first()).toContainText("Tees");
	await expect(menPage.menTanks.first()).toContainText("Tanks");
	//Checking presence of Tanks and Bottoms in the Men >> Bottoms section
	await expect(menPage.menPants.first()).toContainText("Pants");
	await expect(menPage.menShorts.first()).toContainText("Shorts");
});
