import js from '@eslint/js';
import html from 'eslint-plugin-html';
import globals from 'globals';

export default [
  js.configs.recommended,

  // Algemene instellingen voor alles
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    }
  },

  // JavaScript specifieke regels
  {
    files: ['**/*.js'],
    rules: {
      'camelcase': ['error', { properties: 'always' }],
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      'no-console': 'off',
      'max-lines': ['warn', 300],
      'max-depth': ['warn', 3],
      'no-undef': 'off',
    }
  },

  // EJS/HTML ondersteuning (voorkomt de < error)
  {
    files: ['**/*.ejs', '**/*.html'],
    plugins: { html },
    rules: { 'no-console': 'off' }
  }
];