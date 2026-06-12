# playwrightAutomationFramework

[![Run Playwright Tests](https://github.com/SriSatyaKalyan/playwrightAutomationFramework/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/SriSatyaKalyan/playwrightAutomationFramework/actions/workflows/playwright-tests.yml)

`playwrightAutomationFramework` is a Playwright-based automation framework for the Bellatrix e-commerce demo site. It combines native Playwright specs and Cucumber BDD tests to cover the core shopping experience with a maintainable page-object structure, shared fixtures, reusable test data, and centralized logging.

## What This Framework Does

The framework validates the most important flows on the demo storefront, including catalog browsing, product detail inspection, cart interactions, and accessibility-oriented keyboard checks. It is designed to give fast feedback on product visibility, pricing, sale badges, navigation, and cart totals while keeping the tests easy to extend.

## Current Features

- Native Playwright specs for UI automation under `tests/ecommerce/`.
- Cucumber BDD support for behavior-driven scenarios under `tests/features/`.
- Page Object Model coverage for the catalog, product details, and shopping cart screens.
- Shared fixtures that inject page objects into tests for cleaner test setup.
- Centralized test data for product names and pricing assertions.
- Shared logger utility for consistent test output.
- Playwright configuration tuned for Chromium, traces on failure, screenshots on failure, and HTML/JSON reporting.
- Regression tagging support for filtering important scenarios.

## Current Test Coverage

- Product catalog browsing and sale badge validation.
- Product details page checks for title, description, gallery, tabs, quantity, and breadcrumbs.
- Shopping cart management, including add-to-cart, quantity updates, coupon entry, and totals.
- Keyboard navigation and accessibility-focused interactions.
- Cucumber sale validation for catalog pricing.

## Run Commands

```bash
npm run all
```

```bash
npm run allHeaded
```

```bash
npm run regression
```

```bash
npm run cucumber
```

```bash
npm run cucumber:all
```

```bash
npm run cucumber:sale-catalog
```

## Reporting

- HTML and JSON reports are written to `reports/`.
- Playwright traces and screenshots are retained on failure for debugging.
- Cucumber reports can be generated with the HTML formatter when needed.

## TO DO

- Add API testing support and corresponding scripts.
- Add end-to-end flows that combine UI and API coverage.
- Expand browser coverage beyond Chromium and validate the framework across more devices.
- Add CI integration with Jenkins and publish build feedback consistently.
- Introduce a cleaner tagging strategy across both Playwright and Cucumber tests.
- Grow the page-object layer for additional product and checkout flows.
- Add more negative-path and edge-case coverage for cart and pricing logic.
- Improve reporting automation so execution results are easier to share with the team.
