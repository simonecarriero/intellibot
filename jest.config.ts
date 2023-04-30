import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`**/?(*.)+(test).ts`],
  verbose: true,
};
export default config;
