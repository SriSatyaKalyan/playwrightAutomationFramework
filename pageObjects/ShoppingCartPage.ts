import { type Locator, type Page } from "@playwright/test";

export class ShoppingCartPage {
	readonly productUrl = "https://demos.bellatrix.solutions/product/falcon-9/";
	readonly cartUrl = "https://demos.bellatrix.solutions/cart/";

	constructor(private readonly page: Page) {}

	get addToCartButton(): Locator {
		return this.page.getByRole("button", { name: "Add to cart" });
	}

	get updateCartButton(): Locator {
		return this.page.getByRole("button", { name: "Update cart" });
	}

	get removeItemLink(): Locator {
		return this.page.getByRole("link", { name: "Remove this item" });
	}

	get couponInput(): Locator {
		return this.page.getByRole("textbox", { name: "Coupon:" });
	}

	get applyCouponButton(): Locator {
		return this.page.getByRole("button", { name: "Apply coupon" });
	}

	cartSummary(summaryText: string): Locator {
		return this.page.getByText(summaryText);
	}

	productLink(productName: string): Locator {
		return this.page.getByRole("link", { name: productName });
	}

	quantityInput(productName: string): Locator {
		return this.page.getByRole("spinbutton", {
			name: `${productName} quantity`,
		});
	}

	totalsRow(rowName: string): Locator {
		return this.page.getByRole("rowheader", { name: rowName });
	}

	totalAmount(totalText: string): Locator {
		return this.page.getByText(totalText);
	}
}
