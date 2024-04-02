const { LoginPage } = require("../pageObjects/loginPage");
const { HomePage } = require("../pageObjects/homePage");
const { WomensPage } = require("../pageObjects/womensPage");
const { MensPage } = require("../pageObjects/mensPage");
const { SignInPage } = require("./signInPage");
const { CreateAccountPage } = require("./createAccountPage");

class pageObjectManager {
	constructor(page) {
		this.page = page;
		this.loginPage = new LoginPage(page);
		this.homePage = new HomePage(page);
		this.womenPage = new WomensPage(page);
		this.menPage = new MensPage(page);
		this.signInPage = new SignInPage(page);
		this.createAccountPage = new CreateAccountPage(page);
	}

	getAccountPage(){
		return this.createAccountPage;
	}

	getLoginPage() {
		return this.loginPage;
	}

	getSignInPage() {
		return this.signInPage;
	}

	getHomePage() {
		return this.homePage;
	}

	getWomenPage() {
		return this.womenPage;
	}

	getMenPage() {
		return this.menPage;
	}
}

module.exports = { pageObjectManager };
