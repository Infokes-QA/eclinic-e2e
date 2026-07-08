const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "reports/",
      "screenshots/",
      "test-results/",
      "playwright-report/",
      "cucumber.js",
      "eslint.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["src/**/*.ts", "playwright.config.ts"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "error",
      "no-console": "off",
    },
  },
];
