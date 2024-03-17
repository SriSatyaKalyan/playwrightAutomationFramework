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
	}

	async goToHomePage() {
		await this.page.goto("https://magento.softwaretestingboard.com/");
	}

	async validateLandingOnHomePage() {
		//Printing the title of the Landing page
		console.log(await this.page.title());
		await expect(this.page).toHaveTitle("Home Page");
	}

	async goToSignInPage() {
		await this.signInPageButton.click();
	}

	async validateLandingOnSignInPage() {
		await this.signInPageButton.click();
	}

	async loginAction(username, password) {
		await this.username.fill(username);
		await this.password.fill(password);
		await this.signInSubmit.first().click();
	}
}

module.exports = { LoginPage };
