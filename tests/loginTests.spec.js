const { test, expect } = require("@playwright/test");
const { customTest } = require("../utils/testBase");

const { pageObjectManager } = require("../pageObjects/pageObjectManager");
const dataset = JSON.parse(JSON.stringify(require("../utils/testData.json")));

test("Home Page Title Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();

	await loginPage.goToHomePage();
	await loginPage.validateLandingOnHomePage();
});

test("Sign In Page Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();

	await loginPage.goToHomePage();
	await loginPage.validateLandingOnSignInPage();
});

test("Invalid Sign In Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();

	loginPage.goToHomePage();
	loginPage.goToSignInPage();
	loginPage.validateLandingOnSignInPage();

	const alertLocator =
		"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']";

	const alert = page.locator(alertLocator);
	await expect(alert).toHaveCount(0);

	const username = "jai@mail.com";
	const password = "p@sswor!d";

	loginPage.loginAction(username, password);

	await expect(alert).toHaveCount(1);
	await expect(alert).toBeVisible();
	console.log(await alert.textContent());
	await expect(alert).toContainText("incorrect");
});

test("Check Mandatory Required Fields", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const pageManager = new pageObjectManager(page);
	const loginPage = pageManager.getLoginPage();
	const signInPage = pageManager.getSignInPage();

	const firstNameError = "//div[@id='firstname-error']";
	const lastNameError = "//div[@id='lastname-error']";
	const emailAddressError = "//div[@id='email_address-error']";
	const passwordError = "//div[@id='password-error']";
	const passwordConfirmationError =
		"//div[@id='password-confirmation-error']";

	const requiredFieldText = "This is a required field.";

	await loginPage.goToHomePage();
	await signInPage.createNewAccountButton();

	console.log(await page.title());
	await expect(page).toHaveTitle("Create New Customer Account");

	await page.locator("//button[@title='Create an Account']").click();

	await expect(page.locator(firstNameError)).toHaveText(requiredFieldText);
	await expect(page.locator(lastNameError)).toHaveText(requiredFieldText);
	await expect(page.locator(emailAddressError)).toHaveText(requiredFieldText);
	await expect(page.locator(passwordError)).toHaveText(requiredFieldText);
	await expect(page.locator(passwordConfirmationError)).toHaveText(
		requiredFieldText
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
