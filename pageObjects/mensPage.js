const { expect } = require("@playwright/test");

class MensPage {
	constructor(page) {
		this.page = page;
		this.menTops = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men.html']"
		);
		this.menBottoms = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men.html']"
		);
		this.menJackets = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html']"
		);
		this.menHoodies = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/hoodies-and-sweatshirts-men.html']"
		);
		this.menTees = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/tees-men.html']"
		);
		this.menTanks = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/tops-men/tanks-men.html']"
		);
		this.menPants = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men/pants-men.html']"
		);
		this.menShorts = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/men/bottoms-men/shorts-men.html']"
		);
	}
}

module.exports = { MensPage };
