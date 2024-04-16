const { expect } = require("@playwright/test");

class CreateAccountPage {
	constructor(page) {
		this.page = page;
		this.createAccountButton = page.locator(
			"//button[@title='Create an Account']"
		);

		this.invalidUsername = "jai@mail.com";
		this.invalidPassword = "p@sswor!d";

		this.firstNameField = page.locator("//input[@id='firstname']");
		this.lastNameField = page.locator("//input[@id='lastname']");
		this.emailAddressField = page.locator("//input[@id='email_address']");
		this.passwordField = page.locator("//input[@id='password']");
		this.passwordConfirmationField = page.locator(
			"//input[@id='password-confirmation']"
		);
		this.passwordStrengthMeter = page
			.locator("//span[@id='password-strength-meter-label']")
			.first();

		this.firstNameError = page.locator("//div[@id='firstname-error']");
		this.lastNameError = page.locator("//div[@id='lastname-error']");
		this.lastNameError = page.locator("//div[@id='lastname-error']");
		this.emailAddressError = page.locator(
			"//div[@id='email_address-error']"
		);
		this.passwordError = page.locator("//div[@id='password-error']");
		this.passwordConfirmationError = page.locator(
			"//div[@id='password-confirmation-error']"
		);
		this.requiredFieldText = "This is a required field.";
	}

	async validateLandingOnAccountPage() {
		//Printing the title of the Account page
		console.log(await this.page.title());
		await expect(this.page).toHaveTitle("Create New Customer Account");
	}
}

module.exports = { CreateAccountPage };
