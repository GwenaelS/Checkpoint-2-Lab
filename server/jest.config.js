/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/tests/install.test.ts",
    "/tests/item/routes.spec.ts",
    "/tests/user/user.spec.ts",
    "/tests/task/task.spec.ts",
    "/tests/project/project.spec.ts",
  ],
};
