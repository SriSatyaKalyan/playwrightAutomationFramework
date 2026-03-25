import { type Locator, type Page } from "@playwright/test";

export class ProductDetailsPage {
	readonly falcon9Url = "https://demos.bellatrix.solutions/product/falcon-9/";

	constructor(private readonly page: Page) {}

	// Product Information Elements
	get productTitle(): Locator {
		return this.page.locator("h1.product_title");
	}

	get productPrice(): Locator {
		return this.page.locator("ins .woocommerce-Price-amount").first();
	}

	get productDescription(): Locator {
		return this.page
			.locator(
				"xpath=//div[@id='tab-description']//p[contains(text(), 'Falcon 9 is a family of two-stage-to-orbit medium lift launch vehicles')]",
			)
			.first();
	}

	// Gallery Elements
	get galleryThumbnails(): Locator {
		return this.page.locator(".woocommerce-product-gallery__image");
	}

	// Quantity Selector
	get quantityInput(): Locator {
		return this.page.locator("input[name='quantity']");
	}

	// Product Tabs
	get additionalInfoTab(): Locator {
		return this.page.locator(
			"xpath=//a[contains(text(), 'Additional information')]",
		);
	}

	get reviewsTab(): Locator {
		return this.page.locator("xpath=//a[contains(text(), 'Reviews')]");
	}

	get descriptionTab(): Locator {
		return this.page.locator("xpath=//a[contains(text(), 'Description')]");
	}

	// Related Products
	get relatedProductsTitle(): Locator {
		return this.page.locator("xpath=//h2[text()='You may also like…']");
	}

	get saturnVRelatedProduct(): Locator {
		return this.page.locator("xpath=//h2[text()='Saturn V']");
	}

	// Breadcrumb Navigation
	get breadcrumbNavigation(): Locator {
		return this.page.locator("nav[aria-label='breadcrumbs']");
	}

	get bigRocketsBreadcrumb(): Locator {
		return this.breadcrumbNavigation.locator(
			"xpath=//a[contains(text(), 'Big Rockets')]",
		);
	}

	// Actions
	async navigateToFalcon9(): Promise<void> {
		await this.page.goto(this.falcon9Url);
	}

	async setQuantity(quantity: string): Promise<void> {
		await this.quantityInput.fill(quantity);
	}

	async clickAdditionalInfoTab(): Promise<void> {
		await this.additionalInfoTab.click();
	}

	async clickReviewsTab(): Promise<void> {
		await this.reviewsTab.click();
	}

	async clickDescriptionTab(): Promise<void> {
		await this.descriptionTab.click();
	}

	async clickBigRocketsBreadcrumb(): Promise<void> {
		await this.bigRocketsBreadcrumb.click();
	}
}
