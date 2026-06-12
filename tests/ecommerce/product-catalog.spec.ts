// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "../../src/fixtures/pageObjectFixtures";
import { logger } from "../../src/utils/logger";

test.describe("Product Catalog Element Presence Test", () => {
	test("Checking for information presence for product items on home page", async ({
		catalogPageReady,
		catalogData,
	}) => {
		logger.info("Starting Product Catalog Element Presence test");
		logger.info(
			"Navigating to home page and verifying products are present with the appropriate sale and discount information. Ensuring that the elements on the page are visible and contain the correct information.",
		);

		logger.info("Verifying all 5 product headings are visible");
		await catalogPageReady.expectProductHeadingsVisible(
			catalogData.productNames,
		);

		logger.info("Verifying sale badges are present on discounted products");
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

		logger.info("Verifying Add to cart and Read more buttons are present");
		await catalogPageReady.expectCatalogActionsVisible();

		logger.info("Verifying page images are loaded properly");
		await catalogPageReady.expectBrandImageVisible();

		logger.info("Product Catalog Element Presence test completed successfully");
	});
});
