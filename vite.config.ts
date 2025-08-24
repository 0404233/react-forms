/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/react-forms/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/index.{js,jsx,ts,tsx}',
        'src/setupTests.{js,ts}',
        'src/**/*.d.ts',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
