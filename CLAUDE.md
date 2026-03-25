# Playwright Automation Framework

## Project Overview

Playwright-based test automation framework targeting the Bellatrix e-commerce demo site. Uses both native Playwright Test (`.spec.ts`) and Cucumber BDD (`.feature` + step definitions).

## Commands

```bash
# Install dependencies
npm install

# Run all tests
npm run all

# Run regression suite only (@Regression tagged)
npm run regression

# Run a specific spec file
npx playwright test tests/ecommerce/product-details.spec.ts --config=config/playwright.config.js

# Run with headed browser (for debugging)
npx playwright test --config=config/playwright.config.js --headed

# Show HTML report
npx playwright show-report reports
```

## Directory Structure

```
config/                   # Playwright and Cucumber config files
docs/                     # Test plans and project documentation
src/
  pageObjects/            # Page Object Model classes
  utils/                  # testBase.js (custom fixtures), testData.json, logger.ts
tests/                    # All test files
  ecommerce/              # Native Playwright specs (.spec.ts)
  features/               # Cucumber BDD feature files
    step_definitions/     # Step definition files
    support/              # Hooks and world setup
reports/                  # HTML test reports (generated)
test-results/             # Trace files and artifacts (generated)
```

## Test Generation — Required First Step

**STOP before generating any test.** Always ask the user:

> "Do you want this as a **Cucumber BDD test** (`.feature` file + step definitions) or a **native Playwright test** (`.spec.ts`)?"

Wait for the answer before writing any code. Do not default to either format.

- **Cucumber** → create a `.feature` file in `tests/features/` and matching step definitions in `tests/features/step_definitions/`
- **Native Playwright** → create a `.spec.ts` file in `tests/` under the appropriate subdirectory

## Basic Checks Before Making Changes

1. **Read before editing.** Always read the target file before modifying it. Never assume structure.

2. **Check existing patterns first.** Before writing a new test or page object, look at an existing one to match the style (imports, fixture usage, locator strategy).

3. **Verify the config.** Tests use `config/playwright.config.js`. The `testDir` is `../tests`. Cucumber tests use a separate `cucumber.js` config.

4. **Run tests after changes.** After modifying any test or page object, run the relevant spec to confirm it passes:

   ```bash
   npx playwright test <file> --config=config/playwright.config.js
   ```

5. **Match file type to test type.** Native Playwright tests are `.spec.ts` in `tests/`. Cucumber tests are `.feature` files in `tests/features/` with matching step definitions in `tests/features/step_definitions/`.

6. **Tag regression tests.** Any test intended for the regression suite must be tagged `@Regression` in the feature file or via `test.describe` annotation.

7. **No hardcoded credentials.** Test data (users, passwords) belongs in `src/utils/testData.json` or as fixtures in `src/utils/testBase.js`, not inline in specs.

8. **Locator strategy.** Prefer role-based locators (`getByRole`, `getByLabel`) over CSS/XPath selectors. Follow the pattern established in existing specs.

9. **Screenshots and traces** are captured on failure automatically (`screenshot: "only-on-failure"`, `trace: "retain-on-failure"`). Do not add redundant manual screenshot calls.

10. **Use the shared logger — never `console.log()`.** Import and use the shared logger from `src/utils/logger.js` (or `logger.ts`) wherever logging is needed — in tests, step definitions, page objects, and utilities. Do not use raw `console.log()`, `console.warn()`, or `console.error()` calls anywhere in the codebase.

    ```ts
    import { logger } from '../../src/utils/logger';

    logger.info('Navigating to product page');
    logger.warn('Element not immediately visible, retrying...');
    logger.error('Login failed', error);
    ```

    If the shared logger does not yet exist, create it at `src/utils/logger.ts` before using it.

11. **Do not modify `node_modules/` or generated output** (`reports/`, `test-results/`, `playwright-report/`).

## Key Conventions

- Tests default to Chromium headless in CI, headed locally (set in `playwright.config.js` per project)
- Timeout is 30 seconds globally
- Retries: 0 locally, 2 on CI
- `fullyParallel: true` — tests must be independent with no shared state
