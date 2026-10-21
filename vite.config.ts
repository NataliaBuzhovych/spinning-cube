import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // App.tsx and main.tsx are the WebGL/DOM entry points; they are
      // exercised by the Playwright e2e tests, not by unit tests.
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test-setup.ts',
        'src/App.tsx',
        'src/main.tsx',
      ],
      reporter: ['text', 'lcov'],
      // Set from actual coverage; raise when it improves, never lower.
      thresholds: { statements: 87, branches: 50, functions: 100, lines: 100 },
    },
  },
})
