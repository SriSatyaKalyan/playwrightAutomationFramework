// spec: docs/bellatrix-ecommerce-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('E-commerce Core Functionality', () => {
  test('Product Catalog Browsing', async ({ page }) => {
    // Step 1: Navigate to the home page to start product catalog browsing test
    await page.goto('https://demos.bellatrix.solutions/');

    // Step 2: Verify all products are displayed - check that all 5 products are shown
    await expect(page.getByText('Showing all 5 results')).toBeVisible();

    // Step 2: Verify all 5 product names are displayed with correct information
    await expect(page.getByRole('heading', { name: 'Falcon 9' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proton Rocket' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proton-M' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Saturn V' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Falcon Heavy' })).toBeVisible();

    // Step 4: Verify sale badges are visible on discounted items
    await expect(page.getByText('Sale!')).toBeVisible();

    // Step 4: Verify pricing information shows both original and discounted prices for Falcon 9
    await expect(page.getByText('50.00€')).toBeVisible();
    await expect(page.getByText('600.00€')).toBeVisible();

    // Step 4: Verify pricing information for other products
    await expect(page.getByText('15.00€')).toBeVisible();
    await expect(page.getByText('120.00€')).toBeVisible();
    await expect(page.getByText('143.00€')).toBeVisible();
    await expect(page.getByText('4,500,000.00€')).toBeVisible();

    // Step 5: Check that 'Add to cart' buttons are present for available products
    await expect(page.getByText('Add to cart')).toBeVisible();

    // Step 6: Verify 'Read more' button for products that require them (Proton-M)
    await expect(page.getByText('Read more')).toBeVisible();

    // Step 3: Verify product images are loaded correctly by checking if images are visible
    await expect(page.getByRole('img', { name: 'Bellatrix Demos' })).toBeVisible();
  });
});