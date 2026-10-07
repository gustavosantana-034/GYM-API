import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    watch: {
      ignored: ['**/generated/**', '**/node_modules/**'],
    },
  },
  test: {
    globals: true,
    exclude: ['**/node_modules/**', '**/generated/**', '**/build/**'],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [
            'src/use-cases/**/*.spec.ts',
            'src/utils/**/*.spec.ts',
            'src/providers/**/*.spec.ts',
            'src/lib/**/*.spec.ts',
          ],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/http/**/*.spec.ts'],
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**'],
      exclude: [
        'src/lib/**',
        'src/env/**',
        'src/server.ts',
        'src/app.ts',
        'src/@types/**',
        'src/**/*.spec.ts',
      ],
    },
  },
})
