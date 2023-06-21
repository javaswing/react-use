import type { Config } from "jest";

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig: Config = {
  /**
   * define use ts to compile all .ts files
   * @link https://jestjs.io/docs/configuration/#preset-string
   * @link https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/#jest-config-file
   *
   */
  preset: "ts-jest",

  /**
   * automatically clear mock calls
   * @link https://jestjs.io/docs/configuration/#clearmocks-boolean
   */
  clearMocks: true,

  /**
   * Indicates whether the coverage information should be collected while executing the test
   * @link https://jestjs.io/docs/configuration/#collectcoverage-boolean
   */
  collectCoverage: true,

  /**
   * The directory where Jest should output its coverage files
   * @link https://jestjs.io/docs/configuration/#coveragedirectory-string
   */
  coverageDirectory: "coverage",

  /**
   * The glob patterns Jest uses to detect test files.
   * @link https://jestjs.io/docs/configuration/#testmatch-arraystring
   */
  testMatch: ["<rootDir>/tests/**/*.test.(ts|tsx)"],

  /**
   * define global setup test file patterns
   * @link https://jestjs.io/docs/configuration/#setupfiles-array
   */
  setupFiles: ['<rootDir>/tests/setupTests.ts']
};

export default baseConfig;
