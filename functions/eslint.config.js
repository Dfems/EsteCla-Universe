import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['lib'] },
  {
    files: ['src/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Consentiamo log lato server
      'no-console': 'off',
      // Rigorosità TS (in linea con root)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // Stabilità/complessità server
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-depth': ['warn', 4],
      complexity: ['warn', 12],
      'max-params': ['warn', 6],
      // Evita conflitti con Prettier
      'prettier/prettier': 'off',
    },
  }
)
