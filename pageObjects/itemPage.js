const { expect } = require("@playwright/test");

class ItemPage {
	constructor(page) {
		this.page = page;
		this.reviewsTab = page.locator("//div[@id='tab-label-reviews']");
		this.reviewContent = page.locator("//div[@class='review-content']");
		this.nicknameField = page.locator("//input[@id='nickname_field']");
		this.summaryField = page.locator("//input[@id='summary_field']");
		this.reviewField = page.locator("//textarea[@id='review_field']");
		this.submitButton = page.locator("//button[@type='submit']").nth(2);
		this.missedRatingText = page.getByText(
			"Please select one of each of the ratings above."
		);
	}

	async navigateToItemPage(item) {
		await this.page.goto(
			"https://magento.softwaretestingboard.com/" + item + ".html"
		);
	}

	async clickOnReviews() {
		await this.reviewsTab.click();
		await this.page.waitForTimeout(1_000);
	}

	async checkForReviewText(reviewText) {
		expect(await this.reviewContent).toContainText(reviewText);
	}

	async missedRatingAlert() {
		expect(this.missedRatingText).toBeVisible();
	}

	async calculatePageCount() {
		let pageCount = await this.page
			.locator("//select[@data-role='limiter']")
			.locator("//option[@selected='selected']")
			.nth(1)
			.textContent();
		console.log("The pageCount is: " + pageCount);
		return pageCount;
	}

	async calculateProductCount() {
		let productCount = await this.page
			.locator("//img[@class='product-image-photo']")
			.count();
		console.log("The productCount is: " + productCount);
		return productCount;
	}
}

module.exports = { ItemPage };
