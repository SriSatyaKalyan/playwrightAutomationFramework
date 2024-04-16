const { expect } = require("@playwright/test");
const { Given, When, Then } = require("@cucumber/cucumber");

Given(
	"User has navigated to the homepage",
	{ timeout: 100000 },
	async function () {
		this.loginPage = this.pageManager.getLoginPage();
		this.homePage = this.pageManager.getHomePage();
		this.signInPage = this.pageManager.getSignInPage();

		await this.homePage.goToHomePage();
	}
);

When(
	"User tries to perform invalid signin with {string} and {string}",
	async function (usermail, password) {
		// this.signInPage.validateLandingOnSignInPage();
		await this.homePage.validateLandingOnHomePage();
		await this.loginPage.goToSignInPage();

		const alertLocator =
			"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']";

		this.alert = this.page.locator(alertLocator);
		await expect(this.alert).toHaveCount(0);
		this.loginPage.loginAction(usermail, password);
	}
);

Then("User sees appropriate error message", async function () {
	await this.page.waitForLoadState("networkidle");
	await expect(this.alert).toHaveCount(1);
	await expect(this.alert).toBeVisible();
	console.log(await this.alert.textContent());

	expect(this.alert).toContainText("incorrect");
});

Then(
	"User sees appropriate welcome message",
	{ timeout: 100000 },
	async function () {
		await this.page.waitForLoadState("networkidle");
		await this.homePage.validateLandingOnHomePage();
		await this.homePage.validateWelcomeMessage("Liam Konisegg");
	}
);

Given("User wants to create a new account", async function () {
	await console.log("User wants to create a new account");
	this.loginPage = this.pageManager.getLoginPage();
	this.homePage = this.pageManager.getHomePage();
	this.signInPage = this.pageManager.getSignInPage();
	this.accountPage = this.pageManager.getAccountPage();

	await this.homePage.goToHomePage();
	await this.signInPage.createNewAccountButton();
	await this.accountPage.validateLandingOnAccountPage();
});

Given(
	"User enters credentials {string}, {string}, {string}, {string}",
	async function (firstName, lastName, emailAddress, password) {
		console.log(
			"User enters credentials firstName: " +
				firstName +
				" , lastName: " +
				lastName +
				" , emailAddress: " +
				emailAddress +
				" , password: " +
				password
		);
		await this.accountPage.firstNameField.fill(firstName);
		await this.accountPage.lastNameField.fill(lastName);
		await this.accountPage.emailAddressField.fill(emailAddress);
		await this.accountPage.passwordField.type(password);
	}
);

When(
	"User re-enters the passwordConfirmation with {string}",
	async function (password) {
		console.log(
			"User re-enters the passwordConfirmation with password: " + password
		);
		await this.accountPage.passwordConfirmationField.type(password);
	}
);

Then(
	"User sees appropriate data {string} message",
	{ timeout: 100000 },
	async function (strength) {
		console.log("User sees appropriate data strength message: " + strength);
		await this.page.waitForTimeout(2_000);
		await expect(this.accountPage.passwordStrengthMeter).toContainText(
			strength
		);
	}
);
