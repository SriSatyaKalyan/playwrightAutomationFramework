const { expect } = require("@playwright/test");

class SignInPage {
	constructor(page) {
		this.page = page;
		this.createNewAccount = page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/customer/account/create/']"
			)
			.first();
		this.alertLocator = page.locator(
			"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
		);
	}

	async createNewAccountButton() {
		await this.createNewAccount.click();
	}

	async checkPresenceOfAlert(num) {
		await expect(this.alertLocator).toHaveCount(num);
	}

	async checkAlertContentToContain(string) {
		await expect(this.alertLocator).toBeVisible();
		console.log(await this.alertLocator.textContent());
		await expect(this.alertLocator).toContainText(string);
	}

	async validateLandingOnSignInPage() {
		// Wait for a unique element on the sign-in page (e.g., email input)
		const emailInput = this.page.locator(
			"//input[@name='login[username]']"
		);
		await emailInput.waitFor({ state: "visible", timeout: 5000 });

		// Now check the title
		const title = await this.page.title();
		console.log("SignIn page title:", title);
		await expect(this.page).toHaveTitle("Customer Login");
	}
}

module.exports = { SignInPage };
