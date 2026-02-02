const js = require('@eslint/js');
const ts = require("@typescript-eslint/eslint-plugin");

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  {
    ignores: ["node_modules/*", "docs/*", "dist/*"]
  },
  {
    ...js.configs.recommended,
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        es6: true,
        browser: true,
        node: true,
        jest: true
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      jest: jestPlugin
    },
    rules: {
      ...ts.configs.recommended.rules,
      semi: "error",
      "no-unreachable-loop": "warn",
      "no-unsafe-optional-chaining": "warn",
      eqeqeq: "error",
      "no-alert": "error",
      "prefer-spread": "error",
      "no-duplicate-imports": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-extend-native": "warn",
      "no-new-wrappers": "error",
      "no-proto": "error",
      "no-script-url": "error",
      "no-self-compare": "warn",
      "no-useless-catch": "warn",
      "no-throw-literal": "error",
      "no-var": "warn",
      "no-labels": "error",
      "no-undefined": "off",
      "no-new-object": "error",
      "no-multi-assign": "warn",
      "prefer-const": "warn",
      "prefer-numeric-literals": "warn",
      "prefer-object-spread": "error",
      "prefer-rest-params": "error",
      "prefer-exponentiation-operator": "error",
      "no-lonely-if": "error",
      radix: "warn",
      camelcase: "warn",
      "new-cap": "error",
      quotes: ["warn", "double", { allowTemplateLiterals: true }],
      "no-void": "error",
      "spaced-comment": ["warn", "always"],
      "eol-last": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/no-namespace": [
        "error",
        { allowDefinitionFiles: true }
      ]
    }
  },
  {
    files: ["*.browser.js"],
    env: {
      browser: true
    }
  }
];