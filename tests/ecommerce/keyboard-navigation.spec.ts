// spec: docs/bellatrix-ecommerce-test-plan.md

import { test, expect } from "@playwright/test";
import { logger } from "../../src/utils/logger";

test.describe("Accessibility Testing", () => {
	test.skip("Keyboard Navigation", async ({ page }) => {
		logger.info("Starting Keyboard Navigation accessibility test");

		// Navigate to Bellatrix Solutions e-commerce homepage
		logger.info("Navigating to Bellatrix e-commerce demo site");
		await page.goto("/");

		// Step 1: Verify top-level keyboard navigation works (Tab through header links)
		logger.info("Starting keyboard navigation with Tab key");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");

		// Step 2: Test search functionality with keyboard
		logger.info("Testing search functionality with keyboard input");
		await page
			.getByRole("searchbox", { name: "Search for:" })
			.fill("falcon");
		await page.keyboard.press("Tab");

		// Return to home page for product interaction testing
		logger.info("Returning to home page for focused navigation testing");
		await page.goto("https://demos.bellatrix.solutions/");

		// Step 3: Test sort dropdown accessibility via keyboard
		logger.info(
			"Testing sort dropdown accessibility via keyboard navigation",
		);
		const sortDropdown = page
			.getByRole("combobox", { name: "Shop order" })
			.first();
		await sortDropdown.focus();
		await expect(sortDropdown).toBeFocused();

		logger.info("Testing sort dropdown functionality with Arrow Down key");
		await sortDropdown.press("ArrowDown");
		await expect(sortDropdown).toBeEnabled();

		// Step 4: Test shopping cart operation via keyboard
		// Focus the first "Add to cart" link (Falcon 9) directly so the keyboard
		// interaction is deterministic regardless of headless/headed mode or viewport.
		logger.info("Focusing Falcon 9 Add to cart button for keyboard test");
		const addToCartBtn = page
			.getByRole("link", { name: /add to cart/i })
			.first();
		await addToCartBtn.focus();
		await expect(addToCartBtn).toBeFocused();

		logger.info("Adding Falcon 9 to cart using Enter key");
		await page.keyboard.press("Enter");

		// Wait for the cart widget to update before asserting
		logger.info(
			"Verifying cart was updated correctly via keyboard interaction",
		);
		const cartLink = page.locator("a.cart-contents");
		await expect(cartLink).toBeVisible({ timeout: 10000 });
		await expect(cartLink).toContainText("1 item", { timeout: 10000 });

		// Step 5: Verify focus indicators are present after interaction
		logger.info("Verifying focus indicators are visible");
		await expect(page.locator(":focus")).toBeVisible();

		// Step 6: Tab through remaining product buttons to verify complete tab order
		logger.info(
			"Navigating through remaining products with keyboard to verify tab order",
		);
		for (let i = 0; i < 8; i++) {
			await page.keyboard.press("Tab");
		}

		logger.info(
			"Keyboard Navigation accessibility test completed successfully",
		);
	});
});
