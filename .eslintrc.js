module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: [
    'standard-with-typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/unbound-method': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ]
}
