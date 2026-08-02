/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.integration.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  // Sequential, not parallel: all integration test files share one
  // DynamoDB Local instance (no per-worker isolation), so running them
  // concurrently risks noisy-neighbor timing issues on a single-node
  // container. The suite is small enough that this costs little.
  maxWorkers: 1,
};
