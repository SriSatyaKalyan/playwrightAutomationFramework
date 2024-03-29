const { expect } = require("@playwright/test");

class WomensPage {
	constructor(page) {
		this.page = page;
		this.womenTops = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/tops-women.html']"
		);
		this.womenBottoms = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women.html']"
		);
		this.womenJackets = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/jackets-women.html']"
		);
		this.womenHoodies = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/hoodies-and-sweatshirts-women.html']"
		);
		this.womenTees = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/tees-women.html']"
		);
		this.womenTanks = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/tops-women/tanks-women.html']"
		);
		this.womenPants = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women/pants-women.html']"
		);
		this.womenShorts = page.locator(
			"//a[@href='https://magento.softwaretestingboard.com/women/bottoms-women/shorts-women.html']"
		);
	}
}

module.exports = { WomensPage };
