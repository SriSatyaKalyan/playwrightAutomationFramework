// spec: specs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Product Details View Test", () => {
	test("Product Details View", async ({ page }) => {
		// 1. Navigate to a specific product page (e.g., Falcon 9)
		await page.goto("https://demos.bellatrix.solutions/product/falcon-9/");

		// 2. Verify product title, description, and pricing details
		await expect(page.locator("h1.product_title")).toBeVisible();
		await expect(
			page.locator("ins .woocommerce-Price-amount").first(),
		).toContainText("50.00€");
		await expect(
			page
				.locator(
					"xpath=//div[@id='tab-description']//p[contains(text(), 'Falcon 9 is a family of two-stage-to-orbit medium lift launch vehicles')]",
				)
				.first(),
		).toBeVisible();

		// 3. Check product image gallery functionality
		const galleryThumbnails = page.locator(
			".woocommerce-product-gallery__image",
		);
		await expect(galleryThumbnails).toHaveCount(2);

		// 4. Verify quantity selector is functional
		const quantitySelector = page.locator("input[name='quantity']");
		await expect(quantitySelector).toHaveValue("1");
		await quantitySelector.fill("3");
		await expect(quantitySelector).toHaveValue("3");

		// 5. Test product tabs (Description, Additional Information, Reviews)
		await page
			.locator("xpath=//a[contains(text(), 'Additional information')]")
			.click();
		await page.locator("xpath=//a[contains(text(), 'Reviews')]").click();
		await page
			.locator("xpath=//a[contains(text(), 'Description')]")
			.click();

		// 6. Verify related products section displays correctly
		await expect(
			page.locator("xpath=//h2[text()='You may also like…']"),
		).toBeVisible();
		await expect(
			page.locator("xpath=//h2[text()='Saturn V']"),
		).toBeVisible();

		// 7. Check breadcrumb navigation functionality
		await expect(
			page
				.locator("nav[aria-label='breadcrumbs']")
				.locator("xpath=//a[contains(text(), 'Big Rockets')]"),
		).toBeVisible();
		await page
			.locator("nav[aria-label='breadcrumbs']")
			.locator("xpath=//a[contains(text(), 'Big Rockets')]")
			.click();
	});
});
