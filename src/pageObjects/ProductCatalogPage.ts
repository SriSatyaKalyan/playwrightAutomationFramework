import { expect, type Locator, type Page } from "@playwright/test";

export class ProductCatalogPage {
	constructor(private readonly page: Page) {}

	get productsList(): Locator {
		return this.page
			.locator(
				'ul[class*="products"], .woocommerce-loop, [class*="shop-loop"]',
			)
			.first();
	}

	get productCountText(): Locator {
		return this.page
			.locator(
				'p[class*="result-count"], .woocommerce-result-count, [class*="showing-results"]',
			)
			.first();
	}

	get saleBadges(): Locator {
		return this.productsList.locator(
			'li[class*="product"] .onsale, li[class*="product"] [class*="onsale"]',
		);
	}

	get addToCartButtons(): Locator {
		return this.productsList.locator(
			'a[class*="add_to_cart"], button[class*="add_to_cart"], [data-action="add-to-cart"], a[href*="add-to-cart"]',
		);
	}

	get readMoreButtons(): Locator {
		return this.productsList
			.locator('a[class*="button"], button')
			.filter({ hasText: /read.?more/i });
	}

	get brandImage(): Locator {
		return this.page.getByRole("img", { name: "Bellatrix Demos" });
	}

	productCard(productName: string): Locator {
		return this.productsList
			.locator('li[class*="product"].type-product')
			.filter({ hasText: new RegExp(productName, "i") });
	}

	productHeading(productName: string): Locator {
		return this.page.getByRole("heading", { name: productName });
	}

	priceInProductCard(productName: string, amount: string): Locator {
		return this.productCard(productName)
			.locator('[class*="price"], .amount, [data-price]')
			.filter({ hasText: new RegExp(this.escapeRegex(amount), "i") })
			.first();
	}

	private escapeRegex(text: string): string {
		return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	async navigateToCatalog(): Promise<void> {
		await this.page.goto("/");
	}

	async expectProductCount(count: number): Promise<void> {
		await expect(this.productCountText).toHaveText(
			new RegExp(`showing\\s+(all\\s+)?${count}\\s+results?`, "i"),
		);
	}

	async expectProductHeadingsVisible(productNames: string[]): Promise<void> {
		for (const productName of productNames) {
			await expect(this.productHeading(productName)).toBeVisible();
		}
	}

	async expectAnySaleBadgeVisible(): Promise<void> {
		await expect(this.saleBadges.first()).toBeVisible();
	}

	async expectPricesVisible(prices: string[]): Promise<void> {
		for (const price of prices) {
			await expect(this.page.getByText(price).first()).toBeVisible();
		}
	}

	async expectCatalogActionsVisible(): Promise<void> {
		await expect(this.addToCartButtons.first()).toBeVisible();
		await expect(this.readMoreButtons.first()).toBeVisible();
	}

	async expectBrandImageVisible(): Promise<void> {
		await expect(this.brandImage).toBeVisible();
	}
}
