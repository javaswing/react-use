import type { Config } from 'jest';
import baseConfig from './jest.config.base';

const config: Config = {
  ...baseConfig,

  /**
   * The test environment that will be used for testing.
   * @link https://jestjs.io/docs/configuration/#testenvironment-string
   */
  testEnvironment: 'jsdom',
};

export default config;
