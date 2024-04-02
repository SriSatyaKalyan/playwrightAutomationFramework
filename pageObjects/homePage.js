const { expect } = require("@playwright/test");

class HomePage {
	constructor(page) {
		this.page = page;
		this.loggedIn = page.locator("//span[@class='logged-in']").first();
		this.whatsNew = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/what-is-new.html']"
		);
		this.women = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women.html']"
		);
		this.men = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men.html']"
		);
		this.gear = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/gear.html']"
		);
		this.training = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/training.html']"
		);
		this.sale = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/sale.html']"
		);
	}

	async goToHomePage() {
		await this.page.goto("https://magento.softwaretestingboard.com/");
	}

	async validateLandingOnHomePage() {
		//Printing the title of the Landing page
		console.log(await this.page.title());
		await expect(this.page).toHaveTitle("Home Page");
	}

	async validateWelcomeMessage(name) {
		await expect(this.loggedIn).toContainText("Welcome, " + name + "!");
	}
}

module.exports = { HomePage };
