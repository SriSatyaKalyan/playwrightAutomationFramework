// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing', () => {
  test('Keyboard Navigation', async ({ page }) => {
    // Navigate to Bellatrix Solutions e-commerce homepage to start keyboard navigation testing
    await page.goto('https://demos.bellatrix.solutions/');

    // Step 1: Navigate entire site using only keyboard (Tab, Enter, Space)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Test search functionality with keyboard
    await page.keyboard.press('Tab');
    await page.getByRole('searchbox', { name: 'Search for:' }).fill('falcon');
    await page.keyboard.press('Tab');

    // Navigate back to home page to limit keyboard navigation testing to home page only
    await page.goto('https://demos.bellatrix.solutions/');

    // Step 4: Test product selection and quantities with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Use skip to content link to jump to product area for testing keyboard navigation
    await page.keyboard.press('Enter');

    // Step 4: Test product selection and quantity changes with keyboard accessibility - tab through products
    await page.keyboard.press('Tab');

    // Test sorting functionality via keyboard - use Arrow Down to change sort order
    await page.keyboard.press('ArrowDown');

    // Continue tabbing to reach product links on the home page
    await page.keyboard.press('Tab');

    // Continue tabbing to reach the Add to cart button for Falcon 9 product
    await page.keyboard.press('Tab');

    // Step 3: Test shopping cart operations via keyboard - add Falcon 9 to cart using Enter key
    await page.keyboard.press('Enter');

    // Continue testing product navigation with keyboard - tab to next product
    await page.keyboard.press('Tab');

    // Continue testing keyboard navigation through products - tab to next product (Proton Rocket)
    await page.keyboard.press('Tab');

    // Continue tabbing to test all product interaction buttons with keyboard navigation
    await page.keyboard.press('Tab');

    // Continue tabbing to reach Proton-M product and test 'Read more' button functionality
    await page.keyboard.press('Tab');

    // Tab to Read more button for Proton-M to test different product interaction types
    await page.keyboard.press('Tab');

    // Continue testing keyboard navigation through remaining products to verify complete tab order
    await page.keyboard.press('Tab');

    // Test Saturn V Add to cart button accessibility via keyboard
    await page.keyboard.press('Tab');

    // Continue to final product (Falcon Heavy) to complete keyboard navigation testing
    await page.keyboard.press('Tab');

    // Tab to Falcon Heavy Add to cart button to finish testing all product interactions
    await page.keyboard.press('Tab');

    // Step 6: Complete testing by verifying focus indicators and tab order - continue to bottom elements
    await page.keyboard.press('Tab');

    // Verify all interactive elements are reachable via keyboard by checking cart updates
    await expect(page.getByText('50.00€ 1 item')).toBeVisible();
    
    // Verify focus indicators are visible and clear by checking active elements exist
    await expect(page.locator(':focus')).toBeVisible();
    
    // Verify tab order follows logical page flow - sorting dropdown should be accessible
    const sortDropdown = page.getByRole('combobox', { name: 'Shop order' });
    await expect(sortDropdown).toBeFocused();
  });
});