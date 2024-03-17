const { expect } = require("@playwright/test");

class SignInPage {
	constructor(page) {
		this.page = page;
		this.createNewAccount = page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/customer/account/create/']"
			)
			.first();
	}

	async createNewAccountButton() {
		await this.createNewAccount.click();
	}
}

module.exports = { SignInPage };
