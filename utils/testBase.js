// author: kalyan kallepalli
const base = require("@playwright/test");

exports.customTest = base.test.extend({
	testDataForSignIn: {
		strength: "Medium",
		firstName: "Bryan",
		lastName: "Konisegg",
		emailAddress: "bryan.k@gmail.com",
		password: "MediP@ss",
	},
});
