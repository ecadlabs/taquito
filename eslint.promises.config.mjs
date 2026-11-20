import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(globalIgnores(['**/dist/**', '**/*.d.ts']), {
  files: ['packages/*/{src,test}/**/*.ts'],
  linterOptions: { reportUnusedDisableDirectives: 'off' },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.lint-promises.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: { '@typescript-eslint': tseslint.plugin },
  rules: {
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
});
