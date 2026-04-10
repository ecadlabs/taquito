import { defineConfig, mergeConfig } from 'vitest/config';
import shared from './vitest.shared';

export const definePackageVitestConfig = (name: string) =>
  mergeConfig(
    shared,
    defineConfig({
      test: {
        name,
        include: ['test/**/*.spec.ts'],
        coverage: {
          provider: 'v8',
          reporter: ['json', 'text-summary'],
          include: ['src/**/*.{js,ts}'],
        },
      },
    })
  );
