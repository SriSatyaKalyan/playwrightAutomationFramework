// spec: specs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { ProductDetailsPage } from "../../src/pageObjects/ProductDetailsPage";

test.describe("Product Details View Test", () => {
	test("Product Details View", async ({ page }) => {
		const productPage = new ProductDetailsPage(page);

		// 1. Navigate to a specific product page (e.g., Falcon 9)
		await productPage.navigateToFalcon9();

		// 2. Verify product title, description, and pricing details
		await expect(productPage.productTitle).toBeVisible();
		await expect(productPage.productPrice).toContainText("50.00€");
		await expect(productPage.productDescription).toBeVisible();

		// 3. Check product image gallery functionality
		await expect(productPage.galleryThumbnails).toHaveCount(2);

		// 4. Verify quantity selector is functional
		await expect(productPage.quantityInput).toHaveValue("1");
		await productPage.setQuantity("3");
		await expect(productPage.quantityInput).toHaveValue("3");

		// 5. Test product tabs (Description, Additional Information, Reviews)
		await productPage.clickAdditionalInfoTab();
		await productPage.clickReviewsTab();
		await productPage.clickDescriptionTab();

		// 6. Verify related products section displays correctly
		await expect(productPage.relatedProductsTitle).toBeVisible();
		await expect(productPage.saturnVRelatedProduct).toBeVisible();

		// 7. Check breadcrumb navigation functionality
		await expect(productPage.bigRocketsBreadcrumb).toBeVisible();
		await productPage.clickBigRocketsBreadcrumb();
	});
});
