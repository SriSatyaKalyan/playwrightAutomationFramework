# playwrightAutomationFramework

[![Run Playwright Tests](https://github.com/SriSatyaKalyan/playwrightAutomationFramework/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/SriSatyaKalyan/playwrightAutomationFramework/actions/workflows/playwright-tests.yml)

playwrightAutomationFramework is a Playwright automation framework for the Bellatrix e-commerce demo site.
It supports both native Playwright specs and Cucumber BDD scenarios, with a Page Object Model, shared fixtures, reusable test data, and centralized logging.

## Highlights

- Native Playwright tests for core commerce flows.
- Cucumber BDD support for behavior-driven scenarios.
- Page Object coverage for catalog, product details, and cart pages.
- Shared fixture layer for cleaner setup and stronger consistency across tests.
- Preloaded catalog fixture to start catalog tests from a validated baseline state.
- Centralized typed test data for product names and pricing assertions.
- Structured logger usage across tests and fixtures.
- Playwright HTML and JSON reporting, with trace and screenshot capture on failure.

## Added Features

- New catalog fixtures in [src/fixtures/pageObjectFixtures.ts](src/fixtures/pageObjectFixtures.ts):
  - catalogData
  - catalogPageReady
- Shared catalog data model in [src/utils/testData.ts](src/utils/testData.ts).
- Catalog specs refactored to consume shared fixtures:
  - [tests/ecommerce/product-catalog.spec.ts](tests/ecommerce/product-catalog.spec.ts)
  - [tests/ecommerce/product-catalog-browsing.spec.ts](tests/ecommerce/product-catalog-browsing.spec.ts)

## Why The New Fixtures Help

- Reliability: catalog tests now begin from the same pre-validated state.
- Maintainability: setup duplication is reduced and managed in one location.
- Readability: tests focus on behavior assertions instead of repeated navigation and baseline checks.
- Scalability: additional catalog tests can reuse the same fixture contract.

## Project Structure

```text
playwrightAutomationFramework/
├── config/
│   ├── cucumber.js
│   └── playwright.config.js
├── src/
│   ├── fixtures/
│   │   └── pageObjectFixtures.ts
│   ├── pageObjects/
│   │   ├── ProductCatalogPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   └── ShoppingCartPage.ts
│   └── utils/
│       ├── logger.ts
│       └── testData.ts
├── tests/
│   ├── ecommerce/
│   │   ├── keyboard-navigation.spec.ts
│   │   ├── product-catalog.spec.ts
│   │   ├── product-catalog-browsing.spec.ts
│   │   ├── product-details.spec.ts
│   │   └── shopping-cart.spec.ts
│   └── features/
│       ├── product-catalog-sale-validation.feature
│       └── step_definitions/
├── reports/
├── test-results/
├── cucumber.js
├── package.json
└── README.md
```

- [config/](config/): Playwright and Cucumber configuration.
- [src/fixtures/](src/fixtures/): Shared fixtures, including preloaded catalog setup.
- [src/pageObjects/](src/pageObjects/): Page Object Model classes for each application area.
- [src/utils/](src/utils/): Reusable logger and centralized test data.
- [tests/ecommerce/](tests/ecommerce/): Native Playwright spec suites.
- [tests/features/](tests/features/): Cucumber features and step definitions.
- [reports/](reports/): Generated HTML and JSON reports.
- [test-results/](test-results/): Runtime artifacts such as traces and screenshots.

## Test Coverage

- Product catalog browsing and sale badge validation.
- Product catalog element presence validation.
- Product details page checks for title, description, gallery, tabs, quantity, and breadcrumbs.
- Shopping cart management, including add-to-cart, quantity updates, coupon entry, and totals.
- Keyboard navigation and accessibility-focused interactions.
- Cucumber sale validation for catalog pricing.

## Run Commands

```bash
npm install
```

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

```bash
npx playwright test tests/ecommerce/product-catalog-browsing.spec.ts --config=config/playwright.config.js
```

```bash
npx playwright test tests/ecommerce/product-catalog-browsing.spec.ts --config=config/playwright.config.js --headed
```

```bash
npx playwright show-report reports
```

## Reporting

- HTML and JSON reports are written to reports.
- Playwright traces and screenshots are retained on failure for debugging.
- Cucumber reports can be generated with the HTML formatter when needed.

## Roadmap

- Add API testing support and corresponding scripts.
- Add end-to-end flows that combine UI and API coverage.
- Expand browser coverage beyond Chromium and validate the framework across more devices.
- Add CI integration with Jenkins and publish build feedback consistently.
- Introduce a cleaner tagging strategy across both Playwright and Cucumber tests.
- Grow the page-object layer for additional product and checkout flows.
- Add more negative-path and edge-case coverage for cart and pricing logic.
- Improve reporting automation so execution results are easier to share with the team.
