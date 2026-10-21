import js from '@eslint/js'
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import playwright from 'eslint-plugin-playwright'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Tests must run: no skipped, focused, todo or disabled tests.
    files: ['src/**/*.test.{ts,tsx}'],
    plugins: { vitest },
    rules: {
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/warn-todo': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='skipIf']",
          message: 'Conditionally skipped tests are not allowed.',
        },
        {
          selector: "CallExpression[callee.name='skip']",
          message: 'Skipping a test at runtime is not allowed.',
        },
      ],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-skipped-test': ['error', { allowConditional: false }],
      'playwright/no-focused-test': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='fixme']",
          message: '.fixme disables a test and is not allowed.',
        },
      ],
    },
  },
  {
    // The test-integrity rules cannot be switched off with comments.
    files: ['src/**/*.test.{ts,tsx}', 'e2e/**/*.ts'],
    linterOptions: { noInlineConfig: true },
    plugins: { '@eslint-community/eslint-comments': eslintComments },
    rules: {
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/no-restricted-disable': [
        'error',
        '@vitest/*',
        'vitest/*',
        'playwright/*',
        'no-restricted-syntax',
        '@eslint-community/*',
      ],
    },
  },
  prettier,
)
