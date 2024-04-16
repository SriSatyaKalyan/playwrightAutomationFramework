const { Before, After } = require("@cucumber/cucumber");
const playwright = require("@playwright/test");

const { pageObjectManager } = require("../../pageObjects/pageObjectManager");

Before(async function () {
	console.log("Opening the driver");
	const browser = await playwright.chromium.launch({
		// headless: false, // Making sure we are running the headless mode set to false
		args: ["--start-maximized"],
	});

	const context = await browser.newContext();
	this.page = await context.newPage();
	this.pageManager = new pageObjectManager(this.page);
});

After(function () {
	console.log("Quitting the driver");
});
