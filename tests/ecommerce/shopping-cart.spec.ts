// spec: specs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { ShoppingCartPage } from "../../src/pageObjects/ShoppingCartPage";

test.describe("E-commerce Core Functionality", () => {
	test("Shopping Cart Management", async ({ page }, testInfo) => {
		test.fixme(
			testInfo.project.name === "iphone",
			"Mobile cart UI needs redesign - Ticket #123",
		);
		const shoppingCartPage = new ShoppingCartPage(page);

		// 1. Add a product to cart from product page
		await page.goto(shoppingCartPage.productUrl);
		await shoppingCartPage.addToCartButton.click();

		// 2. Verify cart icon updates with correct item count and total
		await expect(
			shoppingCartPage.cartSummary("50.00€ 1 item"),
		).toBeVisible();

		// 3. Navigate to cart page
		await page.goto(shoppingCartPage.cartUrl);

		// 4. Verify cart displays correct product information
		await expect(shoppingCartPage.productLink("Falcon 9")).toBeVisible();

		// 5. Test quantity modification in cart
		await shoppingCartPage.quantityInput("Falcon 9").fill("2");
		await shoppingCartPage.updateCartButton.click();

		// 6. Test item removal from cart
		await shoppingCartPage.removeItemLink.click();

		// 7. Apply a coupon code (if available)
		await page.goto(shoppingCartPage.productUrl);
		await shoppingCartPage.addToCartButton.click();
		await page.goto(shoppingCartPage.cartUrl);
		await shoppingCartPage.couponInput.fill("TEST");
		await shoppingCartPage.applyCouponButton.click();

		// 8. Verify cart totals calculation including VAT
		await expect(shoppingCartPage.totalsRow("Subtotal")).toBeVisible();
		await expect(shoppingCartPage.totalsRow("VAT")).toBeVisible();
		await expect(
			shoppingCartPage.totalAmount("Total 60.00€"),
		).toBeVisible();
	});
});
