import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript"],
	env: {
		browser: true,
	},
	rules: {
		// Disabled to maintain parity with the previous tslint configuration
		"eqeqeq": "off",
		"no-empty": "off",
		"no-bitwise": "off",
		"no-console": "off",
	},
});
