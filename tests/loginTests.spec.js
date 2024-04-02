const { test, expect } = require("@playwright/test");
const { customTest } = require("../utils/testBase");

const { pageObjectManager } = require("../pageObjects/pageObjectManager");
const dataset = JSON.parse(JSON.stringify(require("../utils/testData.json")));

test("Home Page Title Test", async ({ browser }) => {
	console.log("Home Page Title Test");
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();

	await loginPage.goToHomePage();
	await loginPage.validateLandingOnHomePage();
});

test("Sign In Page Test", async ({ browser }) => {
	console.log("Sign In Page Test");
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();

	await loginPage.goToHomePage();
	await loginPage.validateLandingOnSignInPage();
});

test("Invalid Sign In Test", async ({ browser }) => {
	console.log("Invalid Sign In Test");
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();
	const signInPage = pageManager.getSignInPage();

	await loginPage.goToHomePage();
	await loginPage.goToSignInPage();
	await loginPage.validateLandingOnSignInPage();

	await signInPage.checkPresenceOfAlert(0);

	const invalidUsername = "jai@mail.com";
	const invalidPassword = "p@sswor!d";

	await loginPage.loginAction(invalidUsername, invalidPassword);

	await signInPage.checkPresenceOfAlert(1);
	await signInPage.checkAlertContentToContain(
		"The account sign-in was incorrect or your account is disabled temporarily"
	);
});

test("Check Mandatory Required Fields", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();
	const signInPage = pageManager.getSignInPage();
	const accountPage = pageManager.getAccountPage();

	await loginPage.goToHomePage();
	await signInPage.createNewAccountButton();
	accountPage.validateLandingOnAccountPage();

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
		browser,
	}) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		const pageManager = new pageObjectManager(page);
		const loginPage = pageManager.getLoginPage();
		const signInPage = pageManager.getSignInPage();

		await loginPage.goToHomePage();
		await signInPage.createNewAccountButton();

		console.log(await page.title());
		await expect(page).toHaveTitle("Create New Customer Account");

		const firstNameField = "//input[@id='firstname']";
		const lastNameField = "//input[@id='lastname']";
		const emailAddressField = "//input[@id='email_address']";
		const passwordField = "//input[@id='password']";
		const passwordConfirmationField =
			"//input[@id='password-confirmation']";
		const passwordStrengthMeter = "//div[@id='password-strength-meter']";

		await page.locator(firstNameField).fill(data.firstName);
		await page.locator(lastNameField).fill(data.lastName);
		await page.locator(emailAddressField).fill(data.emailAddress);
		await page.locator(passwordField).fill(data.password);
		await page.locator(passwordConfirmationField).fill(data.password);

		await expect(page.locator(passwordStrengthMeter)).toContainText(
			data.strength
		);
	});
}

customTest("Successful Login Test", async ({ browser, testDataForSignIn }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const homePage = "https://magento.softwaretestingboard.com/";

	await page.goto(homePage);

	// Click on Sign In button
	const signInLink = "//li[@class='authorization-link']";
	await page.locator(signInLink).first().click();

	const alert = page.locator(
		"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
	);
	await expect(alert).toHaveCount(0);

	await page
		.locator("//input[@name='login[username]']")
		.fill(testDataForSignIn.emailAddress);
	await page
		.locator("//input[@name='login[password]']")
		.fill(testDataForSignIn.password);
	await page.locator("//button[@name='send']").first().click();

	const loggedIn = "//span[@class='logged-in']";
	const welcomeMessage = "Welcome, Liam Konisegg!";

	await expect(page).toHaveTitle("Home Page");
	await expect(page.locator(loggedIn).first()).toContainText(welcomeMessage);
});
