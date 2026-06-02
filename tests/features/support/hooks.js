const { Before, After } = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");

const DEFAULT_TIMEOUT = 60_000;

Before(async function () {
	this.setDefaultTimeout?.(DEFAULT_TIMEOUT);
	this.browser = await chromium.launch({
		args: ["--start-maximized"],
	});

	this.context = await this.browser.newContext();
	this.page = await this.context.newPage();
});

After(async function () {
	await this.context?.close();
	await this.browser?.close();
});
