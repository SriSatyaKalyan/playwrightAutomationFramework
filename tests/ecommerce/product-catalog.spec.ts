// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "../../src/fixtures/pageObjectFixtures";
import { logger } from "../../src/utils/logger";
import { productCatalogData } from "../../src/utils/testData";

test.describe("Product Catalog Presence Test", () => {
	test("Product Catalog Browsing", async ({ productCatalogPage }) => {
		logger.info("Starting Product Catalog Browsing test");
		logger.info(
			"Navigating to home page and verifying products are present with the appropriate sale and discount information. Ensuring that the elements on the page are visible and contain the correct information.",
		);

		logger.info("Navigating to Bellatrix e-commerce demo site");
		await productCatalogPage.navigateToCatalog();

		logger.info("Verifying product count display");
		await productCatalogPage.expectProductCount(
			productCatalogData.productNames.length,
		);

		logger.info("Verifying all 5 product headings are visible");
		await productCatalogPage.expectProductHeadingsVisible(
			productCatalogData.productNames,
		);

		logger.info("Verifying sale badges are present on discounted products");
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

		logger.info("Verifying Add to cart and Read more buttons are present");
		await productCatalogPage.expectCatalogActionsVisible();

		logger.info("Verifying page images are loaded properly");
		await productCatalogPage.expectBrandImageVisible();

		logger.info("Product Catalog Browsing test completed successfully");
	});
});
