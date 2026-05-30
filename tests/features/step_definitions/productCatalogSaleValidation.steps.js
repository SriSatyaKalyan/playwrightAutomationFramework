const { Given, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Given("I open the Bellatrix shop home page", async function () {
	await this.page.goto("https://demos.bellatrix.solutions/");
});

Then(
	"I should see {int} products in the catalog result count",
	async function (count) {
		const main = this.page.getByRole("main");
		await expect(
			main
				.getByText(new RegExp(`Showing all ${count} results`, "i"))
				.first(),
		).toBeVisible();
	},
);

Then(
	"the following products should be marked as sale with correct prices:",
	async function (dataTable) {
		const rows = dataTable.hashes();
		const productsList = this.page
			.getByRole("main")
			.getByRole("list")
			.first();

		for (const row of rows) {
			const card = productsList.getByRole("listitem").filter({
				has: this.page.getByRole("heading", {
					name: new RegExp(`^${escapeRegex(row.product)}$`, "i"),
					level: 2,
				}),
			});

			await expect(card).toBeVisible();
			await expect(card.getByText(/^Sale!$/i)).toBeVisible();
			await expect(card).toContainText(
				new RegExp(escapeRegex(row.originalPrice), "i"),
			);
			await expect(card).toContainText(
				new RegExp(escapeRegex(row.salePrice), "i"),
			);
		}
	},
);

function escapeRegex(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
