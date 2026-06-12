// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: seed.spec.ts

import { test, expect } from "../../src/fixtures/pageObjectFixtures";
import { logger } from "../../src/utils/logger";

test.describe("Product Catalog Browsing", () => {
	test("Checking for presence of product items on home page", async ({
		catalogPageReady,
		catalogData,
	}) => {
		logger.info("Starting Product Catalog Browsing test");

		logger.info(
			"Verifying all 5 products are displayed with correct information",
		);
		await catalogPageReady.expectProductHeadingsVisible(
			catalogData.productNames,
		);

		for (const productName of catalogData.productNames) {
			await expect(
				catalogPageReady.productCard(productName),
			).toBeVisible();
			logger.info(`✓ Product "${productName}" found and visible`);
		}

		logger.info("Verifying sale badges are present on discounted products");
		await catalogPageReady.expectSaleBadgeCount(4);
		await catalogPageReady.expectAnySaleBadgeVisible();

		logger.info("Verifying pricing information displays correctly");
		await expect(
			catalogPageReady.priceInProductCard(
				"Falcon 9",
				catalogData.falcon9Prices.sale,
			),
		).toBeVisible();
		await expect(
			catalogPageReady.priceInProductCard(
				"Falcon 9",
				catalogData.falcon9Prices.original,
			),
		).toBeVisible();

		await catalogPageReady.expectPricesVisible(
			catalogData.otherVisiblePrices,
		);

		logger.info("Verifying add to cart buttons for purchasable products");
		await catalogPageReady.expectAddToCartButtonCount(4);
		await expect(
			catalogPageReady.productCard("Falcon 9").getByRole("link", {
				name: /Add .+ to your cart/i,
			}),
		).toBeVisible();

		logger.info(
			"Verifying read more button for products requiring additional info",
		);
		await catalogPageReady.expectReadMoreButtonCount(1);
		await expect(
			catalogPageReady.productCard("Proton-M").getByRole("link", {
				name: /Read more/i,
			}),
		).toBeVisible();

		logger.info("Verifying product count and sorting controls");
		await catalogPageReady.expectProductCount(
			catalogData.productNames.length,
		);
		await catalogPageReady.expectSortingDropdownVisible();

		logger.info("Product Catalog Browsing test completed successfully");
	});
});
