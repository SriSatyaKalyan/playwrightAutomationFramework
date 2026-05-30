import { test as base } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/ProductDetailsPage";
import { ShoppingCartPage } from "../pageObjects/ShoppingCartPage";
import { logger } from "../utils/logger";

type PageObjectFixtures = {
	productDetailsPage: ProductDetailsPage;
	shoppingCartPage: ShoppingCartPage;
};

/**
 * Extended test with page object fixtures.
 *
 * Usage:
 *   import { test, expect } from "../../src/fixtures/pageObjectFixtures";
 *
 *   test("my test", async ({ productDetailsPage }) => {
 *     await productDetailsPage.navigateToFalcon9();
 *   });
 */
export const test = base.extend<PageObjectFixtures>({
	productDetailsPage: async ({ page }, use) => {
		logger.info("Setting up ProductDetailsPage fixture");
		await use(new ProductDetailsPage(page));
		logger.info("Tearing down ProductDetailsPage fixture");
	},

	shoppingCartPage: async ({ page }, use) => {
		logger.info("Setting up ShoppingCartPage fixture");
		await use(new ShoppingCartPage(page));
		logger.info("Tearing down ShoppingCartPage fixture");
	},
});

export { expect } from "@playwright/test";
