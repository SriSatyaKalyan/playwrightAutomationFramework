// spec: specs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "../../src/fixtures/pageObjectFixtures";

test.describe("Product Details View Test", () => {
	test("Product Details View", async ({ productDetailsPage }) => {
		// 1. Navigate to a specific product page (e.g., Falcon 9)
		await productDetailsPage.navigateToFalcon9();

		// 2. Verify product title, description, and pricing details
		await expect(productDetailsPage.productTitle).toBeVisible();
		await expect(productDetailsPage.productPrice).toContainText("50.00€");
		await expect(productDetailsPage.productDescription).toBeVisible();

		// 3. Check product image gallery functionality
		await expect(productDetailsPage.galleryThumbnails).toHaveCount(2);

		// 4. Verify quantity selector is functional
		await expect(productDetailsPage.quantityInput).toHaveValue("1");
		await productDetailsPage.setQuantity("3");
		await expect(productDetailsPage.quantityInput).toHaveValue("3");

		// 5. Test product tabs (Description, Additional Information, Reviews)
		await productDetailsPage.clickAdditionalInfoTab();
		await productDetailsPage.clickReviewsTab();
		await productDetailsPage.clickDescriptionTab();

		// 6. Verify related products section displays correctly
		await expect(productDetailsPage.relatedProductsTitle).toBeVisible();
		await expect(productDetailsPage.saturnVRelatedProduct).toBeVisible();

		// 7. Check breadcrumb navigation functionality
		await expect(productDetailsPage.bigRocketsBreadcrumb).toBeVisible();
		await productDetailsPage.clickBigRocketsBreadcrumb();
	});
});
