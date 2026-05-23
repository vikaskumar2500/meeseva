import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 10_000,
    env: {
      MONGOMS_MD5_CHECK: 'false',
    },
  },
});
