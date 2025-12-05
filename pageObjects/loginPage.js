// author: kalyan kallepalli
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
		console.log("The sign in page is: ", await this.page.title());
		await this.signInPageButton.waitFor({
			state: "visible",
			timeout: 5000,
		});
		await this.signInPageButton.click();
	}

	async loginAction(username = "tony.stark@mail.com", password = "MediP@ss") {
		await this.username.fill(username);
		await this.password.fill(password);
		await this.signInSubmit.first().click();
	}
}

module.exports = { LoginPage };
