module.exports = {
	default: [
		"--publish",
		"--require ./step_definitions/**/*.js",
		"--require ./support/**/*.js",
	].join(" "),
};
