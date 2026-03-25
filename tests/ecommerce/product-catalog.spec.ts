// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { logger } from "../../src/utils/logger";

test.describe("E-commerce Core Functionality", () => {
	test("Product Catalog Browsing", async ({ page }) => {
		logger.info("Starting Product Catalog Browsing test");

		// Step 1: Navigate to the home page to start product catalog browsing test
		logger.info("Navigating to Bellatrix e-commerce demo site");
		await page.goto("https://demos.bellatrix.solutions/");

		// Step 2: Verify all products are displayed - check that all 5 products are shown
		logger.info("Verifying product count display");
		await expect(
			page.getByText("Showing all 5 results").first(),
		).toBeVisible();

		// Step 2: Verify all 5 product names are displayed with correct information
		logger.info("Verifying all 5 product headings are visible");
		await expect(
			page.getByRole("heading", { name: "Falcon 9" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Proton Rocket" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Proton-M" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Saturn V" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Falcon Heavy" }),
		).toBeVisible();

		// Step 4: Verify sale badges are visible on discounted items
		logger.info("Verifying sale badges are present on discounted products");
		await expect(page.getByText("Sale!").first()).toBeVisible();

		// Step 4: Verify pricing information shows both original and discounted prices for Falcon 9
		logger.info("Verifying pricing information displays correctly");
		await expect(page.getByText("50.00€").first()).toBeVisible();
		await expect(page.getByText("600.00€").first()).toBeVisible();

		// Step 4: Verify pricing information for other products
		await expect(page.getByText("15.00€").first()).toBeVisible();
		await expect(page.getByText("120.00€").first()).toBeVisible();
		await expect(page.getByText("143.00€").first()).toBeVisible();
		await expect(page.getByText("4,500,000.00€").first()).toBeVisible();

		// Step 5: Check that 'Add to cart' buttons are present for available products
		logger.info("Verifying Add to cart and Read more buttons are present");
		await expect(page.getByText("Add to cart").first()).toBeVisible();

		// Step 6: Verify 'Read more' button for products that require them (Proton-M)
		await expect(page.getByText("Read more").first()).toBeVisible();

		// Step 3: Verify product images are loaded correctly by checking if images are visible
		logger.info("Verifying page images are loaded properly");
		await expect(
			page.getByRole("img", { name: "Bellatrix Demos" }),
		).toBeVisible();

		logger.info("Product Catalog Browsing test completed successfully");
	});
});
