import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript"],
	env: {
		browser: true,
	},
	rules: {
		// Keep browser clipboard failures visible during debugging.
		"no-console": "off",
	},
});
