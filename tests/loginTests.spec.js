const { test, expect } = require("@playwright/test");
const exp = require("constants");

test("Home Page Title Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");

	//Printing the title of the Landing page
	console.log(await page.title());
	await expect(page).toHaveTitle("Home Page");
});

test("Sign In Page Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	await page.locator("//li[@class='authorization-link']").first().click();
	console.log(await page.title());
});

test("Invalid Sign In Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	// Click on Sign In button
	await page.locator("//li[@class='authorization-link']").first().click();

	const alert = page.locator(
		"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
	);
	await expect(alert).toHaveCount(0);

	await page.locator("//input[@name='login[username]']").fill("jai@mail.com");
	await page.locator("//input[@name='login[password]']").fill("p@sswor!d");
	await page.locator("//button[@name='send']").first().click();

	await expect(alert).toHaveCount(1);
	await expect(alert).toBeVisible();
	console.log(await alert.textContent());
	await expect(alert).toContainText("incorrect");
});

test("Create Invalid Account Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	// Click on Sign In button
	await page
		.locator(
			"//a[@href='https://magento.softwaretestingboard.com/customer/account/create/']"
		)
		.first()
		.click();

	console.log(await page.title());
	await expect(page).toHaveTitle("Create New Customer Account");
});

test("Create Account With Weak Strength Password Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto(
		"https://magento.softwaretestingboard.com/customer/account/create/"
	);
	await expect(page).toHaveTitle("Create New Customer Account");

	await page.locator("//input[@id='firstname']").fill("Liam");
	await page.locator("//input[@id='lastname']").fill("Konisegg");
	await page.locator("//input[@id='email_address']").fill("liam.k@mail.com");
	await page.locator("//input[@id='password']").fill("WeakPass");
	await page.locator("//input[@id='password-confirmation']").fill("WeakPass");
	await page.locator("//button[@class='action submit primary']").click();

	await expect(
		page.locator("//div[@id='password-strength-meter']")
	).toContainText("Weak");
	await expect(page.locator("//div[@id='password-error']")).toContainText(
		"Minimum of different classes of characters in password is 3. Classes of characters: Lower Case, Upper Case, Digits, Special Characters."
	);
});

test("Create Account With Medium Strength Password Test", async ({
	browser,
}) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto(
		"https://magento.softwaretestingboard.com/customer/account/create/"
	);
	await expect(page).toHaveTitle("Create New Customer Account");

	await page.locator("//input[@id='firstname']").fill("Natalie");
	await page.locator("//input[@id='lastname']").fill("Konisegg");
	await page.locator("//input[@id='email_address']").fill("liam.k@mail.com");
	await page.locator("//input[@id='password']").fill("MediP@ss");
	await page.locator("//input[@id='password-confirmation']").fill("MediP@ss");

	await expect(
		page.locator("//div[@id='password-strength-meter']")
	).toContainText("Medium");
});

test("Successful Login Test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://magento.softwaretestingboard.com/");
	// Click on Sign In button
	await page.locator("//li[@class='authorization-link']").first().click();

	const alert = page.locator(
		"//div[@data-bind='html: $parent.prepareMessageForHtml(message.text)']"
	);
	await expect(alert).toHaveCount(0);

	await page
		.locator("//input[@name='login[username]']")
		.fill("liam.k@mail.com");
	await page.locator("//input[@name='login[password]']").fill("MediP@ss");
	await page.locator("//button[@name='send']").first().click();

	await expect(page).toHaveTitle("Home Page");
	await expect(
		page.locator("//span[@class='logged-in']").first()
	).toContainText("Welcome, Liam Konisegg!");
});
