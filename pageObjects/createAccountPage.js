const { expect } = require("@playwright/test");

class CreateAccountPage {
	constructor(page) {
		this.page = page;
		this.createAccountButton = page.locator(
			"//button[@title='Create an Account']"
		);
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
