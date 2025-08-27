import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginPrettier from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
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
      // Evita warning che fanno fallire con --max-warnings=0 negli entry file
      'react-refresh/only-export-components': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@estecla/ui',
              message:
                'Importa dai sotto-path (es. @estecla/ui/feedback), non dal root @estecla/ui.',
            },
          ],
          patterns: [
            {
              group: [
                '@estecla/ui/src',
                '@estecla/ui/src/*',
                '@estecla/ui/*/src',
                '@estecla/ui/*/src/*',
              ],
              message:
                'Evita import interni alla sorgente: usa solo gli entrypoint pubblici (subpath exports).',
            },
          ],
        },
      ],
    },
  }
)
