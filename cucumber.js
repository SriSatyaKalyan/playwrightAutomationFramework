module.exports = {
	default: [
		"--publish",
		"--require tests/features/step_definitions/**/*.js",
		"--require tests/features/support/**/*.js",
	].join(" "),
};
