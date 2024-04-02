const base = require("@playwright/test");

exports.customTest = base.test.extend({
	testDataForSignIn: {
		strength: "Medium",
		firstName: "Liam",
		lastName: "Konisegg",
		emailAddress: "liam.k@mail.com",
		password: "MediP@ss",
	},
});
