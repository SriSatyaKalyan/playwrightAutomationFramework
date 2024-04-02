const { test, expect } = require("@playwright/test");
const { customTest } = require("../utils/testBase");

const { pageObjectManager } = require("../pageObjects/pageObjectManager");
const dataset = JSON.parse(JSON.stringify(require("../utils/testData.json")));

test("Home Page Title Test", async ({ page }) => {
	console.log("Home Page Title Test");
	const pageManager = new pageObjectManager(page);
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await homePage.validateLandingOnHomePage();
});

test("Sign In Page Test", async ({ page }) => {
	console.log("Sign In Page Test");

	const pageManager = new pageObjectManager(page);
	const signInPage = pageManager.getSignInPage();
	const loginPage = pageManager.getLoginPage();
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await loginPage.goToSignInPage();
	await signInPage.validateLandingOnSignInPage();
});

test("Invalid Sign In Test", async ({ page }) => {
	console.log("Invalid Sign In Test");

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();
	const signInPage = pageManager.getSignInPage();
	const accountPage = pageManager.getAccountPage();
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await loginPage.goToSignInPage();
	await signInPage.validateLandingOnSignInPage();

	await signInPage.checkPresenceOfAlert(0);

	await loginPage.loginAction(
		accountPage.invalidUsername,
		accountPage.invalidPassword
	);

	await signInPage.checkPresenceOfAlert(1);
	await signInPage.checkAlertContentToContain(
		"The account sign-in was incorrect or your account is disabled temporarily"
	);
});

test("Check Mandatory Required Fields", async ({ page }) => {
	const pageManager = new pageObjectManager(page);
	const signInPage = pageManager.getSignInPage();
	const accountPage = pageManager.getAccountPage();
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await signInPage.createNewAccountButton();
	await accountPage.validateLandingOnAccountPage();

	await accountPage.createAccountButton.click();

	await expect(accountPage.firstNameError).toHaveText(
		accountPage.requiredFieldText
	);
	await expect(accountPage.lastNameError).toHaveText(
		accountPage.requiredFieldText
	);
	await expect(accountPage.emailAddressError).toHaveText(
		accountPage.requiredFieldText
	);
	await expect(accountPage.passwordError).toHaveText(
		accountPage.requiredFieldText
	);
	await expect(accountPage.passwordConfirmationError).toHaveText(
		accountPage.requiredFieldText
	);
});

for (const data of dataset) {
	test(`Create Account With "${data.strength}" Strength Password Test`, async ({
		page,
	}) => {
		const pageManager = new pageObjectManager(page);
		const signInPage = pageManager.getSignInPage();
		const accountPage = pageManager.getAccountPage();
		const homePage = pageManager.getHomePage();

		await homePage.goToHomePage();
		await signInPage.createNewAccountButton();
		await accountPage.validateLandingOnAccountPage();

		await accountPage.firstNameField.fill(data.firstName);
		await accountPage.lastNameField.fill(data.lastName);
		await accountPage.emailAddressField.fill(data.emailAddress);
		await accountPage.passwordField.fill(data.password);
		await accountPage.passwordConfirmationField.fill(data.password);

		await page.waitForTimeout(2_000);
		await expect(accountPage.passwordStrengthMeter).toContainText(
			data.strength
		);
	});
}

customTest("Successful Login Test", async ({ page, testDataForSignIn }) => {
	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();
	const signInPage = pageManager.getSignInPage();
	const homePage = pageManager.getHomePage();

	await homePage.goToHomePage();
	await loginPage.goToSignInPage();

	await signInPage.checkPresenceOfAlert(0);

	await loginPage.username.fill(testDataForSignIn.emailAddress);
	await loginPage.password.fill(testDataForSignIn.password);
	await loginPage.signInSubmit.first().click();

	await homePage.validateLandingOnHomePage();
	await homePage.validateWelcomeMessage("Liam Konisegg");
});
