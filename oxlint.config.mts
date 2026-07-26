import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript"],
	env: {
		browser: true,
	},
	rules: {
		// Disabled to match rules that were explicitly turned off in tslint.json
		"eqeqeq": "off",
		"no-empty": "off",
		"no-bitwise": "off",
		"no-console": "off",
	},
});
