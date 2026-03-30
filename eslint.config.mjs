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
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      'no-console': 'off',
      'max-depth': ['warn', 3],
      'no-undef': 'off',
    }
  },

  {
    files: ['**/*.html'],
    rules: {
      "tag-pair": true,
      "attr-value-not-empty": true,
      "id-unique": true,
      "src-not-empty": true,
      "alt-require": true,
      "doctype-first": false,
      "style-disabled": true
    }
  },

  //  EJS/HTML ondersteuning (voorkomt de < error)
   {
    files: ['**/*.ejs', '**/*.html', '**/*.js'],
    plugins: { html },
    rules: { 'no-console': 'off' }
  }
];