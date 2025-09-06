import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import imports from 'eslint-plugin-import'
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
      'react': react,
      'import': imports,
      prettier: pluginPrettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: ['./tsconfig.json'] },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error', // Abilita regola Prettier

      // ✅ AFC only
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // 🚫 Niente default export (preferisci named exports)
      'import/no-default-export': 'error',

      // 🚫 Blocca import relativi oltre ../../
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../../*', '../../../*/*', '../../../*/*/*'],
              message: 'Usa alias invece di percorsi relativi oltre ../..',
            },
          ],
        },
      ],

      // Ordine import coerente (opzionale ma consigliato)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

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

      // Pulizia consigliata
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.stories.@(ts|tsx)', '**/App.tsx', '**/main.tsx', '**/vite.config.ts'],
    rules: { 
      'import/no-default-export': 'off',
      'react/function-component-definition': 'off'
    },
  }
)
