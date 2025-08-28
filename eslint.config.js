import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['**/dist/**', 'functions/**', 'firebase/**', 'node_modules/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: pluginPrettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error', // Abilita regola Prettier

      // anti "god component" / funzioni troppo grandi
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-depth': ['warn', 4],
      complexity: ['warn', 12],
      'max-params': ['warn', 6],

      // tipi più rigorosi & riuso sensato
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Enforce subpath-only imports for @estecla/ui and forbid source deep imports
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@estecla/ui',
              message:
                'Import from subpaths (e.g., @estecla/ui/feedback), not the root @estecla/ui.',
            },
          ],
          patterns: [
            {
              group: [
                '@estecla/ui/src',
                '@estecla/ui/src/*',
                '@estecla/ui/*/src',
                '@estecla/ui/*/src/*',
                '@ui/*',
                '**/packages/ui/src',
                '**/packages/ui/src/*',
              ],
              message:
                'Do not import UI package source files directly. Use only public subpath entrypoints.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  }
)
