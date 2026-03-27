// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: seed.spec.ts

import { test, expect } from "@playwright/test";
import { logger } from "../../src/utils/logger";

test.describe("E-commerce Core Functionality", () => {
	test("Product Catalog Browsing", async ({ page }) => {
		logger.info("Starting Product Catalog Browsing test");

		logger.info("Navigating to home page");
		await page.goto("/");

		logger.info("Verifying page title and basic structure");
		await expect(page).toHaveTitle(/Bellatrix Demos/);
		await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();

		logger.info(
			"Verifying all 5 products are displayed with correct information",
		);
		// Use resilient locators for product verification - target product listings container
		const productsList = page
			.locator(
				'ul[class*="products"], .woocommerce-loop, [class*="shop-loop"]',
			)
			.first();
		const expectedProducts = [
			"Falcon 9",
			"Proton Rocket",
			"Proton-M",
			"Saturn V",
			"Falcon Heavy",
		];

		// Verify each product exists by targeting the top-level product list item
		for (const productName of expectedProducts) {
			await expect(
				productsList
					.locator(`li[class*="product"].type-product`)
					.filter({ hasText: new RegExp(productName, "i") }),
			).toBeVisible();
			logger.info(`✓ Product "${productName}" found and visible`);
		}

		logger.info("Verifying sale badges are present on discounted products");
		// Use more specific selectors for sale badges within product containers
		const saleBadges = productsList.locator(
			'li[class*="product"] .onsale, li[class*="product"] [class*="onsale"]',
		);
		await expect(saleBadges).toHaveCount(4);
		await expect(saleBadges.first()).toBeVisible();

		// Verify sale badges contain expected text using regex
		await expect(saleBadges.first()).toHaveText(/sale!?/i);

		logger.info("Verifying pricing information displays correctly");
		// Use resilient pricing locators with currency regex patterns
		const falcon9Product = productsList
			.locator('li[class*="product"].type-product')
			.filter({ hasText: /falcon.?9/i });
		await expect(falcon9Product).toBeVisible();

		// Verify Falcon 9 has both sale price and original price using flexible price patterns
		await expect(
			falcon9Product
				.locator('[class*="price"], .amount, [data-price]')
				.filter({ hasText: /50[\.\,]00.{0,2}€/i })
				.first(),
		).toBeVisible();
		await expect(
			falcon9Product
				.locator('[class*="price"], .amount, [data-price]')
				.filter({ hasText: /600[\.\,]00.{0,2}€/i })
				.first(),
		).toBeVisible();

		// Verify Proton-M regular pricing (no sale) using product container approach
		const protonmProduct = productsList
			.locator('li[class*="product"].type-product')
			.filter({ hasText: /proton.?m/i });
		await expect(protonmProduct).toBeVisible();
		await expect(
			protonmProduct
				.locator('[class*="price"], .amount, [data-price]')
				.filter({ hasText: /15[\.\,]00.{0,2}€/i })
				.first(),
		).toBeVisible();

		logger.info("Verifying add to cart buttons for purchasable products");
		// Use comprehensive selectors for add to cart buttons with multiple fallbacks
		const addToCartButtons = page.locator(
			'a[class*="add_to_cart"], button[class*="add_to_cart"], [data-action="add-to-cart"], a[href*="add-to-cart"]',
		);
		await expect(addToCartButtons).toHaveCount(4);
		await expect(addToCartButtons.first()).toBeVisible();

		// Verify add to cart functionality using multiple selection strategies
		const falcon9AddToCart = page
			.locator('a[href*="add-to-cart=28"], a[data-product_id="28"]')
			.or(
				falcon9Product.locator(
					'a[class*="add_to_cart"], button[class*="add_to_cart"]',
				),
			);
		await expect(falcon9AddToCart.first()).toBeVisible();

		logger.info(
			"Verifying read more button for products requiring additional info",
		);
		// Use resilient approach for Read more button with multiple selection strategies
		const protonmReadMore = page
			.locator('a[href*="/product/proton-m/"]')
			.filter({ hasText: /read.?more/i })
			.or(
				protonmProduct
					.locator('a[class*="button"], button')
					.filter({ hasText: /read.?more/i }),
			);
		await expect(protonmReadMore.first()).toBeVisible();

		logger.info("Verifying product count and sorting controls");
		// Use flexible regex pattern for dynamic result count display
		const productCountDisplay = page.locator(
			'p[class*="result-count"], .woocommerce-result-count, [class*="showing-results"]',
		);
		await expect(productCountDisplay.first()).toHaveText(
			/showing\s+(all\s+)?5\s+results?/i,
		);

		// Use multiple selector strategies for sorting dropdown
		const sortingDropdown = page
			.locator(
				'select[name="orderby"], select[class*="orderby"], select[aria-label*="order"]',
			)
			.or(page.getByRole("combobox", { name: /shop.?order|sort/i }));
		await expect(sortingDropdown.first()).toBeVisible();

		logger.info("Product Catalog Browsing test completed successfully");
	});
});
