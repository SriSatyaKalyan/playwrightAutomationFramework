const { expect } = require("@playwright/test");

class HomePage {
	constructor(page) {
		this.page = page;
		this.loggedIn = page.locator("//span[@class='logged-in']").first();
		this.searchBar = page.getByPlaceholder("Search entire store here...");
		// this.hitEnter = page.keyboard.press("Enter");

		this.wishListButtonHomePage = page
			.locator("//a[@title='Add to Wish List']")
			.nth(1);

		this.wishListButtonItemPage = page
			// .locator("//div[@class='product-social-links']")
			.locator("//a[@class='action towishlist']");

		this.addToCompareListButton = page.locator(
			"//a[@class='action tocompare']"
		);
		this.compareActionButton = page.locator("//a[@class='action compare']");

		this.digitalWatch = page
			.locator(
				"//a[@href='https://magento.softwaretestingboard.com/dash-digital-watch.html']"
			)
			.first();
		this.itemInfo = page.locator("//div[@class='product-item-info']");

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

	async goToWishListPage() {
		await this.page.goto(
			"https://magento.softwaretestingboard.com/wishlist/index/index/"
		);
	}

	async goToWomensBottomsPage(){
		await this.page.goto(
			"https://magento.softwaretestingboard.com/women/bottoms-women.html"
		);
	}

	async validateLandingOnHomePage() {
		//Printing the title of the Landing page
		console.log(await this.page.title());
		await expect(this.page).toHaveTitle("Home Page");
	}

	async validateWelcomeMessage(name) {
		await expect(this.loggedIn).toContainText("Welcome, " + name + "!");
	}

	async searchForProduct(item) {
		await this.searchBar.fill(item);
		await this.page.keyboard.press("Enter");
	}

	async addToWishList() {
		//Here, instead of getting the nth(i) element, we should instead search the elements and then decide the i
		//Chaining locators
		await this.page
			.locator("//div[@class='product-item-info']")
			.nth(1)
			.hover();
		await this.wishListButtonHomePage.click();
	}

	async addToWishListViaItem() {
		await this.digitalWatch.click();
		await this.page.waitForTimeout(2_000);
		await this.wishListButtonItemPage.click();
	}

	async addToCompareList(num) {
		await this.itemInfo.nth(num).hover();
		// await page.waitForTimeout(1_000);
		await this.addToCompareListButton.nth(num).click();
	}
}

module.exports = { HomePage };
