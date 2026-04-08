/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/tests/install.test.ts",
    "/tests/item/routes.spec.ts",
  ],
};
