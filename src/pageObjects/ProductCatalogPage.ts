import { expect, type Locator, type Page } from "@playwright/test";

export class ProductCatalogPage {
	constructor(private readonly page: Page) {}

	private readonly defaultPageTitle = /Bellatrix Demos/i;

	get mainContent(): Locator {
		return this.page.getByRole("main");
	}

	get shopHeading(): Locator {
		return this.mainContent.getByRole("heading", {
			name: /^Shop$/i,
			level: 1,
		});
	}

	get productsList(): Locator {
		return this.mainContent.getByRole("list").first();
	}

	get productCountText(): Locator {
		return this.mainContent
			.getByText(/showing\s+(all\s+)?\d+\s+results?/i)
			.first();
	}

	get saleBadges(): Locator {
		return this.productsList.getByText(/^Sale!$/i);
	}

	get addToCartButtons(): Locator {
		return this.productsList.getByRole("link", {
			name: /Add .+ to your cart/i,
		});
	}

	get readMoreButtons(): Locator {
		return this.productsList.getByRole("link", {
			name: /Read more about/i,
		});
	}

	get sortingDropdown(): Locator {
		return this.mainContent
			.locator('select[name="orderby"], select[class*="orderby"]')
			.first();
	}

	get brandImage(): Locator {
		return this.page.getByRole("img", { name: "Bellatrix Demos" });
	}

	productCard(productName: string): Locator {
		return this.productsList.getByRole("listitem").filter({
			hasText: new RegExp(
				`^\\s*${this.escapeRegex(productName)}\\b`,
				"i",
			),
		});
	}

	productHeading(productName: string): Locator {
		return this.mainContent.getByRole("heading", {
			name: new RegExp(`^${this.escapeRegex(productName)}$`, "i"),
			level: 2,
		});
	}

	priceInProductCard(productName: string, amount: string): Locator {
		return this.productCard(productName).filter({
			hasText: new RegExp(this.escapeRegex(amount), "i"),
		});
	}

	private escapeRegex(text: string): string {
		return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	async navigateToCatalog(): Promise<void> {
		await this.page.goto("/");
	}

	async expectCatalogPageTitle(): Promise<void> {
		await expect(this.page).toHaveTitle(this.defaultPageTitle);
	}

	async expectShopHeadingVisible(): Promise<void> {
		await expect(this.shopHeading).toBeVisible();
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

	async expectSaleBadgeCount(count: number): Promise<void> {
		await expect(this.saleBadges).toHaveCount(count);
	}

	async expectPricesVisible(prices: string[]): Promise<void> {
		for (const price of prices) {
			await expect(this.mainContent).toContainText(
				new RegExp(this.escapeRegex(price), "i"),
			);
		}
	}

	async expectCatalogActionsVisible(): Promise<void> {
		await expect(this.addToCartButtons.first()).toBeVisible();
		await expect(this.readMoreButtons.first()).toBeVisible();
	}

	async expectAddToCartButtonCount(count: number): Promise<void> {
		await expect(this.addToCartButtons).toHaveCount(count);
	}

	async expectReadMoreButtonCount(count: number): Promise<void> {
		await expect(this.readMoreButtons).toHaveCount(count);
	}

	async expectSortingDropdownVisible(): Promise<void> {
		await expect(this.sortingDropdown).toBeVisible();
	}

	async expectBrandImageVisible(): Promise<void> {
		await expect(this.brandImage).toBeVisible();
	}
}
