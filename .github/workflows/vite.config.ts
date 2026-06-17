import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    sourcemap: false,
  },
  server: {
    watch: {
      ignored: ['**/generated/**', '**/node_modules/**'],
    },
  },
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/generated/**', '**/dist/**'],
    environment:
      './prisma/vitest-environment-prisma /prisma-test-environment .ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**'],
      exclude: [
        'src/lib/**',
        'src/utils/**',
        'src/env/**',
        'src/server.ts',
        'src/app.ts',
        'src/@types/**',
      ],
    },
  },
})
