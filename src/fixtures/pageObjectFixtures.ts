import { test as base } from "@playwright/test";
import { ProductCatalogPage } from "../pageObjects/ProductCatalogPage";
import { ProductDetailsPage } from "../pageObjects/ProductDetailsPage";
import { ShoppingCartPage } from "../pageObjects/ShoppingCartPage";
import { productCatalogData, type ProductCatalogData } from "../utils/testData";
import { logger } from "../utils/logger";

type PageObjectFixtures = {
	productCatalogPage: ProductCatalogPage;
	productDetailsPage: ProductDetailsPage;
	shoppingCartPage: ShoppingCartPage;
	catalogData: ProductCatalogData;
	catalogPageReady: ProductCatalogPage;
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
	productCatalogPage: async ({ page }, use) => {
		logger.info("Setting up ProductCatalogPage fixture");
		await use(new ProductCatalogPage(page));
		logger.info("Tearing down ProductCatalogPage fixture");
	},

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

	catalogData: async ({}, use) => {
		await use(productCatalogData);
	},

	catalogPageReady: async ({ productCatalogPage, catalogData }, use) => {
		logger.info("Setting up preloaded catalog page fixture");
		await productCatalogPage.navigateToCatalog();
		await productCatalogPage.expectCatalogPageTitle();
		await productCatalogPage.expectShopHeadingVisible();
		await productCatalogPage.expectProductCount(
			catalogData.productNames.length,
		);
		await use(productCatalogPage);
		logger.info("Tearing down preloaded catalog page fixture");
	},
});

export { expect } from "@playwright/test";
