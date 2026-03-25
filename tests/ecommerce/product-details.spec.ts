// spec: specs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Product Details View Test", () => {
	test("Product Details View", async ({ page }) => {
		// 1. Navigate to a specific product page (e.g., Falcon 9)
		await page.goto("https://demos.bellatrix.solutions/product/falcon-9/");

		// 2. Verify product title, description, and pricing details
		await expect(
			page.getByRole("heading", { name: "Falcon 9" }),
		).toBeVisible();
		await expect(
			page.locator("ins .woocommerce-Price-amount").first(),
		).toContainText("50.00€");
		await expect(
			page
				.getByText(
					"Falcon 9 is a family of two-stage-to-orbit medium lift launch vehicles",
				)
				.first(),
		).toBeVisible();

		// 3. Check product image gallery functionality
		const galleryThumbnails = page.locator(
			".woocommerce-product-gallery__image",
		);
		await expect(galleryThumbnails).toHaveCount(2);

		// 4. Verify quantity selector is functional
		const quantitySelector = page.getByRole("spinbutton", {
			name: "Falcon 9 quantity",
		});
		await expect(quantitySelector).toHaveValue("1");
		await quantitySelector.fill("3");
		await expect(quantitySelector).toHaveValue("3");

		// 5. Test product tabs (Description, Additional Information, Reviews)
		await page
			.getByRole("link", { name: "Additional information" })
			.click();
		await page.getByRole("link", { name: "Reviews (0)" }).click();
		await page.getByRole("link", { name: "Description" }).click();

		// 6. Verify related products section displays correctly
		await expect(
			page.getByRole("heading", { name: "You may also like…" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Saturn V" }),
		).toBeVisible();

		// 7. Check breadcrumb navigation functionality
		await expect(
			page.getByLabel("breadcrumbs").getByText("Big Rockets"),
		).toBeVisible();
		await page
			.getByLabel("breadcrumbs")
			.getByRole("link", { name: "Big Rockets" })
			.click();
	});
});
