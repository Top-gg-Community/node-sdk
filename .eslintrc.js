module.exports = {
  ignorePatterns: ["node_modules/*", "docs/*", "dist/*"],
  extends: "@top-gg/eslint-config",
  parserOptions: {
    project: "./tsconfig.json",
  }
};
