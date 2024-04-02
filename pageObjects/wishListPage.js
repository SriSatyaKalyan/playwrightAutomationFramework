const { expect } = require("@playwright/test");

class WishListPage {
	constructor(page) {
		this.page = page;
		this.wishListToolbar = page
			.locator("//span[@class='toolbar-number']")
			.first();
		this.removeFromWishListButton = page
			.locator("//a[@data-role='remove']")
			.first();
		this.wishListEmptyAlert = page.locator(
			"//div[@class='message info empty']"
		);
		this.itemInfo = page
			.locator("//div[@class='product-item-info']")
			.first();
	}

	async validateLandingOnWishListPage() {
		await expect(this.page).toHaveTitle("My Wish List");
	}

	async validateLandingOnComparisonPage() {
		await expect(this.page).toHaveTitle(
			"Products Comparison List - Magento Commerce"
		);

		await expect(
			this.page.getByText("Compare Products").first()
		).toBeVisible();
	}

	async checkItemInWishList(item) {
		await expect(this.page.getByText(item).first()).toBeVisible();
	}

	async getWishListItemCount() {
		let itemCount = await this.page
			.locator("//span[@class='toolbar-number']")
			.first()
			.textContent();
		return itemCount;
	}

	async clearWishList(wishListItemCount) {
		for (let i = 0; i < wishListItemCount; i++) {
			await this.itemInfo.hover();
			await this.page.waitForTimeout(3_000);
			await this.removeFromWishListButton.click();
		}
	}
}

module.exports = { WishListPage };
