// @ts-check
const { defineConfig, devices, webkit } = require("@playwright/test");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
	testDir: "./tests",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		launchOptions: {
			args: ["--start-maximized"],
			// args: ["--window-size=1728,1117"],
		},
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "retain-on-failure",
		browserName: "chromium",
		screenshot: "only-on-failure",
		headless: true,
	},
	timeout: 30 * 1000,

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {
				// ...devices["iPhone 11"],
				...devices["Desktop Chrome"],
				trace: "retain-on-failure",
				browserName: "chromium",
				screenshot: "only-on-failure",
				headless: true,
			},
		},
		// {
		// 	name: "safari",
		// 	use: {
		// 		...devices["Desktop Safari"],
		// 		trace: "retain-on-failure",
		// 		browserName: "chromium",
		// 		screenshot: "only-on-failure",
		// 		headless: true,
		// 		viewport: {
		// 			width: 850,
		// 			height: 720,
		// 		},
		// 	},
		// },
		//commented below section because it is repeating tests
		// {
		//   name: "firefox",
		//   use: { ...devices["Desktop Firefox"] },
		// },

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
