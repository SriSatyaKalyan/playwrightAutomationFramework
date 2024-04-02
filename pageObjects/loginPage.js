const { expect } = require("@playwright/test");

class LoginPage {
	constructor(page) {
		this.page = page;
		this.username = page.locator("//input[@name='login[username]']");
		this.password = page.locator("//input[@name='login[password]']");
		this.signInSubmit = page.locator("//button[@name='send']");
		this.signInPageButton = page
			.locator("//li[@class='authorization-link']")
			.first();
		this.alertLocator = page.locator(
			"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
		);
	}

	async goToSignInPage() {
		await this.signInPageButton.click();
	}

	async loginAction(username = "liam.k@mail.com", password = "MediP@ss") {
		await this.username.fill(username);
		await this.password.fill(password);
		await this.signInSubmit.first().click();
	}
}

module.exports = { LoginPage };
