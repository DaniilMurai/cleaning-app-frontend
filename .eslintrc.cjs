module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@tanstack/eslint-plugin-query/recommended",
	],
	ignorePatterns: [
		"dist",
		".eslintrc.cjs",
		"orval.config.ts",
		"vite-env.d.ts",
		"localisation-types.js",
		"**/*.d.ts",
		"expo-plugin-remove-media-permissions.js",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh"],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"no-mixed-spaces-and-tabs": "off",
		"react-hooks/exhaustive-deps": [
			"warn",
			{
				additionalHooks: "(useThrottled|useDebounced)",
			},
		],
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
		tsconfigRootDir: __dirname,
	},
};
