// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: seed.spec.ts

import { test, expect } from "../../src/fixtures/pageObjectFixtures";
import { logger } from "../../src/utils/logger";
import { productCatalogData } from "../../src/utils/testData";

test.describe("E-commerce Core Functionality", () => {
	test("Product Catalog Browsing", async ({ productCatalogPage }) => {
		logger.info("Starting Product Catalog Browsing test");

		logger.info("Navigating to home page");
		await productCatalogPage.navigateToCatalog();

		logger.info("Verifying page title and basic structure");
		await productCatalogPage.expectCatalogPageTitle();
		await productCatalogPage.expectShopHeadingVisible();

		logger.info(
			"Verifying all 5 products are displayed with correct information",
		);
		await productCatalogPage.expectProductHeadingsVisible(
			productCatalogData.productNames,
		);

		for (const productName of productCatalogData.productNames) {
			await expect(
				productCatalogPage.productCard(productName),
			).toBeVisible();
			logger.info(`✓ Product "${productName}" found and visible`);
		}

		logger.info("Verifying sale badges are present on discounted products");
		await productCatalogPage.expectSaleBadgeCount(4);
		await productCatalogPage.expectAnySaleBadgeVisible();

		logger.info("Verifying pricing information displays correctly");
		await expect(
			productCatalogPage.priceInProductCard(
				"Falcon 9",
				productCatalogData.falcon9Prices.sale,
			),
		).toBeVisible();
		await expect(
			productCatalogPage.priceInProductCard(
				"Falcon 9",
				productCatalogData.falcon9Prices.original,
			),
		).toBeVisible();

		await productCatalogPage.expectPricesVisible(
			productCatalogData.otherVisiblePrices,
		);

		logger.info("Verifying add to cart buttons for purchasable products");
		await productCatalogPage.expectAddToCartButtonCount(4);
		await expect(
			productCatalogPage.productCard("Falcon 9").getByRole("link", {
				name: /Add .+ to your cart/i,
			}),
		).toBeVisible();

		logger.info(
			"Verifying read more button for products requiring additional info",
		);
		await productCatalogPage.expectReadMoreButtonCount(1);
		await expect(
			productCatalogPage.productCard("Proton-M").getByRole("link", {
				name: /Read more/i,
			}),
		).toBeVisible();

		logger.info("Verifying product count and sorting controls");
		await productCatalogPage.expectProductCount(
			productCatalogData.productNames.length,
		);
		await productCatalogPage.expectSortingDropdownVisible();

		logger.info("Product Catalog Browsing test completed successfully");
	});
});
