const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { Given, When, Then } = require("@cucumber/cucumber");
const { pageObjectManager } = require("../../pageObjects/pageObjectManager");

Given(
	"User has navigated to the homepage",
	{ timeout: 100000 },
	async function () {
		const browser = await playwright.chromium.launch();
		const context = await browser.newContext();
		this.page = await context.newPage();

		const pageManager = new pageObjectManager(this.page);
		this.loginPage = pageManager.getLoginPage();

		await this.loginPage.goToHomePage();
	}
);

When(
	"User tries to perform invalid signin with {string} and {string}",
	async function (usermail, password) {
		this.loginPage.validateLandingOnSignInPage();

		const alertLocator =
			"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']";

		this.alert = this.page.locator(alertLocator);
		await expect(this.alert).toHaveCount(0);
		this.loginPage.loginAction(usermail, password);
	}
);

Then("User sees appropriate error message", async function () {
	await expect(this.alert).toHaveCount(1);
	await expect(this.alert).toBeVisible();
	console.log(await this.alert.textContent());

	expect(this.alert).toContainText("incorrect");
});
