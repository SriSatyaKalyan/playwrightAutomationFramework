const { expect } = require("@playwright/test");

class HomePage {
	constructor(page) {
		this.page = page;
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
}

module.exports = { HomePage };
